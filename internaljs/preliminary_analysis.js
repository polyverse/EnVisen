

// Copied from: https://en.wikipedia.org/wiki/Executable_and_Linkable_Format#Section_header
ElfShFlags = Object.freeze({
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

// Copied from: https://docs.oracle.com/cd/E19683-01/816-1386/6m7qcoblk/index.html#chapter6-tbl-39
ElfPhFlags = Object.freeze({
  PF_X: 0x1,
  PF_W: 0x2,
  PF_R: 0x4,
  PF_MASKPROC: 0xf0000000,

  0x1: "PF_X",
  0x2: "PF_W",
  0x4: "PF_R",
  0xf0000000: "PF_MASKPROC"
});

function analyzeResultErrorCapture(index, dataArray, analysisElem, reporter) {
  var errorElem = $("<span/>")
  $(analysisElem).append(errorElem);

    var elfElem = $("<div/>");
    $(analysisElem).append(elfElem)

    var ropElem=$("<div/>")
    $(analysisElem).append(ropElem);

    var elf = analyzeElf(dataArray, elfElem, reporter)
    reporter.completedElf();

    findRopThroughWorker(elf, ropElem, reporter)
}

function analyzeElf(dataArray, elfElem, reporter) {
    reporter.updateStatus('Analysing Elf data...');

    var ks = new KaitaiStream(dataArray, 0)
    elf = new Elf(ks)
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
    for (phi in elf.header.programHeaders) {
      var ph = elf.header.programHeaders[phi];
      var phlstr = '<tr>' +
      '<td>' + ph.type + " (" + Elf.PhType[ph.type] + ')</td>' +
      '<td>' + ph.flags64 + interpretFlags(ph.flags64, ElfPhFlags) + '</td>' +
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
    for (shi in elf.header.sectionHeaders) {
      var sh = elf.header.sectionHeaders[shi];
      var shlstr = '<tr>' +
        '<td>' + sh.name + '</td>' +
        '<td>' + Elf.ShType[sh.type] + '</td>' +
        '<td>' + sh.flags + interpretFlags(sh.flags, ElfShFlags) + '</td>' +
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


    return elf;
}

function findRopThroughWorker(elf, ropElem, reporter) {
    if (typeof(Worker) !== "undefined") {

      reporter.updateStatus("Converting ELF program segments " +
        "into struct for ROP finder to work in a Worker process..<br/>");

      var segments = []
      for (var phi in elf.header.programHeaders) {
        var ph = elf.header.programHeaders[phi];
        if (ph.flags64 & ElfPhFlags["PF_X"]){
          var segment = {
            offset: ph.offset,
            size: ph.memsz,
            vaddr: ph.vaddr,
            opcodes: ph.body,
          };
          segments.push(segment);
        }
      }

      var worker = new Worker("internaljs/gadget.js");
      worker.postMessage(segments);
      worker.onmessage = function(e) {
        reporter.updateStatus(e.data.status);
        if (e.data.gadgets) {
          var gadgets = e.data.gadgets;
          worker.terminate();
          reporter.updateStatus("Rendering Table...");
          setTimeout(function() {
            renderGadgetsTableInWorker(gadgets, ropElem, reporter);
          }, 20);
        }
      }
    } else {
        throw "No Worker support in this browser. ROP analysis is an expensive" +
        " operation, and should not be performed inline with your event loop.";
    }
}

function renderGadgetsTableInWorker(gadgets, ropElem, reporter) {
  var expando = $('<a href="#">Show/Hide Rop Gadget Table</a><br/>')
  var ropTableWrapper = $('<div class="clusterize-scroll">');
  var ropTable = $('<table style="display: block"/ class="ropTable">');
  ropTableWrapper.append(ropTable);

  ropElem.append(expando);
  ropElem.append(ropTableWrapper);
  expando.click(function() {
    ropTableWrapper.toggle();
  });

  if (typeof(tableIdx) == "undefined") {
    tableIdx = 1;
  } else {
    tableIdx++;
  }

  name = "table" + tableIdx;
  ropTable.data("name", name);
  ropTable.attr("id", name);
  ropTable.append('<thead><tr><th>VAddr</th><th>Gadget</th></tr></thead>');

  var tBody = $('<tbody class="clusterize-content">');
  ropTable.append(tBody);

  var worker = new Worker("internaljs/render_gadget_table.js");
  var rows = [];

  // Draw the table out of the main loop
  function drawTable() {
    var clusterize = new Clusterize({
      scrollElem: ropTableWrapper.get(0),
      contentElem: tBody.get(0),
      rows: rows
    });
    reporter.updateStatus("Table Rendering Complete.")
    reporter.completedAnalysis();
  }


  worker.postMessage(gadgets);
  worker.onmessage = function(e) {
      if (!e.data) {
        worker.terminate();
        reporter.completedRop();
        setTimeout(drawTable, 20); //Call this async
      } else {
        reporter.updateStatus(e.data.status);
        rows = rows.concat(e.data.rows);
      }
  }
}


function interpretFlags(flags, consts) {
  var fstr = '';
  var first = true;

  for (key in consts) {
    if (flags & key) {

      if (first) {
        first = false;
      } else {
        fstr = fstr + ' | ';
      }

      fstr = fstr + consts[key];
    }
  }

  if (fstr != '') {
    fstr = '(' + fstr + ')';
  }
  return fstr
}
