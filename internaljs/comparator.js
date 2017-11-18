$(document).ready(attachComparators);

function attachComparators() {

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
    scrollTablesToSelectedRow('tr[data-gadget="'+gadget+'"]');
}

function scrollTablesToAddress(addr) {
  scrollTablesToSelectedRow('tr[data-addr="'+addr+'"]');
}

function scrollTablesToSelectedRow(selector) {
  console.log("Called");
  $('.ropTable').each(function(idx, table){
    var jqt = $(table);
    var row = jqt.find(selector);
    debugger;
    if (row.length == 1) {
      jqt.parent().get(0).scrollTop = row.position().top;
    }
  });
}


function launchComparator() {
  var rootElem = $("div.comparator");
  //rootElem.toggle();
}

function toHash(gadgets) {
  for (gi in gadgets) {
    var gadget = gadgets[gi];
  }
}
