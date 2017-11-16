

// Copied from: https://en.wikipedia.org/wiki/Executable_and_Linkable_Format#Section_header
ElfFlags = Object.freeze({
  SHF_WRITE: 0x1,
  SHF_ALLOC: 0x2,
  SHF_EXECINSTR: 0x4,
  SHF_MERGE: 0x10,
  SHF_STRINGS: 0x20,
  SHF_INFO_LINK: 0x40,
  SHF_LINK_ORDER: 0x80,
  SHF_OS_NONCONFORMING: 0x100,
  SHF_GROUP: 0x200,
  SHF_TLS: 0x400,
  SHF_MASKOS: 0x0ff00000,
  SHF_MASKPROC: 0xf0000000,
  SHF_ORDERED: 0x4000000,
  SHF_EXCLUDE: 0x8000000,

  0x1: "SHF_WRITE",
  0x2: "SHF_ALLOC",
  0x4: "SHF_EXECINSTR",
  0x10: "SHF_MERGE",
  0x20: "SHF_STRINGS",
  0x40: "SHF_INFO_LINK",
  0x80: "SHF_LINK_ORDER",
  0x100: "SHF_OS_NONCONFORMING",
  0x200: "SHF_GROUP",
  0x400: "SHF_TLS",
  0x0ff00000: "SHF_MASKOS",
  0xf0000000: "SHF_MASKPROC",
  0x4000000: "SHF_ORDERED",
  0x8000000: "SHF_EXCLUDE",
});



function analyzeResultErrorCapture(dataArray, analysisElem, canvasElem) {
  try {
    analyzeResult(dataArray, analysisElem, canvasElem)
  } catch (e) {
    analysisElem.innerHTML = 'Error when Analysing data: ' + e + '. '
    'This tool only processes 64-bit Linux <a href="https://en.wikipedia.org/wiki/Executable_and_Linkable_Format">ELF</a> binaries.';
  }
}

function analyzeResult(dataArray, analysisElem, canvasElem) {
    dataPublic = dataArray
    analysisElem.innerHTML = 'Analysing data...';

    var ks = new KaitaiStream(dataArray, 0)
    elf = new Elf(ks)
    analysisElem.innerHTML =
    '<i>Type</i>: <b>' + Elf.ObjType[elf.header.eType] +
    '</b>, <i>Machine</i>: <b>' + Elf.Machine[elf.header.machine] +
    '</b>, <i>Bits</i>: <b>' + Elf.Bits[elf.bits] +
    '</b>, <i>Endian</i>: <b>' + Elf.Endian[elf.endian] +
    '</b>, <i>ABI</i>: <b>' + Elf.OsAbi[elf.abi] +
    '</b>, <i>ABI Version</i>: <b>' + elf.abiVersion +
    '</b>.<br/>';

    var expando = $('<a href="#">Show/Hide Details</a>')
    var expansionDiv = $('<div style="display: none"></div>');
    $(analysisElem).append(expando)
    $(analysisElem).append(expansionDiv)
    expando.click(function() {
      expansionDiv.toggle();
    });

    expansionDiv.append('<H5>Program Headers</H5>');
    //fill in expansionDiv with section and program headers
    var progHeadersTable = $('<table/>');
    expansionDiv.append(progHeadersTable);
    progHeadersTable.append('<thead><tr>' +
    '<th>Type</th>' +
    '<th>Flags</th>' +
    '<th>Offset</th>' +
    '<th>Physical Address</th>' +
    '<th>Virtual Address</th>' +
    '<th>Align</th>' +
    '<th>File Image Size</th>' +
    '<th>Memory Image Size</th>' +
    +'</tr></thead>');

    var tbody = $('<tbody/>');
    progHeadersTable.append(tbody);

    for (phi in elf.header.programHeaders) {
      var ph = elf.header.programHeaders[phi];
      var phlstr = '<tr>' +
      '<td>' + Elf.PhType[ph.type] + '</td>' +
      '<td>' + ph.flags + interpretFlags(ph.flags) + '</td>' +
      '<td>' + ph.offset + '</td>' +
      '<td>' + ph.paddr + '</td>' +
      '<td>' + ph.vaddr + '</td>' +
      '<td>' + ph.align + '</td>' +
      '<td>' + ph.filesz + '</td>' +
      '<td>' + ph.memsz + '</td>' +
      '</tr>';
      var tr = $(phlstr);
      tbody.append(tr);
    }

    expansionDiv.append('<H5>Section Headers</H5>');
    //fill in expansionDiv with section and program headers
    var sectionHeadersTable = $('<table/>');
    expansionDiv.append(sectionHeadersTable);
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

    var tbody = $('<tbody/>');
    sectionHeadersTable.append(tbody);

    for (shi in elf.header.sectionHeaders) {
      var sh = elf.header.sectionHeaders[shi];
      var shlstr = '<tr>' +
        '<td>' + sh.name + '</td>' +
        '<td>' + Elf.ShType[sh.type] + '</td>' +
        '<td>' + sh.flags + interpretFlags(sh.flags) + '</td>' +
        '<td>' + sh.addr + '</td>' +
        '<td>' + sh.align + '</td>' +
        '<td>' + sh.entrySize + '</td>' +
        '<td>' + sh.offset + '</td>' +
        '<td>' + sh.size + '</td>' +
        '</tr>';
      var tr = $(shlstr);
      tbody.append(tr);
    }

    disasmErrorCapture(elf, dataArray, analysisElem, canvasElem)

}

function disasmErrorCapture(elf, dataArray, analysisElem, canvasElem) {
  try {
    disasm(elf, dataArray, analysisElem, canvasElem)
  } catch (e) {
    analysisElem.innerHTML = 'Error when Analysing data: ' + e + '. '
    'This tool only processes 64-bit Linux <a href="https://en.wikipedia.org/wiki/Executable_and_Linkable_Format">ELF</a> binaries.';
  }
}

function  disasm(elf, dataArray, analysisElem, canvasElem) {
  for (shi in elf.header.sectionHeaders) {
    var sh = elf.header.sectionHeaders[shi];
    if (Elf.ShType[sh.type] == "PROGBITS" && sh.flags && ElfFlags["SHF_EXECINSTR"]) {

        console.log("About to disassemble segment");
        console.log(sh);
        
        var buffer = sh.body;
        var offset = sh.offset;

        // Initialize the decoder
        var d = new cs.Capstone(cs.ARCH_X86, cs.MODE_64);

        // Output: Array of cs.Instruction objects
        var instructions = d.disasm(buffer, offset);

        // Display results;
        instructions.forEach(function (instr) {
            console.log("0x%s:\t%s\t%s",
                instr.address.toString(16),
                instr.mnemonic,
                instr.op_str
            );
        });

        // Delete decoder
        d.close();
      }
  }
}


function interpretFlags(flags) {
  var fstr = '';
  var first = true;

  for (key in ElfFlags) {
    if (flags & key) {

      if (first) {
        first = false;
      } else {
        fstr = fstr + ' | ';
      }

      fstr = fstr + ElfFlags[key];
    }
  }

  if (fstr != '') {
    fstr = '(' + fstr + ')';
  }
  return fstr
}
