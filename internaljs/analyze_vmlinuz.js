
const vmLinuzFormats = {
    // Gzip: https://tools.ietf.org/html/rfc1952#page-5
    "gzip": new Uint8Array([0x1f, 0x8b]),
    // XZ: https://tukaani.org/xz/xz-file-format.txt
    "xz": new Uint8Array([0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00]),
    // bzip2: https://en.wikipedia.org/wiki/Bzip2#File_format
    "bzip2": new Uint8Array([0x42, 0x5a]),
    // LZMA: https://github.com/cscott/lzma-purejs/blob/master/FORMAT.md
    "lzma": new Uint8Array([0x5d, 0x00, 0x00]),
    // LZOP: http://fileformats.archiveteam.org/wiki/Lzop
    "lzo": new Uint8Array([0x89, 0x4c, 0x5a])
};

const vmLinuzExtractorFuncs = {
    "gzip": gzipExtractor
};

function analyzeVmlinuz(dataArray, options, vmlinuzElem, reporter) {
    reporter.updateStatus('Analysing as vmlinuz...');

    var elfData;
    var detectedFormat = "unknown";
    for (let format in vmLinuzFormats) {
        reporter.updateStatus("Looking for the " + format + " marker in stream...");
        const formatArray = findFormat(dataArray, vmLinuzFormats[format]);
        if (typeof(formatArray) !== 'undefined') {
            detectedFormat = format;
            elfData = handleFormat(reporter, format, formatArray);
            break;
        }
    }

    if (typeof(elfData) === 'undefined') {
        reporter.updateStatus("Kernel was not extracted. Possibly because there was an error decompressing the data, or " +
            "because we do not have a decompression algorithm for the format built in yet. Aborting processing.");
        return;
    }

    const vmlinuzStatus = $('<div class="vmlinuzInfoWrapper"><span class="vmlinuzInfo">VMLinuz decompressed using format '
        + detectedFormat + '</span></div>');
    const save = $('<a href="#" class="save">(Save extracted vmlinux)</a><br/>');
    save.click(function(){
        saveAs(new Blob([elfData], {type: "application/octet-stream"})
            , "vmlinux");
    });

    vmlinuzStatus.append(save);
    vmlinuzElem.append(vmlinuzStatus);


    return analyzeElf(elfData, options, vmlinuzElem, reporter);
}

function findFormat(arraybuf, searchArray) {
    const dataArray = new Uint8Array(arraybuf, 0, arraybuf.length);
    var lastIndex = -1;
    do {
        lastIndex = dataArray.indexOf(searchArray[0], lastIndex+1);
        if (lastIndex >= 0) {
            var found = true;
            for (let i = 1; i < searchArray.length; i++) {
                if (dataArray[lastIndex+i] !== searchArray[i]) {
                    found = false;
                    break;
                }
            }

            if (found) {
                return dataArray.subarray(lastIndex);
            }
        }
    } while (lastIndex != -1);
    return;
}

function handleFormat(reporter, format, formatArray) {
    reporter.updateStatus("Seems we found the marker for " + format + ". Proceeding to extraction...")

    const ef = vmLinuzExtractorFuncs[format];
    if (typeof(ef) === 'undefined') {
        reporter.updateStatus("No extractor exists for compressed format " + format + ". Aborting parse.");
        return;
    }

    return ef(reporter, formatArray);
}

function gzipExtractor(reporter, formatArray) {
    reporter.updateStatus("Attempting to ungzip the compressed data....")
    try {
        return pako.ungzip(formatArray);
    } catch (e) {
        reporter.update("Error when attempting to ungzip the compressed kernel: " + e);
        return undefined;
    }
}