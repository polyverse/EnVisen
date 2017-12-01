function attachUtilities() {

  $("#utilities-root").block({
    message: 'Analyze a file (or more) to enable ROP simulation tools.',
    css: { border: '1px dotted blue', cursor: 'not-allowed' },
    overlayCSS:  { opacity:         0.2, cursor: 'not-allowed' }
  });

  var addrFindCont = $("#address-find-content");
  $("#address-find-btn").click(function(){
    scrollTablesToAddress(addrFindCont.val());
  });

  var gadFindCont = $("#gadget-find-content");
  $("#gadget-find-btn").click(function(){
    scrollTablesToGadget(gadFindCont.val());
  });

  $("#generate-rand-chain-btn").click(function(){
    var chain = generateRandomChain(TablesToGadgets["table1"]);
    $("#rop-chain-content").val(chain);
  });

  $("#exec-chain-btn").click(function(){
    var chain = $("#rop-chain-content").val();
    executeChain(chain);
  });

}

function executeChain(chain) {
  if (chain == "") {
    return;
  }

  $("#execution").empty();

  //How many rop tables are we working with?
  var ropTableLen = TablesToGadgets.length;

  //Let's set up our UI first
  var th = $("<tr></tr>");
  th.append("<td></td>");
  for (name in TablesToGadgets) {
    th.append("<td>Gadgets from " + name + "</td>");
  }

  var thead = $("<thead></thead>")
  thead.append(th);
  var table = $("<table/>");
  table.append(thead);

  $("#execution").append(table);

  var tbody = $("<tbody/>");
  table.append(tbody);

  var addrs = chain.split(" ");
  var brokenChains = {};

  for (var i in addrs) {
    var addr = addrs[i];
    if (addr == "") continue;

    var tr = $("<tr/>");
    tr.append("<td>" + addr + "</td>");

    //Now go over all tables
    for (name in TablesToGadgets) {
      if (brokenChains[name]){
        tr.append('<td class="broken">Chain broken</td>');
        continue;
      }

      var gadgets = TablesToGadgets[name];
      var index = findGadgetIndexForVaddr(gadgets, addr);
      if (index < 0) {
        brokenChains[name] = true;
        tr.append('<td class="broken">No Gadget!</td>');
      } else {
        tr.append('<td class="intact">' + gadgets[index].gadget + '</td>');
      }
    }
    tbody.append(tr);
  }

}

function generateRandomChain(gadgets) {
  var len = getRandomIntInclusive(5, 20);
  var chain = ""
  for (var i=0; i < len; i++) {
    var nextgad = getRandomIntInclusive(0, gadgets.length-1);
    chain += gadgets[nextgad].vaddr + " ";
  }
  return chain;
}


function scrollTablesToGadget(gadget) {
  $('.ropTable').each(function(idx, table){
    var jqt = $(table);
    var name = $(table).attr("id");
    var rows = TablesToRows[name];
    var row = findGadgetRowForGadget(rows, gadget);
    if (row >= 0) {
          scrollTableToSelectedRow(jqt, row);
    }
  });
}

function scrollTablesToAddress(addr) {
  $('.ropTable').each(function(idx, table){
    var jqt = $(table);
    var name = $(table).attr("id");
    var rows = TablesToRows[name];
    var row = findGadgetRowForVaddr(rows, addr);
    if (row >= 0) {
      scrollTableToSelectedRow(jqt, row);
    }
  });
}

function scrollTableToSelectedRow(table, index) {
  var first = table.find('tbody tr:not(".clusterize-extra-row"):first');
  if (first.length == 0) {
    return;
  }

  var height = first.height();

  var second = first.next();
  if (second.length == 1) {
    height = second.position().top - first.position().top;
  }
  var pos = height * index;
  table.parent().scrollTop(pos);
}


function unblockUtilities() {
  if ($(".ropTable").length > 1) {
    $("#generate-surv-chain-btn").removeAttr("disabled");
  } else {
    $("#generate-surv-chain-btn").attr("disabled", "disabled");
  }
  $("#utilities-root").unblock();

}

function toHash(gadgets) {
  for (gi in gadgets) {
    var gadget = gadgets[gi];
  }
}

function findGadgetIndexForVaddr(gadgets, vaddr) {
  for (var index in gadgets) {
    if (gadgets[index].vaddr == vaddr) {
      return index;
    }
  }
  return -1;
}

function findGadgetRowForVaddr(rows, vaddr) {
  for (var row in rows) {
    if (VaddrRegExp.exec(rows[row])[1] == vaddr) {
      return row;
    }
  }
  return -1;
}

function findGadgetRowForGadget(rows, gadget) {
  for (var row in rows) {
    if (GadgetRegExp.exec(rows[row])[1] == gadget) {
      return row;
    }
  }
  return -1;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
