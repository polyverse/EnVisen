$(document).ready(attachComparators);

function attachComparators() {

  $("#comparator-root").block({
    message: 'Analyse a file (or more) to enable ROP simulation tools.',
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
}

function scrollTablesToGadget(gadget) {
  $('.ropTable').each(function(idx, table){
    var jqt = $(table);
    var name = $(table).attr("id");
    var gadgets = tablesToGadgets[name];
    for (var index in gadgets) {
      if (gadgets[index].gadget == gadget) {
          scrollTableToSelectedRow(jqt, index);
          break;
      }
    }
  });
}

function scrollTablesToAddress(addr) {
  $('.ropTable').each(function(idx, table){
    var jqt = $(table);
    var name = $(table).attr("id");
    var gadgets = tablesToGadgets[name];
    for (var index in gadgets) {
      if (gadgets[index].vaddr == addr) {
          scrollTableToSelectedRow(jqt, index);
          break;
      }
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


function launchComparator() {
  $("#comparator-root").unblock();
}

function toHash(gadgets) {
  for (gi in gadgets) {
    var gadget = gadgets[gi];
  }
}
