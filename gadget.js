

function  getAllGadgets(segments) {
  var gadgets = [];
  for (si in segments) {
    postMessage({status: "Finding gadgets in segment " + si + " of " + segments.length});
    var segment = segments[si];
    localgadgets = getAllGadgetsInSection(segment);
    appendAll(gadgets, localgadgets);
  }

  return gadgets;
}



function getAllGadgetsInSection(section) {
 var gadgets = [];

 postMessage({status: "Finding ROP gadgets in section."});
 appendAll(gadgets, addROPGadgets(section));
 postMessage({status: "Finding JOP gadgets in section."});
 appendAll(gadgets, addJOPGadgets(section));
 postMessage({status: "Finding SYS gadgets in section."});
 appendAll(gadgets, addSYSGadgets(section));

 postMessage({status: "Found " + gadgets.length + " gadgets of all kinds."});

 //# Pass clean single instruction and unknown instructions
 postMessage({status: "Cleaning gadgets (removing blacklisted ones, false positives, redundant, etc.)"});
 gadgets = passCleanX86(gadgets)

console.log(gadgets);

 //# Delete duplicate gadgets
 postMessage({status: "Deleting duplicate gadgets"});
  //gadgets = deleteDuplicateGadgets(gadgets)

 //# Sorted alphabetically
 postMessage({status: "Sorting gadgets alphabetically"});
 //gadgets = alphaSortgadgets(gadgets)

}


function addROPGadgets(section) {

       gadgets = [
                       [toBytes("\xc3"), 1, 1],
                       [toBytes("\xc2[\x00-\xff]{2}"), 3, 1],
                       [toBytes("\xcb"), 1, 1],
                       [toBytes("\xca[\x00-\xff]{2}"), 3, 1],
                       [toBytes("\xf2\xc3"), 2, 1],
                       [toBytes("\xf2\xc2[\x00-\xff]{2}"), 4, 1]
                  ];

       return gadgetsFinding(section, gadgets);
}

function addJOPGadgets(section) {
             gadgets = [
                                [toBytes("\xff[\x20\x21\x22\x23\x26\x27]{1}"), 2, 1],
                                [toBytes("\xff[\xe0\xe1\xe2\xe3\xe4\xe6\xe7]{1}"), 2, 1],
                                [toBytes("\xff[\x10\x11\x12\x13\x16\x17]{1}"), 2, 1],
                                [toBytes("\xff[\xd0\xd1\xd2\xd3\xd4\xd6\xd7]{1}"), 2, 1],
                                [toBytes("\xf2\xff[\x20\x21\x22\x23\x26\x27]{1}"), 3, 1],
                                [toBytes("\xf2\xff[\xe0\xe1\xe2\xe3\xe4\xe6\xe7]{1}"), 3, 1],
                                [toBytes("\xf2\xff[\x10\x11\x12\x13\x16\x17]{1}"), 3, 1],
                                [toBytes("\xf2\xff[\xd0\xd1\xd2\xd3\xd4\xd6\xd7]{1}"), 3, 1]
                       ];
             return gadgetsFinding(section, gadgets);
   }

 function addSYSGadgets( section) {
         gadgets = [
                            [toBytes("\xcd\x80"), 2, 1],
                            [toBytes("\x0f\x34"), 2, 1],
                            [toBytes("\x0f\x05"), 2, 1],
                            [toBytes("\x65\xff\x15\x10\x00\x00\x00"), 7, 1],
                            [toBytes("\xcd\x80\xc3"), 3, 1],
                            [toBytes("\x0f\x34\xc3"), 3, 1],
                            [toBytes("\x0f\x05\xc3"), 3, 1],
                            [toBytes("\x65\xff\x15\x10\x00\x00\x00\xc3"), 8, 1]
                   ];

         return gadgetsFinding(section, gadgets);
}

