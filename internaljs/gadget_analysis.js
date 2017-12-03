
const VaddrRegExp = new RegExp('data-vaddr="([^"]+)"', 'i');
const GadgetRegExp = new RegExp('data-gadget="([^"]+)"', 'i');
const TypeRegExp = new RegExp('data-type="([^"]+)"', 'i');
let TablesToRows = {};
let TablesToGadgets = {};
let PrevGadgetAddrs = {};

function analyzeResultErrorCapture(index, filename, dataArray, options, analysisElem, reporter) {
  const errorElem = $("<span/>")
  $(analysisElem).append(errorElem);

  const formatElem = $("<div/>");
  $(analysisElem).append(formatElem)

  const ropElem=$("<div/>")
  $(analysisElem).append(ropElem);

  let sections = [];
  let symbols = [];

  if (filename.endsWith(".json")) {
      reporter.updateStatus("Filename ends with .json. Testing whether data is JSON...");
      const decoder = new TextDecoder('utf8');
      const binInfo = JSON.parse(decoder.decode(dataArray));
      reporter.completedFileAnalysis();
      reporter.updateStatus("That worked. Rendering Table from gadgets found in json...");
      formatElem.append('<div class="fileInfoWrapper"><span class="fileInfo">Data loaded from JSON.</span></div>');
      setTimeout(function() {
        renderGadgetsTableInWorker(binInfo, filename, ropElem, reporter);
      }, 20);
      return;
    } else {
      try {
        reporter.updateStatus("Attempting to open as ELF....");
        [sections, symbols, options] = analyzeElf(dataArray, options, formatElem, reporter);
      } catch (e) {
        reporter.updateStatus("Couldn't parse as ELF due to exception: " + e);
        try {
          reporter.updateStatus("Attempting to open as PE....");
          [sections, symbols, options] = analyzePe(dataArray, options, formatElem, reporter);
        } catch (e) {
          reporter.updateStatus("Couldn't parse as PE due to exception: " + e);
          try {
            reporter.updateStatus("Attempting to open as MachO....");
            [sections, symbols, options] = analyzeMachO(dataArray, options, formatElem, reporter);
          } catch (e) {
            reporter.updateStatus("Couldn't parse as MachO due to exception: " + e);
            reporter.updateStatus("We've run out of file formats we understand. Treating this as a RAW file (like a kernel or bootloader).");
            reporter.updateStatus("Attempting to parse as RAW binary....");
            [sections, symbols, options] = analyzeRaw(dataArray, options, formatElem, reporter);
          }
        }
      }

      reporter.completedFileAnalysis();
      findRopThroughWorker(sections, symbols, filename, options, ropElem, reporter)

    }
}

function findRopThroughWorker(sections, symbols, filename, options, ropElem, reporter) {
    if (typeof(Worker) !== "undefined") {

      reporter.updateStatus("Finding ROP gadgets in " + sections.length + " sections found in the binary provided.");

      const worker = new Worker("internaljs/instruction_gadget_worker.js");
      worker.postMessage({
        sections: sections,
        arch: options.arch,
        bits: options.bits,
        endian: options.endian,
        thumb: options.thumb
      });

      worker.onmessage = function(e) {
        reporter.updateStatus(e.data.status);
        if (e.data.gadgets) {
          const instructions = e.data.gadgets;
          worker.terminate();
          reporter.updateStatus("Rendering Table...");
          setTimeout(function() {
            renderGadgetsTableInWorker({instructions, symbols, options}, filename + ".json", ropElem, reporter);
          }, 20);
        }
      }
    } else {
        throw "No Worker support in this browser. ROP analysis is an expensive" +
        " operation, and should not be performed inline with your event loop.";
    }
}

