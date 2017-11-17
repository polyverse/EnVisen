function renderGadgetsTable(gadgets, gadgetshash) {
  var group=1000;
  var rows = [];
  var newGadgetsHash = {};
  console.log(gadgetshash)
  for (var gi in gadgets) {
    var gadget = gadgets[gi];

    //construct new hash
    newGadgetsHash[gadget.gadget] = gadget.vaddr;

    var className = ""
    if (gadgetshash[gadget.gadget] == gadget.vaddr) {
      className = "survived";
    } else if (gadget.gadget in gadgetshash) {
      className = "moved";
    }
    var tr ='<tr class=' + className + '><td>' + gadget.vaddr + '</td><td>' + gadget.gadget + '</td></tr>';
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
