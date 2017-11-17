function renderGadgetsTable(gadgets) {
  var group=1000;
  var rows = [];
  for (var gi in gadgets) {
    var gadget = gadgets[gi];

    var tr ='<tr><td>' + gadget.vaddr + '</td><td>' + gadget.gadget + '</td></tr>';
    rows.push(tr);

    if (rows.length == group || gi == gadgets.length-1) {
      postMessage({status: "Rendered " + (parseInt(gi)+1) + " of " + gadgets.length, rows: rows});
      rows = [];
    }
  }
  postMessage(false);
}

//Main Webworker handler
onmessage = function (e) {
   elements = renderGadgetsTable(e.data);
   close();
}