function passCleanX86(gadgets, multibr) {
     n = [];
     br = ["ret", "retf", "int", "sysenter", "jmp", "call", "syscall"];
     for (gi in gadgets) {
         var gadget = gadgets[gi];
         var gadgetstr = gadget["gadget"];
         var insts = gadgetstr.split(" ; ");
         if (insts.length == 1 && !inArray(br, insts[0].split(" ")[0])) {
             continue
         } if (!inArray(br, insts[insts.length-2].split(" ")[0])) {
             continue
         } if (checkInstructionBlackListedX86(insts)) {
             continue
         } if (!multibr && checkMultiBr(insts, br) > 1) {
             continue
         } if ((gadget["gadget"].match(/ret/g) || []).length > 1) {
             continue
         }
         n += [gadget]
     }
     return n
 }

 function gadgetsFinding(section, gadgets, offset) {
     var C_OP    = 0;
     var C_SIZE  = 1;
     var C_ALIGN = 2;
     var PREV_BYTES = 9; //# Number of bytes prior to the gadget to store.
     var ret = [];

     for (var gadi in gadgets) {
         var gad = gadgets[gadi];
         var oprg = new RegExp(gad[C_OP], "g");
         var opri = new RegExp(gad[C_OP], "i");
         debugger;
         var allRefRet = matchPositions(oprg, section["opcodes"])
         postMessage({status: "Found " + allRefRet + " matching candidates..."});
         for (refi in allRefRet) {
           var ref = allRefRet[refi];
           //ROPgadget's depth option goes here...
             for (var i = 0; i < 10; i++) {
                 if ((section["vaddr"]+ref-(i*gad[C_ALIGN])) % gad[C_ALIGN] == 0) {
                     var opcode = section["opcodes"].slice(ref-(i*gad[C_ALIGN]),ref+gad[C_SIZE]);
                     var decodes = [];
                     var md = new cs.Capstone(cs.ARCH_X86, cs.MODE_64);
                     try {
                        decodes = md.disasm(opcode, section["vaddr"]+ref);
                      } catch (e) {
                        continue
                      }
                     var gadget = "";
                     var lastdecode;
                     for (var decodei in decodes) {
                       var decode = decodes[decodei];
                       gadget += (decode.mnemonic + " " + decode.op_str + " ; ").replace("  ", " ");
                       lastdecode = decode;
                     }
                     if (!lastdecode || !opri.exec(lastdecode.bytes)) {
                             continue;
                     }
                     if (gadget.length > 0) {
                         gadget = gadget.slice(0,gadget.length-4);
                         off = offset;
                         vaddr = off+section["vaddr"]+ref-(i*gad[C_ALIGN]);
                         prevBytesAddr = Math.max(section["vaddr"], vaddr - PREV_BYTES);
                         prevBytes = section["opcodes"].slice(prevBytesAddr-section["vaddr"],vaddr-section["vaddr"]);
                         ret.push(
                            {
                            "vaddr" :  vaddr,
                            "gadget" : gadget,
                            "decodes" : decodes,
                            "bytes": section["opcodes"].slice(ref-(i*gad[C_ALIGN]),ref+gad[C_SIZE]),
                            "prev": prevBytes
                          });
                     }
                    md.close();
                   }
               }
         }
     }
     return ret;
}

function checkInstructionBlackListedX86(insts) {
    var bl = ["db", "int3"];
    for (insti in insts) {
      var inst = insts[insti];

        for (bi in bl) {
          var b = bl[bi];
            if (inst.split(" ")[0] == b) {
                return true;
            }
        }
    }
    return false;
  }

function checkMultiBr(insts, br) {
    var count = 0
    for (insti in insts) {
        if (inArray(br, inst.split()[0])) {
            count += 1
        }
    }
    return count;
}

function matchPositions(re, str) {
  var mps = [];
  while ((match = re.exec(str)) != null) {
    mps.push(match.index);
  }
  return mps;
}

function inArray(arr, elem) {
  for (ai in arr) {
    var ae = arr[ai];
    if (ae == elem) {
      return true
    }
  }
  return false
}

function appendAll(array1, array2) {
  for (var i in array2) {
    array1.push(array2[i]);
  }
}

function toBytes(str) {
  var wrappedStr = new String(str);
  var byteArray = [];
  for (var i=0; i < wrappedStr.length; i++) {
      byteArray.push(i);
  }
  return byteArray;
}


importScripts("capstone.min.js");

//Main Webworker handler
 onmessage = function (e) {
   console.log(e.data);
   gadgets = getAllGadgets(e.data);
   postMessage({status: "Found gadgets", gadgets: gadgets});
 }
