
var VaddrRegExp = new RegExp('data-vaddr="([^"]+)"', 'i');
var GadgetRegExp = new RegExp('data-gadget="([^"]+)"', 'i');
var TablesToRows = {};
var TablesToGadgets = {};

function analyzeResultErrorCapture(index, filename, dataArray, offset, analysisElem, reporter) {
  var errorElem = $("<span/>")
  $(analysisElem).append(errorElem);

  var formatElem = $("<div/>");
  $(analysisElem).append(formatElem)

  var ropElem=$("<div/>")
  $(analysisElem).append(ropElem);

  if (filename.endsWith(".json")) {
      reporter.updateStatus("Filename ends with .json. Testing whether data is JSON...");
      var decoder = new TextDecoder('utf8');
      var gadgets = JSON.parse(decoder.decode(dataArray));
      reporter.completedFileAnalysis();
      reporter.updateStatus("That worked. Rendering Table from gadgets found in json...");
      setTimeout(function() {
        renderGadgetsTableInWorker(gadgets, offset, filename, ropElem, reporter);
      }, 20);
      return;
  } else {
    try {
      reporter.updateStatus("Attempting to open as ELF....");
      var sections = analyzeElf(dataArray, formatElem, reporter)
    } catch (e) {
      reporter.updateStatus("Couldn't parse as ELF due to exception: " + e);
      try {
        reporter.updateStatus("Attempting to open as PE....");
        var sections = analyzePe(dataArray, formatElem, reporter)
      } catch (e) {
        reporter.updateStatus("Couldn't parse as PE due to exception: " + e);
        try {
          reporter.updateStatus("Attempting to open as MachO....");
          var sections = analyzeMachO(dataArray, formatElem, reporter)
        } catch (e) {
          reporter.updateStatus("Couldn't parse as MachO due to exception: " + e);
          reporter.updateStatus("We've run out of file formats we understand. Giving up.");
          throw e;
        }
      }
    }

    reporter.completedFileAnalysis();
    findRopThroughWorker(sections, filename, offset, ropElem, reporter)

  }
}

function findRopThroughWorker(sections, filename, offset, ropElem, reporter) {
    if (typeof(Worker) !== "undefined") {

      reporter.updateStatus("Finding ROP gadgets in " + sections.length + " sections found in the binary provided.");

      var worker = new Worker("internaljs/gadget.js");
      worker.postMessage(sections);
      worker.onmessage = function(e) {
        reporter.updateStatus(e.data.status);
        if (e.data.gadgets) {
          var gadgets = e.data.gadgets;
          worker.terminate();
          reporter.updateStatus("Rendering Table...");
          setTimeout(function() {
            renderGadgetsTableInWorker(gadgets, offset, filename + ".json", ropElem, reporter);
          }, 20);
        }
      }
    } else {
        throw "No Worker support in this browser. ROP analysis is an expensive" +
        " operation, and should not be performed inline with your event loop.";
    }
}

function renderGadgetsTableInWorker(gadgets, offset, jsonFileName, ropElem, reporter) {

  gadgets = applyOffset(gadgets, offset);

  var expando = $('<a href="#">Show/Hide ROP Table</a>');
  ropElem.append(expando);

  var save = $('<a href="#" class="save">(Save as JSON)</a><br/>');
  ropElem.append(save);

  var gadgetsWrapper = $('<div>');

  var filter = $('<select class="gadget-filter"></select>');
  filter.append("<option>All Gadgets</option>");
  gadgetsWrapper.append('<span class="gadget-filter">Filter:</span>');
  gadgetsWrapper.append(filter);

  if (typeof(gadgetshash) == "undefined") {
    gadgetshash = {};
  } else {
    filter.append('<option disabled="disabled">Surviving Gadgets</option>');
    filter.append('<option disabled="disabled">Moved Gadgets</option>');
  }

  var sort = $('<select class="gadget-sort"></select>');
  var optionAlpha = $
  sort.append("<option>Alphabetically</option>");
  sort.append("<option>Topographically</option>");
  gadgetsWrapper.append('<span class="gadget-filter">Sort:</span>');
  gadgetsWrapper.append(sort);

  var displayStatusSpan = $("<span></span>");
  gadgetsWrapper.append(displayStatusSpan);

  var ropTableWrapper = $('<div class="clusterize-scroll">');
  var ropTable = $('<table style="display: block" class="ropTable">');
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

  name = "table" + tableIdx;
  ropTable.data("name", name);
  ropTable.attr("id", name);
  ropTable.append('<thead><tr><th>VAddr</th><th>Gadget</th></tr></thead>');

  save.click(function() {
      saveAs(new Blob([JSON.stringify(gadgets, null, 2)], {type: "application/json"})
    		, jsonFileName);
  })

  var tBody = $('<tbody class="clusterize-content">');
  ropTable.append(tBody);

  var worker = new Worker("internaljs/render_gadget_table.js");
  var allRows = [];

  // Draw the table out of the main loop
  function drawTable() {
    var clusterize = new Clusterize({
      scrollElem: ropTableWrapper.get(0),
      contentElem: tBody.get(0),
    });

    function displayRows() {
      var displayStatus = "Displaying ";

      var dr = allRows;
      switch (filter.val()) {
        case "Surviving Gadgets":
          displayStatus += "surviving gadgets ";
          reporter.updateStatus("Filtering surviving gadgets...");
          dr = allRows.filter(function(row) {return row.includes("survived");});
        break;
        case "Moved Gadgets":
          displayStatus += "surviving gadgets ";
          reporter.updateStatus("Filtering moved gadgets...");
          dr = allRows.filter(function(row) {return row.includes("moved");});
        break;
        default:
          displayStatus += "all gadgets ";
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

        return vaddrComparator(a, b);
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
      }
      displayStatus += dr.length;

      TablesToRows[name] = dr;

      clusterize.update(dr);
      displayStatusSpan.text(displayStatus);
      reporter.updateStatus("Updated gadgets table!");
    }

    displayRows();
    TablesToGadgets[name] = gadgets;

    sort.change(function(evt) {
      displayRows();
    });

    filter.change(function(evt) {
      displayRows();
    });

    filter.find('[disabled="disabled"]').removeAttr("disabled");
    reporter.updateStatus("Table Rendering Complete.")
    reporter.completedAnalysis();
  }

  worker.postMessage({
    gadgets: gadgets,
    gadgetshash: gadgetshash
  });

  worker.onmessage = function(e) {
      if (e.data.finished) {
        worker.terminate();
        reporter.completedRop();
        gadgetshash = e.data.gadgetshash;
        setTimeout(drawTable, 20); //Call this async
      } else {
        reporter.updateStatus(e.data.status);
        allRows = allRows.concat(e.data.rows);
      }
  }
}


function applyOffset(gadgets, offset) {
  return gadgets.map(function(gadget) {
    return {
      vaddr: (parseInt(gadget.vaddr, 16) + offset).toString(16),
      gadget: gadget.gadget
    };
  });
}
