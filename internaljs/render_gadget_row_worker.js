
//Main Webworker handler
onmessage = function (e) {
   renderGadgetsTable(e.data.gadgets, e.data.prevGadgetsAddrs);
   close();
}


function renderGadgetsTable(gadgets, prevGadgetsAddrs) {
  const group=10000;
  let rows = [];
  const newGadgetsAddrs = {};
  const offsetCounts = {};

  function incrementNewGadetsAddrs(gadget) {
    const addrInt = parseInt(gadget.vaddr, 16);
    if (gadget.gadget in newGadgetsAddrs) {
      //push another address
      newGadgetsAddrs[gadget.gadget].push(addrInt);
    } else {
      //construct new hash
      newGadgetsAddrs[gadget.gadget] = [addrInt];
    }
  }

  function incrementOffsetCounts(movement) {
    if (movement in offsetCounts) {
      offsetCounts[movement]++;
    } else {
      offsetCounts[movement] = 1;
    }
  }

  for (let gi in gadgets) {
    const gadget = gadgets[gi];

    incrementNewGadetsAddrs(gadget);

    let className = ""
    const [closestAddr, closestOffset, found] = findClosestAddr(prevGadgetsAddrs[gadget.gadget], gadget.vaddr);
    if (found) {
      incrementOffsetCounts(closestOffset);
      if (closestOffset == 0) {
        className = "survived";
      } else  {
        className = "moved";
      }
    }else {
      incrementOffsetCounts("new");
      className = "new";
    }

    const tr ='<tr class="' + className + ' ' + gadget.type + '" ' +
    'data-gadget="' + gadget.gadget + '" ' +
    'data-vaddr="' + gadget.vaddr + '" ' +
    'data-type="' + gadget.type + '" ' +
    '><td>' + gadget.vaddr + '</td><td>' + gadget.gadget +
    '</td><td>'  + gadget.type + '</td></tr>';;

    rows.push(tr);

    if (rows.length == group || gi == gadgets.length-1) {
      postMessage({status: "==> Rendered " + (parseInt(gi)+1) + " of " + gadgets.length, rows: rows});
      rows = [];
    }
  }
  postMessage({finished: true, newGadgetsAddrs: newGadgetsAddrs, offsetCounts: offsetCounts});
}

function findClosestAddr(addrs, addr) {
  let closestDist = -1;
  let closestAddr = 0;
  let found = false;
  let closestOffset = 0;

  const addrInt = parseInt(addr, 16);

  for (let i in addrs) {
    const candidateAddr = addrs[i];
    const candidateOffset = candidateAddr - addrInt;
    const candidateDist = Math.abs(candidateOffset);
    if (!found || candidateDist < closestDist) {
      found = true;
      closestAddr = candidateAddr;
      closestDist = candidateDist;
      closestOffset = candidateOffset;
    }
  }
  return [closestAddr, closestOffset, found];
}
