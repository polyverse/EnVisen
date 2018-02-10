function analyzeMachO(dataArray, options,  machoElem, reporter) {
    const ks = new KaitaiStream(dataArray, 0)

    var macho;
    try {
        macho = new MachO(ks)
    } catch (e) {
        throw new FormatParseError(e);
    }

    options = setMachODefaults(options, macho);

    reporter.updateStatus('Analysing MachO data...');

    machoElem.append(
    '<div class="fileInfoWrapper"><span class="fileInfo"><i>Magic</i>: <b>' + MachO.MagicType[macho.magic] +
    '</b>, <span><i>File</i>: <b>' + MachO.FileType[macho.header.filetype] +
    '</b>, <i>CPU</i>: <b>' + MachO.CpuType[macho.header.cputype] +
    '</b>, <i>CPU Subtype</i>: <b>' + macho.header.cpusubtype +
    '</b>, <i>Flags</i>: <b>' + macho.header.flags + ' (' + interpretFlags(macho.header.flags, MachO.MachoFlags) + ')' +
    '</b>.</span></div>');

    var expando = $('<a href="#">Show/Hide MachO Details</a>')
    var expansionDiv = $('<div style="display: none" class="expander"></div>');
    machoElem.append(expando)
    machoElem.append(expansionDiv)
    expando.click(function() {
      expansionDiv.toggle();
    });

    const save = $('<a href="#" class="save">(Save MachO structs as JSON)</a><br/>');
    machoElem.append(save);
    save.click(function(){
      saveAs(new Blob([JSON.stringify(stripParsedBinary(macho), null, 2)], {type: "application/json"})
        , "macho.json");
    });


    expansionDiv.append('<H5>Load Commands</H5>');
    var tableWrapper = $('<div class="clusterize-scroll"/>');
    expansionDiv.append(tableWrapper);

    //fill in expansionDiv with section and program headers
    var loadCommandsTable = $('<table class="clusterizedTable"/>');
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

    for (let lci in macho.loadCommands) {
      const lc = macho.loadCommands[lci];
      if (lc.type == MachO.LoadCommandType["SEGMENT"] || lc.type == MachO.LoadCommandType["SEGMENT_64"]) {

        for (let secti in lc.body.sections) {
          const sect = lc.body.sections[secti];
          if (sect.flags & MachO.SectionFlags["S_ATTR_SOME_INSTRUCTIONS"] ||
            sect.flags & MachO.SectionFlags["S_ATTR_PURE_INSTRUCTIONS"]) {
            try {
              const bodyContents = sect.data;
              var section = {
                name: sect.sectName,
                offset: sect.offset,
                size: sect.size,
                vaddr: sect.addr,
                opcodes: bodyContents,
              };
              sections.push(section);
            } catch (e) {
                reporter.updateStatus("Skipping section " + secti + " due to exception: " + e);
            }

          } //end: if - flags
        } //end: for - sections
      } // end: if - segment/segment64
    } //end: for - loadcommands


    return [sections, [], options];
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
  switch (macho.magic) {
    case MachO.MagicType["MACHO_LE_X86"]:
    case MachO.MagicType["MACHO_LE_X64"]:
    case MachO.MagicType["MACHO_BE_X86"]:
    case MachO.MagicType["MACHO_BE_X64"]:
      return "x86";
    default:
      return "unknown";
  }
}

function machoToBits(macho) {
  switch (macho.magic) {
    case MachO.MagicType["MACHO_LE_X86"]:
    case MachO.MagicType["MACHO_BE_X86"]:
      return "32";
    case MachO.MagicType["MACHO_LE_X64"]:
    case MachO.MagicType["MACHO_BE_X64"]:
      return "64";
    default:
      return "unknown";
  }
}

function machoToEndian(macho) {
  switch (macho.magic) {
    case MachO.MagicType["MACHO_LE_X86"]:
    case MachO.MagicType["MACHO_LE_X64"]:
      return "little";
    case MachO.MagicType["MACHO_BE_X86"]:
    case MachO.MagicType["MACHO_BE_X64"]:
      return "big";
    default:
      return "unknown";
  }
}
