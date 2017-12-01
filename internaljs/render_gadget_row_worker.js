
//Main Webworker handler
onmessage = function (e) {
   renderGadgetsTable(e.data.gadgets, e.data.prevGadgetsAddrs);
   close();
}


function renderGadgetsTable(gadgets, prevGadgetsAddrs) {
  const group=10000;
  let rows = [];
  const newGadgetsAddrs = {};
  const histogram = {};

  function incrementNewGadetsAddrs(gadget) {
    if (gadget.gadget in newGadgetsAddrs) {
      //push another address
      newGadgetsAddrs[gadget.gadget].push(gadget.vaddr);
    } else {
      //construct new hash
      newGadgetsAddrs[gadget.gadget] = [gadget.vaddr];
    }
  }

  function incrementHistogram(movement) {
    if (movement in histogram) {
      histogram[movement]++;
    } else {
      histogram[movement] = 1;
    }
  }

  for (let gi in gadgets) {
    const gadget = gadgets[gi];

    incrementNewGadetsAddrs(gadget);

    let className = ""
    const [closestAddr, dist] = findClosestAddr(prevGadgetsAddrs[gadget.gadget], gadget.vaddr);
    incrementHistogram(Math.floor(dist));
    if (dist >= 0) {
      if (dist < 1) {
        className = "survived";
      } else  {
        className = "moved";
      }
    }else {
      className = "dead"
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
  postMessage({finished: true, newGadgetsAddrs: newGadgetsAddrs, histogram: histogram});
}

function findClosestAddr(addrs, addr) {
  let closestDist = -1;
  let closestAddr = 0;
  for (let i in addrs) {
    const candidateAddr = addrs[i];
    const candidateDist = Math.abs(parseInt(candidateAddr, 16) - parseInt(addr, 16));
    if (closestDist == -1 || candidateDist < closestDist) {
      closestAddr = candidateAddr;
      closestDist = candidateDist;
    }
  }
  return [closestAddr, closestDist];
}