function renderGadgetsTableInWorker(binInfo, jsonFileName, ropElem, reporter) {

  const gadgets = combineAndOffset(binInfo.instructions, binInfo.symbols, binInfo.options.offset);
  let offsetCounts = {};

  const expando = $('<a href="#">Show/Hide ROP Table</a>');
  ropElem.append(expando);

  const save = $('<a href="#" class="save">(Save as JSON)</a><br/>');
  ropElem.append(save);

  const gadgetsWrapper = $('<div class="expander">');

  const type = $('<select class="gadget-filter"></select>');
  type.append("<option>All</option>");
  type.append('<option>Instructions</option>');
  type.append('<option>Symbols</option>');
  gadgetsWrapper.append('<span class="gadget-filter">Type:</span>');
  gadgetsWrapper.append(type);

  const survival = $('<select class="gadget-filter"></select>');
  survival.append("<option>All</option>");
  if (Object.keys(PrevGadgetAddrs).length > 0) {
    survival.append('<option disabled="disabled">Survived</option>');
    survival.append('<option disabled="disabled">Moved</option>');
    survival.append('<option disabled="disabled">Dead</option>');
  }
  gadgetsWrapper.append('<span class="gadget-filter">Survival:</span>');
  gadgetsWrapper.append(survival);

  const sort = $('<select class="gadget-sort"></select>');
  sort.append("<option>Alphabetically</option>");
  sort.append("<option>Topographically</option>");
  sort.append("<option>By Type</option>");
  gadgetsWrapper.append('<span class="gadget-filter">Sort:</span>');
  gadgetsWrapper.append(sort);

  const analyzeEntropyBtn = $('<input disabled="disabled" type="button" value="Entropy Analysis"/>')
  if (Object.keys(PrevGadgetAddrs).length > 0) {
    gadgetsWrapper.append(analyzeEntropyBtn);
    analyzeEntropyBtn.click(function() {
      displayEntropyAnalysis(offsetCounts, reporter);
    });
  }

  gadgetsWrapper.append("<br/>");
  const displayStatusSpan = $('<span class="explain-selection"></span>');
  gadgetsWrapper.append(displayStatusSpan);

  const ropTableWrapper = $('<div class="clusterize-scroll">');
  const ropTable = $('<table style="display: block" class="ropTable clusterizedTable">');
  ropTableWrapper.append(ropTable);
  gadgetsWrapper.append(ropTableWrapper);

  ropElem.append(gadgetsWrapper);

  expando.click(function() {
    gadgetsWrapper.toggle();
  });

  if (typeof(tableIdx) == "undefined") {
    tableIdx = 1;
  } else {
    tableIdx++;
  }

  const name = "table" + tableIdx;
  ropTable.data("name", name);
  ropTable.attr("id", name);
  ropTable.append('<thead><tr><th>VAddr</th><th>Gadget</th><th>Type</th></tr></thead>');

  save.click(function() {
      saveAs(new Blob([JSON.stringify(binInfo, null, 2)], {type: "application/json"})
    		, jsonFileName);
  })

  const tBody = $('<tbody class="clusterize-content">');
  ropTable.append(tBody);

  const worker = new Worker("internaljs/render_gadget_row_worker.js");
  let allRows = [];

  // Draw the table out of the main loop
  function drawTable() {
    const clusterize = new Clusterize({
      scrollElem: ropTableWrapper.get(0),
      contentElem: tBody.get(0),
    });

    function displayRows() {
      var displayStatus = "Displaying ";

      var dr = allRows;
      switch (survival.val()) {
        case "Survived":
          displayStatus += "surviving gadgets ";
          reporter.updateStatus("Filtering in surviving gadgets...");
          dr = allRows.filter(function(row) {return row.includes("survived");});
        break;
        case "Moved":
          displayStatus += "moved gadgets ";
          reporter.updateStatus("Filtering in moved gadgets...");
          dr = allRows.filter(function(row) {return row.includes("moved");});
        break;
        case "Dead":
          displayStatus += "dead gadgets ";
          reporter.updateStatus("Filtering in dead gadgets...");
          dr = allRows.filter(function(row) {return row.includes("dead");});
        break;
        default:
          displayStatus += "all gadgets ";
          reporter.updateStatus("Filtering in all gadgets...");
          dr = allRows;
        break;
      }

      switch (type.val()) {
        case "Instructions":
          displayStatus += "of type instruction ";
          reporter.updateStatus("Filtering in instruction gadgets...");
          dr = dr.filter(function(row) {return row.includes("instructions");});
        break;
        case "Symbols":
          displayStatus += "of type symbol ";
          reporter.updateStatus("Filtering in symbol gadgets...");
          dr = dr.filter(function(row) {return row.includes("symbol");});
        break;
        default:
          displayStatus += "of all types ";
          reporter.updateStatus("Filtering in all gadgets...");
        break;
      }

      function vaddrComparator(a, b) {
        var vaddra = VaddrRegExp.exec(a)[1];
        var vaddrb = VaddrRegExp.exec(b)[1];
        return parseInt(vaddra, 16) - parseInt(vaddrb, 16);
      }

      function alphaComparator(a, b) {
        var gadgeta = GadgetRegExp.exec(a)[1];
        var gadgetb = GadgetRegExp.exec(b)[1];
        if (gadgeta < gadgetb) return -1;
        if (gadgeta > gadgetb) return 1;

        return 0;
      }

      function typeComparator(a, b) {
        var typea = TypeRegExp.exec(a)[1];
        var typeb = TypeRegExp.exec(b)[1];
        if (typea < typeb) return -1;
        if (typea > typeb) return 1;

        return 0;
      }

      switch (sort.val()) {
        case "Alphabetically":
          displayStatus += "sorted alphabetically: ";
          reporter.updateStatus("Sorting gadgets alphabetically...");
          dr = dr.sort(alphaComparator);
        break;
        case "Topographically":
          displayStatus += "sorted topographically: ";
          reporter.updateStatus("Sorting gadgets topographically...");
          dr = dr.sort(vaddrComparator);
        break;
        case "By Type":
          displayStatus += "sorted by type: ";
          reporter.updateStatus("Sorting gadgets by type...");
          dr = dr.sort(typeComparator);
        break;
      }
      displayStatus += dr.length;

      TablesToRows[name] = dr;

      clusterize.update(dr);
      displayStatusSpan.text(displayStatus);
      reporter.updateStatus("Updated gadgets table!");
    }

    displayRows();

    sort.change(function(evt) {
      displayRows();
    });

    survival.change(function(evt) {
      displayRows();
    });

    type.change(function(evt) {
      displayRows();
    });

    survival.find('[disabled="disabled"]').removeAttr("disabled");
    analyzeEntropyBtn.removeAttr("disabled");

    reporter.updateStatus("Table Rendering Complete.")
    reporter.completedAnalysis();
  }

  TablesToGadgets[name] = gadgets;

  worker.postMessage({
    gadgets: gadgets,
    prevGadgetsAddrs: PrevGadgetAddrs
  });

  worker.onmessage = function(e) {
      if (e.data.finished) {
        worker.terminate();
        reporter.completedRop();
        const newGadgetAddrs = e.data.newGadgetsAddrs;
        offsetCounts = e.data.offsetCounts;
        computeDeadGadgets(offsetCounts, PrevGadgetAddrs, newGadgetAddrs);
        PrevGadgetAddrs = newGadgetAddrs;
        setTimeout(drawTable, 20); //Call this async
      } else {
        reporter.updateStatus(e.data.status);
        allRows = allRows.concat(e.data.rows);
      }
  }
}

function combineAndOffset(instructions, symbols, offset) {
  const gadgets = instructions.concat(symbols);
  return gadgets.map(function(gadget) {
    return {
      vaddr: (parseInt(gadget.vaddr, 16) + offset).toString(16),
      gadget: gadget.gadget,
      type: gadget.type
    };
  });
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

function computeDeadGadgets(offsetCounts, PrevGadgetAddrs, newGadgetAddrs) {
  let deadCount = 0;
  for (let gad in PrevGadgetAddrs) {
    const prevGadgets = PrevGadgetAddrs[gad];
    if (!(gad in newGadgetAddrs)) {
      deadCount += prevGadgets.length;
    }
  }

  offsetCounts["dead"] = deadCount;
}
