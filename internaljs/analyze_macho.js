function analyzeMachO(dataArray, options,  machoElem, reporter) {
    var ks = new KaitaiStream(dataArray, 0)
    macho = new MachO(ks)
    options = setMachODefaults(options, macho);

    reporter.updateStatus('Analysing MachO data...');

        machoElem.append(
        '<span><i>Magic</i>: <b>' + MachO.MagicType[macho.magic] +
        '<span><i>File</i>: <b>' + MachO.FileType[macho.header.filetype] +
        '</b>, <i>CPU</i>: <b>' + MachO.CpuType[macho.header.cputype] +
        '</b>, <i>CPU Subtype</i>: <b>' + macho.header.cpusubtype +
        '</b>, <i>Flags</i>: <b>' + macho.header.flags + ' (' + interpretFlags(macho.header.flags, MachO.MachoFlags) + ')' +
        '</b>.</span><br/>');

        var expando = $('<a href="#">Show/Hide MachO Details</a>')
        var expansionDiv = $('<div style="display: none"></div>');
        machoElem.append(expando)
        machoElem.append(expansionDiv)
        expando.click(function() {
          expansionDiv.toggle();
        });

        expansionDiv.append('<H5>Load Commands</H5>');
        var tableWrapper = $('<div class="clusterize-scroll"/>');
        expansionDiv.append(tableWrapper);

        //fill in expansionDiv with section and program headers
        var loadCommandsTable = $('<table/>');
        tableWrapper.append(loadCommandsTable);

        loadCommandsTable.append('<thead><tr>' +
        '<th>Type</th>' +
        '<th>Size</th>' +
        +'</tr></thead>');

        var tbody = $('<tbody class="clusterize-content"/>');
        loadCommandsTable.append(tbody);

        var rows = [];
        for (let lci in macho.loadCommands) {
          var lc = macho.loadCommands[lci];
          var lcstr = '<tr>' +
          '<td>' + MachO.LoadCommandType[lc.type] + '</td>' +
          '<td>' + lc.size + '</td>' +
          '</tr>';
          rows.push(lcstr);
        }
        var clusterize = new Clusterize({
          scrollElem: tableWrapper.get(0),
          contentElem: tbody.get(0),
          rows: rows
        });

        reporter.updateStatus("Converting MachO program segments " +
          "into struct for ROP finder to work in a Worker process..<br/>");

        var sections = [];

        /*
        for (var phi in elf.header.programHeaders) {
          var ph = elf.header.programHeaders[phi];
          if (ph.flags & Elf.PhFlags["PF_X"]){

            try {
              const bodyContents = ph.body;
              var section = {
                offset: ph.offset,
                size: ph.memsz,
                vaddr: ph.vaddr,
                opcodes: bodyContents,
              };
              sections.push(section);
            } catch (e) {
                reporter.updateStatus("Skipping section " + phi + " due to exception: " + e);
            }
          }
        }*/


    return [sections, options];
}



function setMachODefaults(options, macho) {
  if (options.arch == "auto detect") {
    options.arch = machoToArch(macho);
  }

  if (options.bits == "auto detect") {
    options.bits = machoToBits(macho);
  }

  if (options.endian == "auto detect") {
    options.endian = machoToEndian(macho);
  }

  return options;
}

function machoToArch(macho) {
  return "x86";
}

function machoToBits(macho) {
  return "64";
}

function machoToEndian(macho) {
  return "little";
}
