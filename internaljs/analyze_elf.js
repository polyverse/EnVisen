function analyzeElf(dataArray, options, elfElem, reporter) {
    const ks = new KaitaiStream(dataArray, 0)
    const elf = new Elf(ks)
    reporter.updateStatus('Analysing Elf data...');

    options = setElfDefaults(options, elf);

    elfElem.append(
    '<span><i>Type</i>: <b>' + Elf.ObjType[elf.header.eType] +
    '</b>, <i>Machine</i>: <b>' + Elf.Machine[elf.header.machine] +
    '</b>, <i>Bits</i>: <b>' + Elf.Bits[elf.bits] +
    '</b>, <i>Endian</i>: <b>' + Elf.Endian[elf.endian] +
    '</b>, <i>ABI</i>: <b>' + Elf.OsAbi[elf.abi] +
    '</b>, <i>ABI Version</i>: <b>' + elf.abiVersion +
    '</b>.</span><br/>');

    var expando = $('<a href="#">Show/Hide ELF Details</a>')
    var expansionDiv = $('<div style="display: none"></div>');
    elfElem.append(expando)
    elfElem.append(expansionDiv)
    expando.click(function() {
      expansionDiv.toggle();
    });

    expansionDiv.append('<H5>Program Headers</H5>');
    var tableWrapper = $('<div class="clusterize-scroll"/>');
    expansionDiv.append(tableWrapper);

    //fill in expansionDiv with section and program headers
    var progHeadersTable = $('<table/>');
    tableWrapper.append(progHeadersTable);

    progHeadersTable.append('<thead><tr>' +
    '<th>Type</th>' +
    '<th>Flags</th>' +
    '<th>Offset</th>' +
    '<th>PAddr</th>' +
    '<th>VAddr</th>' +
    '<th>Align</th>' +
    '<th>Filesz</th>' +
    '<th>Memsz</th>' +
    +'</tr></thead>');

    var tbody = $('<tbody class="clusterize-content"/>');
    progHeadersTable.append(tbody);

    var rows = [];
    for (let phi in elf.header.programHeaders) {
      const ph = elf.header.programHeaders[phi];
      const phlstr = '<tr>' +
      '<td>' + ph.type + " (" + Elf.PhType[ph.type] + ')</td>' +
      '<td>' + ph.flags + interpretFlags(ph.flags, Elf.PhFlags) + '</td>' +
      '<td>' + ph.offset + '</td>' +
      '<td>' + ph.paddr + '</td>' +
      '<td>' + ph.vaddr + '</td>' +
      '<td>' + ph.align + '</td>' +
      '<td>' + ph.filesz + '</td>' +
      '<td>' + ph.memsz + '</td>' +
      '</tr>';
      rows.push(phlstr);
    }
    var clusterize = new Clusterize({
      scrollElem: tableWrapper.get(0),
      contentElem: tbody.get(0),
      rows: rows
    });

    expansionDiv.append('<H5>Section Headers</H5>');
    var tableWrapper = $('<div class="clusterize-scroll"/>');
    expansionDiv.append(tableWrapper);

    //fill in expansionDiv with section and program headers
    var sectionHeadersTable = $('<table/>');
    tableWrapper.append(sectionHeadersTable);
    sectionHeadersTable.append('<thead><tr>' +
    '<th>Name</th>' +
    '<th>Type</th>' +
    '<th>Flags</th>' +
    '<th>Addr</th>' +
    '<th>Align</th>' +
    '<th>EntrySize</th>' +
    '<th>Offset</th>' +
    '<th>Size</th>' +
    +'</tr></thead>');

    var tbody = $('<tbody class="clusterize-content"/>');
    sectionHeadersTable.append(tbody);

    var rows = [];
    for (let shi in elf.header.sectionHeaders) {
      const sh = elf.header.sectionHeaders[shi];
      const shlstr = '<tr>' +
        '<td>' + sh.name + '</td>' +
        '<td>' + Elf.ShType[sh.type] + '</td>' +
        '<td>' + sh.flags + interpretFlags(sh.flags, Elf.ShFlags) + '</td>' +
        '<td>' + sh.addr + '</td>' +
        '<td>' + sh.align + '</td>' +
        '<td>' + sh.entrySize + '</td>' +
        '<td>' + sh.offset + '</td>' +
        '<td>' + sh.size + '</td>' +
        '</tr>';
      rows.push(shlstr);
    }
    var clusterize = new Clusterize({
      scrollElem: tableWrapper.get(0),
      contentElem: tbody.get(0),
      rows: rows
    });

    reporter.updateStatus("Converting ELF program segments " +
      "into struct for ROP finder to work in a Worker process..<br/>");

    var sections = [];
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
    }

    return [sections, [], options];
}

function setElfDefaults(options, elf) {
  if (options.arch == "auto detect") {
    options.arch = elfToArch(elf);
  }

  if (options.bits == "auto detect") {
    options.bits = elfToBits(elf);
  }

  if (options.endian == "auto detect") {
    options.endian = elfToEndian(elf);
  }

  return options;
}


/*
0: "NOT_SET",
2: "SPARC",
3: "X86",
8: "MIPS",
20: "POWERPC",
40: "ARM",
42: "SUPERH",
50: "IA_64",
62: "X86_64",
183: "AARCH64",
*/

function elfToArch(elf) {
  switch (elf.header.machine) {
    case 0:
      return "unknown";
    case 2:
      return "sparc";
    case 3:
      return "x86";
    case 8:
      return "mips";
    case 18:
      return "sparc";
    case 20:
      return "ppc";
    case 40:
      return "arm";
    case 42:
      return "superh";
    case 50:
      return "ia_64";
    case 62:
      return "x86";
    case 183:
      return "arm64";
    default:
      return "unknown";
  }

  return "unknown";
}


function elfToBits(elf) {
  switch (elf.bits) {
    case 1:
      return 32;
    case 2:
      return 64;
    default:
      return "unknown";
  }

  return "unknown";
}


function elfToEndian(elf) {
  switch (elf.endian) {
    case 1:
      return "little";
    case 2:
      return "big";
    default:
      return "unknown";
  }

  return "unknown";
}
