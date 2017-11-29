function renderGadgetsTable(gadgets, gadgetshash) {
  const group=10000;
  let rows = [];
  const newGadgetsHash = {};
  for (let gi in gadgets) {
    const gadget = gadgets[gi];

    if (gadget.gadget in newGadgetsHash) {
      //push another address
      newGadgetsHash[gadget.gadget].push(gadget.vaddr);
    } else {
      //construct new hash
      newGadgetsHash[gadget.gadget] = [gadget.vaddr];
    }

    let className = ""
    if (typeof(gadgetshash[gadget.gadget]) !== "undefined" &&
      gadgetshash[gadget.gadget].includes(gadget.vaddr)) {
      className = "survived";
    } else if (gadget.gadget in gadgetshash) {
      className = "moved";
    } else {
      className = "died"
    }
    const tr ='<tr class="' + className + '" ' +
    'data-gadget="' + gadget.gadget + '" ' +
    'data-vaddr="' + gadget.vaddr + '" ' +
    '><td>' + gadget.vaddr + '</td><td>' + gadget.gadget + '</td></tr>';

    rows.push(tr);

    if (rows.length == group || gi == gadgets.length-1) {
      postMessage({status: "==> Rendered " + (parseInt(gi)+1) + " of " + gadgets.length, rows: rows});
      rows = [];
    }
  }
  postMessage({finished: true, gadgetshash: newGadgetsHash});
}

//Main Webworker handler
onmessage = function (e) {
   renderGadgetsTable(e.data.gadgets, e.data.gadgetshash);
   close();
}
