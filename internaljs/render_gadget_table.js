function renderGadgetsTable(gadgets, gadgetshash) {
  var group=1000;
  var rows = [];
  var newGadgetsHash = {};
  for (var gi in gadgets) {
    var gadget = gadgets[gi];

    if (gadget.gadget in newGadgetsHash) {
      //push another address
      newGadgetsHash[gadget.gadget].push(gadget.vaddr);
    } else {
      //construct new hash
      newGadgetsHash[gadget.gadget] = [gadget.vaddr];
    }

    var className = ""
    if (typeof(gadgetshash[gadget.gadget]) !== "undefined" &&
        gadgetshash[gadget.gadget].includes(gadget.vaddr)) {
      className = "survived";
    } else if (gadget.gadget in gadgetshash) {
      className = "moved";
    } else {
      className = "died"
    }
    var tr ='<tr class="' + className + '" ' +
    'data-gadget="' + gadget.gadget + '" ' +
    'data-vaddr="' + gadget.vaddr + '" ' +
    '><td>' + gadget.vaddr + '</td><td>' + gadget.gadget + '</td></tr>';

    rows.push(tr);

    if (rows.length == group || gi == gadgets.length-1) {
      postMessage({status: "Rendered " + (parseInt(gi)+1) + " of " + gadgets.length, rows: rows});
      rows = [];
    }
  }
  postMessage({finished: true, gadgetshash: newGadgetsHash});
}

//Main Webworker handler
onmessage = function (e) {
   elements = renderGadgetsTable(e.data.gadgets, e.data.gadgetshash);
   close();
}
