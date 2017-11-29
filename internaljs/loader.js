
$(document).ready(attachVisualizers);

function attachVisualizers() {
    const divs = $('div.binaryVisualizer');
    divs.empty();
    divs.each(function(index, domElem) {
        attachVisualizer(domElem, index);
    })
}

function attachVisualizer(domElem, index) {

    const rootElem = $(domElem)
    const title = rootElem.data("title");

    const visualizerHtml =
    '<div class="file-collector" id="file-collector' + index + '">' +
      '<div class="file-title" id="file-title' + index + '">'+title+'</div>' +
      '<p>Select a file or drag/drop a file on the selector  ' +
      'below to begin analysis. Provide any 32/64 bit ELF/MachO/PE binary across x86/ARM/Sparc/MIPS/PowerPC ' +
      'to get generate a ROP gadget table from it (savable as JSON). '+
      'You may also provide a saved ROP JSON to avoid reparsing the same binary.</p></br>' +
      '<table><tr><td>' +
      '<input class="file" type="file" id="file' + index + '"/>' +
      '<div class="drop-zone" id="drop-zone' + index + '">Drop file here</div>' +
      '</td><td style="vertical-align: top;">' +
      '<span>Architecture:</span><select id="arch' + index + '" value="0">' +
        '<option>Auto Detect</option>' +
        '<option>x86</option>' +
        '<option>ARM</option>' +
        '<option>ARM64</option>' +
        '<option>MIPS</option>' +
        '<option>PPC</option>' +
        '<option>SPARC</option>' +
        '<option>Thumb</option>' +
        '</select><br/>' +
      '<span>Bits:</span><select id="bits' + index + '" value="0">' +
        '<option>Auto Detect</option>' +
        '<option>32</option>' +
        '<option>64</option>' +
        '</select><br/>' +
      '<span>Endian:</span><select id="endian' + index + '" value="0">' +
        '<option>Auto Detect</option>' +
        '<option>Little</option>' +
        '<option>Big</option>' +
        '</select><br/>' +
      '<span>Base Offset:</span><input type="text" id="base_offset' + index + '" value="0"></input><br/>' +
      '</td></tr></table>' +
    '</div>' +

    '<span id="filename' + index + '" style="display:none"></span>' +
    '<div id="progress-logs' + index + '" style="display:none">' +
      '<p id="progress' + index + '"></p>' +
      '<div class="logs" id="logs' + index + '" style="display:none"><strong>'+
      'Log of activities for this file'
      +'</strong><br/></div>' +
    '</div>' +

    '<div id="analysis' + index + '" style="display:none"></div>';

    // Check for the various File API support.
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        rootElem.html("<p>Unable to render binary visualizer due to unsupported File APIs in this browser.</p>");
        return;
    }

    rootElem.append(visualizerHtml)

    $('#file' + index).on('change', getFileSelectHandler(getFileProcessor(index)));

    // Setup the dnd listeners.
    const dropZone = $('#drop-zone' + index);
    dropZone.on('dragover', handleDragOver);
    dropZone.on('drop', getFileDropHandler(getFileProcessor(index)));

    if (index > 0) {
      $('#file-collector'+index).block({
        message: '<h1>Analyze the first file to unblock comparison.</h1>',
        css: { border: '1px solid blue', cursor: 'not-allowed' },
        overlayCSS:  { opacity:         0.2, cursor: 'not-allowed' }
      });
    }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function getFileSelectHandler(processFiles) {
    return function handleFileSelect(evt) {
        const files = evt.originalEvent.target.files; // FileList object
        processFiles(files)
    }
}

function getFileDropHandler(processFiles) {
    return function handleFileDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        const files = evt.originalEvent.dataTransfer.files; // FileList object.
        processFiles(files)
    }
}

function getFileProcessor(index) {
    return function processFiles(files) {
        const fc = $('#file-collector' + index);
        fc.toggle();
        const fileElem = $('#filename' + index);
        fileElem.toggle();
        const analysisElem = $('#analysis' + index);
        analysisElem.toggle();

        const progressLogs = $("#progress-logs" + index);

        const progressBarElem = progressLogs.children("#progress" + index);
        const bar = new tinyProgressbar(progressBarElem.get(0));
        bar.setMinMax(0, 4);
        bar.message("Initializing...");

        const logs = progressLogs.children("#logs" + index);
        const reporter = {};
        let statusBuffer = "";


        setInterval(function() {
          if (statusBuffer.length > 0) {
            logs.append(statusBuffer);
            statusBuffer = "";
          }
        }, 500);

        reporter.updateStatus = function(status) {
          if (!status || status ==  "") {
            return
          }

          statusBuffer += status + "<br/>";
          setTimeout(function() {
            bar.message(status);
          }, 10); //Just don't do this inline
        }

        function updateStatusAndProgress(progress, status) {
          reporter.updateStatus(status);
          bar.progress(progress, status)
        }

        reporter.completedFileLoad = function() {
          updateStatusAndProgress(1, "Completed File loading!");
        }
        reporter.completedFileAnalysis = function() {
          updateStatusAndProgress(3, "Completed File analysis!");
        }
        reporter.completedRop = function()  {
          updateStatusAndProgress(3, "Completed ROP analysis!");
        }
        reporter.completedAnalysis = function()  {
          updateStatusAndProgress(4, "Completed all analysis!");

          //unblock the next one
          const nindex = index+1;
          const nextCollector = $("#file-collector" + nindex);
          if (nextCollector.length > 0) {
            nextCollector.unblock();
          }
          setTimeout(launchComparator, 10);
        }

        progressBarElem.click(function() {
            logs.toggle();
        });
        progressLogs.toggle();

        if (files.length != 1) {
            fileElem.innerHTML = 'Number of files selected must be exactly 1. We found: ' + files.length;
            return;
        }

        const f = files[0];
        const reader = new FileReader();
        reader.onabort = function(event) {
            reporter.updateStatus('Aborted file loading!');
        }
        reader.onerror = function(event) {
            console.log(event);
            reporter.updateStatus(' Error! View Console log for error details.');
        }
        reader.onprogress = function (event) {
          reporter.updateStatus('Loaded ' + event.loaded + ' of ' + event.total + ' bytes');
        }
        reader.onload = function(event) {
          reporter.completedFileLoad();
          const offsetStr = $("#base_offset" + index).val();
          let offset = 0;
          try {
            offset = parseInt(offsetStr, 16);
          } catch (e) {
            reporter.updateStatus("Error occurred parsing offset " + offsetStr + " as a Hexadecimal string. Defaulting to 0.");
            offset = 0;
          }

          const arch = $("#arch" + index).val().toLowerCase();
          const bits = $("#bits" + index).val().toLowerCase();
          const endian = $("#endian" + index).val().toLowerCase();

          const options = {
            offset,
            arch,
            bits,
            endian
          };

          if (options.arch == "thumb") {
            options.arch = "arm";
            options.thumb = true;
          }

          analyzeResultErrorCapture(index, f.name, event.target.result, options, analysisElem, reporter);
        }

        fileElem.append('<strong>' + escape(f.name) + '</strong>');
        reader.readAsArrayBuffer(f);
    }
}
