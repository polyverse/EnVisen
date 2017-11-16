
$(document).ready(attachVisualizers);

function attachVisualizers() {
    var divs = $('div.binaryVisualizer');
    divs.empty();
    divs.each(function(index) {
        attachVisualizer(this, index);
    })
}

function attachVisualizer(domElem, index) {

    if (!domElem) {
        console.log('Found domElement empty: ' + domElem)
        return
    }

    var visualizerHtml =
    '<div class="file_collector" id="file_collector' + index + '">' +
        '<input class="file" type="file" id="file' + index + '"/>' +
        '<div class="drop_zone" id="drop_zone' + index + '">Drop file here</div>' +
    '</div>' +
    '<span id="filename' + index + '" style="display:none"></span>' +
    '<div id="analysis' + index + '" style="display:none"></div>' +
    '<canvas class="visualization" id="visualization' + index + '" style="display:none"></canvas>';

    var jqThis = $(domElem)
    // Check for the various File API support.
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        jqThis.append("<p>Unable to render binary visualizer due to unsupported File APIs in this browser.</p>");
        return;
    }

    jqThis.append(visualizerHtml)

    document.getElementById('file' + index).addEventListener('change', getFileSelectHandler(getFileProcessor(index)), false);

    // Setup the dnd listeners.
    var dropZone = document.getElementById('drop_zone' + index);
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', getFileDropHandler(getFileProcessor(index)), false);
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function getFileSelectHandler(processFiles) {
    return function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
        processFiles(files)
    }
}

function getFileDropHandler(processFiles) {
    return function handleFileDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files; // FileList object.
        processFiles(files)
    }
}

function getFileProcessor(index) {
    return function processFiles(files) {
        document.getElementById('file_collector' + index).style = 'display:none';
        var fileElem = document.getElementById('filename' + index);
        fileElem.style = "display:block";
        var analysisElem = document.getElementById('analysis' + index);
        analysisElem.style = "display:block";
        var canvasElem = document.getElementById("visualization" + index);
        canvasElem.style = "display:block";

        if (files.length != 1) {
            fileElem.innerHTML = 'Number of files selected must be exactly 1. We found: ' + files.length;
            return;
        }

        var f = files[0];
        var reader = new FileReader();
        reader.onabort = function(event) {
            $(fileElem).append(' Aborted!');
        }
        reader.onerror = function(event) {
            console.log(event);
            $(fileElem).append(' Error! View Console log for error details.');
        }
        reader.onprogress = function (event) {
            fileElem.innerHTML = '<strong>' + escape(f.name) + '</strong> - Begun loading of ' + f.size + ' bytes';
        }
        reader.onloadstart = function (event) {
            if (event.lengthComputable) {
                fileElem.innerHTML = '<strong>' + escape(f.name) + '</strong> - Loaded ' + event.loaded + ' of ' + event.total + ' bytes';
            }
        }

        reader.onload = function(event) {
            fileElem.innerHTML = '<strong>' + escape(f.name) + '</strong> - Loaded all ' + f.size + ' bytes';
            analyzeResultErrorCapture(event.target.result, analysisElem, canvasElem)
        }

        reader.readAsArrayBuffer(f)
    }
}
