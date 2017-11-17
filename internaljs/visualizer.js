
$(document).ready(attachVisualizers);

function attachVisualizers() {
    var divs = $('div.binaryVisualizer');
    divs.empty();
    divs.each(function(index, domElem) {
        attachVisualizer(domElem, index);
    })
}

function attachVisualizer(domElem, index) {

    var rootElem = $(domElem)
    var title = rootElem.data("title");

    var visualizerHtml =
    '<div class="file-collector" id="file-collector' + index + '">' +
      '<div class="file-title" id="file-title' + index + '">'+title+'</div>' +
      '<p>Select a file or drag/drop a file on the selector  ' +
      'below, to get a complete ELF expansion, along with ROP gadget table out of it.</p></br>' +

      '<input class="file" type="file" id="file' + index + '"/>' +
      '<div class="drop-zone" id="drop-zone' + index + '">Drop file here</div>' +
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
    var dropZone = $('#drop-zone' + index);
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
        var files = evt.originalEvent.target.files; // FileList object
        processFiles(files)
    }
}

function getFileDropHandler(processFiles) {
    return function handleFileDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.originalEvent.dataTransfer.files; // FileList object.
        processFiles(files)
    }
}

function getFileProcessor(index) {
    return function processFiles(files) {
        var fc = $('#file-collector' + index);
        fc.toggle();
        var fileElem = $('#filename' + index);
        fileElem.toggle();
        var analysisElem = $('#analysis' + index);
        analysisElem.toggle();

        var progressLogs = $("#progress-logs" + index);

        var progressBarElem = progressLogs.children("#progress" + index);
        var bar = new tinyProgressbar(progressBarElem.get(0));
        bar.setMinMax(0, 4);
        bar.message("Initializing...");

        var logs = progressLogs.children("#logs" + index);
        var reporter = {};
        var statusBuffer = "";


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
        reporter.completedElf = function() {
          updateStatusAndProgress(2, "Completed ELF analysis!");
        }
        reporter.completedRop = function()  {
          updateStatusAndProgress(3, "Completed ROP analysis!");
        }
        reporter.completedAnalysis = function()  {
          updateStatusAndProgress(4, "Completed all analysis!");

          //unblock the next one
          nindex = index+1;
          $("#file-collector" + nindex).unblock();
        }

        progressBarElem.click(function() {
            logs.toggle();
        });
        progressLogs.toggle();

        if (files.length != 1) {
            fileElem.innerHTML = 'Number of files selected must be exactly 1. We found: ' + files.length;
            return;
        }

        var f = files[0];
        var reader = new FileReader();
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
          analyzeResultErrorCapture(index, event.target.result, analysisElem, reporter);
        }

        fileElem.append('<strong>' + escape(f.name) + '</strong>');
        reader.readAsArrayBuffer(f);
    }
}
