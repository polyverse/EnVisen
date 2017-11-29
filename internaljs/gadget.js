
self.importScripts("../externaljs/capstone.min.js");

//Main Webworker handler
 onmessage = function (e) {
   const arch = resolveArch(e.data.arch);
   const mode = resolveMode(arch, e.data.bits, e.data.endian, e.data.thumb);
   const gadgets = getAllGadgets(e.data.sections, arch, mode);
   postMessage({status: "Found gadgets", gadgets: gadgets});
   close();
 }

function resolveArch(archstr) {
  if (archstr == "x86") {
    return cs.ARCH_X86;
  } else if (archstr == "arm") {
      return cs.ARCH_ARM;
  } else if (archstr == "arm64") {
      return cs.ARCH_ARM64;
  } else if (archstr == "mips") {
      return cs.ARCH_MIPS;
  } else if (archstr == "ppc") {
      return cs.ARCH_PPC;
  } else if (archstr == "sparc") {
      return cs.ARCH_SPARC;
  } else {
    const err = "Unknown Architecture: " + archstr;
    postMessage({status: err});
    throw err;
  }
}

// http://www.capstone-engine.org/lang_python.html
function resolveMode(arch, bits, endian, thumb) {
  let mode = 0;

 if (arch == cs.ARCH_ARM64) {
   mode = cs.MODE_ARM;
   mode = attachEndianToMode(mode, endian);
 } else if (arch == cs.ARCH_ARM) {
    if (thumb) {
      mode = cs.MODE_THUMB;
    } else {
      mode = cs.MODE_ARM;
    }
    mode = attachEndianToMode(mode, endian);
  } else if (arch == cs.ARCH_X86 || arch == cs.ARCH_PPC) {
    mode = attachBitsToMode(mode, bits);
    mode = attachEndianToMode(mode, endian);
  } else if (arch == cs.ARCH_MIPS) {
    mode = attachBitsToMode(mode, bits);
    mode = attachEndianToMode(mode, endian);
  }

  return mode;
}

function attachBitsToMode(mode, bits) {
  if (bits == 32 || bits == "32") {
    mode |= cs.MODE_32;
  } else if (bits == 64 || bits == "64") {
    mode |= cs.MODE_64;
  } else {
    const err = "Unknown Bits (must be 32 or 64) for x86, PPC or MIPS: " + bits;
    postMessage({status: err});
    throw err;
  }
  return mode;
}

function attachEndianToMode(mode, endian) {
  if (endian == "little") {
    mode |= cs.MODE_LITTLE_ENDIAN;
  } else if (endian == "big") {
    //mode += cs.MODE_BIG_ENDIAN;
    mode |= 0x80000000;
  } else {
    const err = "Unknown Bits (must be little or big): " + endian;
    postMessage({status: err});
    throw err;
  }

  return mode;
}

function  getAllGadgets(sections, arch, mode) {
  let gadgets = [];

  for (si in sections) {
    const offByOne = parseInt(si)+1;
    postMessage({status: "==> Finding gadgets in section " + offByOne + " of " + sections.length});
    const section = sections[si];
    const localgadgets = getAllGadgetsInSection(section, arch, mode);
    postMessage({status: "==> Found " +localgadgets.length+ " gadgets in section"});
    gadgets = gadgets.concat(localgadgets);
  }

  //# Pass clean single instruction and unknown instructions
  postMessage({status: "==> Cleaning gadgets (removing blacklisted ones, false positives, redundant, etc.) from " + gadgets.length + " total gadgets."});
  gadgets = passClean(gadgets, arch)

  //# Delete duplicate gadgets
  //postMessage({status: "Deleting duplicate gadgets from " + gadgets.length + " total gadgets." });
  //gadgets = deleteDuplicateGadgets(gadgets)

  // Strip fields no longer needed
  postMessage({status: "==> Stripping " + gadgets.length+ " gadgets for rendering"});
  gadgets = stripGadgets(gadgets);


  return gadgets;
}



function getAllGadgetsInSection(section, arch, mode) {
   var gadgets = [];

   postMessage({status: "====> Looking for ROP gadgets out of ROP/JOP/SYS gadget types"});
   var ropGadgets = addROPGadgets(section, arch, mode);
   gadgets = gadgets.concat(ropGadgets);
   postMessage({status: "====> Found " + ropGadgets.length + " ROP gadgets."});

   postMessage({status: "====> Looking for JOP gadgets out of ROP/JOP/SYS gadget types"});
   var jopGadgets = addJOPGadgets(section, arch, mode);
   postMessage({status: "====> Found " + jopGadgets.length + " JOP gadgets."});
   gadgets = gadgets.concat(jopGadgets);

   postMessage({status: "====> Looking for SYS gadgets out of ROP/JOP/SYS gadget types"});
   var sysGadgets = addSYSGadgets(section, arch, mode);
   postMessage({status: "====> Found " + sysGadgets.length + " SYS gadgets."});
   gadgets = gadgets.concat(sysGadgets);
   return gadgets;
}


function addROPGadgets(section, arch, mode) {
    let gadgets = [];
    if (arch == cs.ARCH_X86) {
      gadgets = [
                    [toMatcher("\xc3"), 1, 1],
                    [toMatcher("\xc2[\x00-\xff]{2}"), 3, 1],
                    [toMatcher("\xcb"), 1, 1],
                    [toMatcher("\xca[\x00-\xff]{2}"), 3, 1],
                    [toMatcher("\xf2\xc3"), 2, 1],
                    [toMatcher("\xf2\xc2[\x00-\xff]{2}"), 4, 1]
               ];
    } else if (arch == cs.ARCH_MIPS) {
         gadgets = []; //            # MIPS doesn't contains RET instruction set. Only JOP gadgets
    } else if (arch == cs.ARCH_PPC) {
        gadgets = [
                        [toMatcher("\x4e\x80\x00\x20"), 4, 4]
                   ];
    } else if (arch == cs.ARCH_SPARC) {
        gadgets = [
                        [toMatcher("\x81\xc3\xe0\x08"), 4, 4],
                        [toMatcher("\x81\xc7\xe0\x08"), 4, 4],
                        [toMatcher("\x81\xe8\x00\x00"), 4, 4]
                   ];

    } else if (arch == cs.ARCH_ARM) {
         gadgets = []; //           # ARM doesn't contains RET instruction set. Only JOP gadgets
    } else if (arch == cs.ARCH_ARM64) {
        gadgets =  [
                        [toMatcher("\xc0\x03\x5f\xd6"), 4, 4]
                   ];
    } else {
      postMessage({status: "addROPGadgets() - Architecture not supported. Aborting gadget finding."});
      return;
    }

    if (gadgets.length > 0) {
      return gadgetsFinding(section, gadgets, arch, mode);
    }
    return gadgets;
}

function addJOPGadgets(section, arch, mode) {
  let gadgets = [];
  if (arch  == cs.ARCH_X86) {
    gadgets = [
                       [toMatcher("\xff[\x20\x21\x22\x23\x26\x27]{1}"), 2, 1],
                       [toMatcher("\xff[\xe0\xe1\xe2\xe3\xe4\xe6\xe7]{1}"), 2, 1],
                       [toMatcher("\xff[\x10\x11\x12\x13\x16\x17]{1}"), 2, 1],
                       [toMatcher("\xff[\xd0\xd1\xd2\xd3\xd4\xd6\xd7]{1}"), 2, 1],
                       [toMatcher("\xf2\xff[\x20\x21\x22\x23\x26\x27]{1}"), 3, 1],
                       [toMatcher("\xf2\xff[\xe0\xe1\xe2\xe3\xe4\xe6\xe7]{1}"), 3, 1],
                       [toMatcher("\xf2\xff[\x10\x11\x12\x13\x16\x17]{1}"), 3, 1],
                       [toMatcher("\xf2\xff[\xd0\xd1\xd2\xd3\xd4\xd6\xd7]{1}"), 3, 1]
              ];
  } else if (arch == cs.ARCH_MIPS) {
      gadgets = [
                         [toMatcher("\x09\xf8\x20\x03[\x00-\xff]{4}"), 8, 4],
                         [toMatcher("\x08\x00\x20\x03[\x00-\xff]{4}"), 8, 4],
                         [toMatcher("\x08\x00\xe0\x03[\x00-\xff]{4}"), 8, 4]
                ];
  } else if (arch == cs.ARCH_PPC) {
      gadgets = []; // # PPC architecture doesn't contains reg branch instruction
  } else if (arch == cs.ARCH_SPARC) {
      gadgets = [
                         [toMatcher("\x81\xc0[\x00\x40\x80\xc0]{1}\x00"), 4, 4]
                ];
  } else if (arch == cs.ARCH_ARM64) {
      gadgets = [
                         [toMatcher("[\x00\x20\x40\x60\x80\xa0\xc0\xe0]{1}[\x00-\x03]{1}[\x1f\x5f]{1}\xd6"), 4, 4],
                         [toMatcher("[\x00\x20\x40\x60\x80\xa0\xc0\xe0]{1}[\x00-\x03]{1}\?\xd6"), 4, 4]
                ];
  } else if (arch == cs.ARCH_ARM) {
      if (mode & cs.MODE_THUMB) {
          gadgets = [
                         [toMatcher("[\x00\x08\x10\x18\x20\x28\x30\x38\x40\x48\x70]{1}\x47"), 2, 2],
                         [toMatcher("[\x80\x88\x90\x98\xa0\xa8\xb0\xb8\xc0\xc8\xf0]{1}\x47"), 2, 2],
                         [toMatcher("[\x00-\xff]{1}\xbd"), 2, 2]
                    ];
      } else {
          gadgets = [
                         [toMatcher("[\x10-\x19\x1e]{1}\xff\x2f\xe1"), 4, 4],
                         [toMatcher("[\x30-\x39\x3e]{1}\xff\x2f\xe1"), 4, 4],
                         [toMatcher("[\x00-\xff][\x80-\xff][\x10-\x1e\x30-\x3e\x50-\x5e\x70-\x7e\x90-\x9e\xb0-\xbe\xd0-\xde\xf0-\xfe][\xe8\xe9]"), 4, 4]
                    ];
      }
  } else {
      postMessage({status: "addJOPGadgets() - Architecture not supported"});
      return
  }

  if (gadgets.length > 0) {
    return gadgetsFinding(section, gadgets, arch, mode);
  }
  return gadgets;

}

 function addSYSGadgets(section, arch, mode) {
  let gadgets = [];
  if (arch == cs.ARCH_X86) {
    gadgets = [
      [toMatcher("\xcd\x80"), 2, 1],
      [toMatcher("\x0f\x34"), 2, 1],
      [toMatcher("\x0f\x05"), 2, 1],
      [toMatcher("\x65\xff\x15\x10\x00\x00\x00"), 7, 1],
      [toMatcher("\xcd\x80\xc3"), 3, 1],
      [toMatcher("\x0f\x34\xc3"), 3, 1],
      [toMatcher("\x0f\x05\xc3"), 3, 1],
      [toMatcher("\x65\xff\x15\x10\x00\x00\x00\xc3"), 8, 1]
     ];
   } else if (arch == cs.ARCH_MIPS) {
       gadgets = [
                [toMatcher("\x0c\x00\x00\x00"), 4, 4]
       ];
   } else if (arch == cs.ARCH_PPC) {
       gadgets = []; // # TODO (sc inst)
   } else if (arch == cs.ARCH_SPARC) {
       gadgets = []; // # TODO (ta inst)
   } else if (arch == cs.ARCH_ARM64) {
       gadgets = []; // # TODO
   } else if (arch == cs.ARCH_ARM) {
       if (mode & cs.MODE_THUMB) {
           gadgets = [
                          [toMatcher("\x00-\xff]{1}\xef"), 2, 2]
                     ];
       } else {
           gadgets = [
                          [toMatcher("\x00-\xff]{3}\xef"), 4, 4]
                     ];
       }
   } else {
       postMessage({status: "addSYSGadgets() - Architecture not supported"});
       return
   }

  if (gadgets.length > 0) {
    return gadgetsFinding(section, gadgets, arch, mode);
  }

  return gadgets;

}

 function gadgetsFinding(section, gadgets, arch, mode, offset) {
     var offset = offset || 0;
     const C_OP    = 0;
     const C_SIZE  = 1;
     const C_ALIGN = 2;
     const PREV_BYTES = 9; //# Number of bytes prior to the gadget to store.
     const ret = [];
     const md = new cs.Capstone(arch, mode);

     const errorTypes = {};

     const opcodesStr = encodeArray(section["opcodes"]);
     for (let gadi in gadgets) {
         {
           const offByOne = parseInt(gadi) + 1;
           postMessage({status: "======> Looking for gadget " + offByOne + " of " + gadgets.length});
         }
         const gad = gadgets[gadi];
         const oprg = new RegExp(gad[C_OP], "g");
         const opri = new RegExp(gad[C_OP], "i");
         const allRefRet = matchPositions(oprg, opcodesStr)
         let updateCounter = 0;
         for (let refi in allRefRet) {
           updateCounter++;
           if (updateCounter >= 10000) {
             const offByOne = parseInt(refi) + 1;
             postMessage({status: "========> Completed " + offByOne + " out of " + allRefRet.length});
             updateCounter = 0;
           }

           const ref = allRefRet[refi];
           //ROPgadget's depth option goes here...
           for (let i = 0; i < 10; i++) {
               if ((section["vaddr"]+ref-(i*gad[C_ALIGN])) % gad[C_ALIGN] == 0) {
                   const opcode = section["opcodes"].slice(ref-(i*gad[C_ALIGN]),ref+gad[C_SIZE]);
                   let decodes = [];
                   try {
                      decodes = md.disasm(opcode, section["vaddr"]+ref);
                    } catch (e) {
                      if (typeof(errorTypes[e]) === 'undefined') {
                        errorTypes[e] = 1;
                      } else {
                        errorTypes[e]++;
                      }
                      continue
                    }
                   let gadget = "";
                   let lastdecode;
                   for (let decodei in decodes) {
                     const decode = decodes[decodei];
                     gadget += (decode.mnemonic + " " + decode.op_str + " ; ").replace("  ", " ");
                     lastdecode = decode;
                   }
                   if (!lastdecode || !opri.exec(encodeArray(lastdecode.bytes))) {
                           continue;
                   }
                   if (gadget.length > 0) {
                       gadget = gadget.slice(0,gadget.length-3);
                       const off = offset;
                       const vaddr = off+section["vaddr"]+ref-(i*gad[C_ALIGN]);
                       const prevBytesAddr = Math.max(section["vaddr"], vaddr - PREV_BYTES);
                       const prevBytes = section["opcodes"].slice(prevBytesAddr-section["vaddr"],vaddr-section["vaddr"]);
                       const newGad = {
                           "vaddr" :  vaddr,
                           "gadget" : gadget,
                           "decodes" : decodes,
                           "bytes": section["opcodes"].slice(ref-(i*gad[C_ALIGN]),ref+gad[C_SIZE]),
                           "prev": prevBytes
                         };
                       ret.push(newGad);
                   }
                 }
             }
         }
     }

     postMessage({status: "Following errors occurred when finding rop gadgets: " + JSON.stringify(errorTypes)});

     try {
       md.close();
     } catch (e) {
       postMessage({status: "Ignoring capstone close error: " + e});
     }
     return ret;
}

function passClean(gadgets, arch, multibr) {
      if (arch == cs.ARCH_X86) {
                 return passCleanX86(gadgets, multibr);
      } else if (arch == cs.ARCH_MIPS) {
           return gadgets;
      } else if (arch == cs.ARCH_PPC) {
            return gadgets;
      } else if (arch == cs.ARCH_SPARC) {
          return gadgets;
      } else if (arch == cs.ARCH_ARM) {
            return gadgets;
      } else if (arch == cs.ARCH_ARM64) {
          return gadgets;
      } else {
          postMessage({status: "passClean() - Architecture not supported"});
      }
}

function passCleanX86(gadgets, multibr) {
     n = [];
     br = ["ret", "retf", "int", "sysenter", "jmp", "call", "syscall"];
     for (gi in gadgets) {
         var gadget = gadgets[gi];
         var gadgetstr = gadget["gadget"];
         var insts = gadgetstr.split(" ; ");
         if (insts.length == 1 && !br.includes(insts[0].split(" ")[0])) {
             continue
         } if (!br.includes(insts[insts.length-1].split(" ")[0])) {
             continue
         } if (checkInstructionBlackListedX86(insts)) {
             continue
         } if (!multibr && checkMultiBr(insts, br) > 1) {
             continue
         } if ((gadget["gadget"].match(/ret/g) || []).length > 1) {
             continue
         }
         n.push(gadget);
     }
     return n
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
        var inst = insts[insti];
        if (br.includes(inst.split()[0])) {
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

function toMatcher(str) {
  return str;
}

function encodeArray(uint8array) {
  var myString = "";
  for (var i=0; i<uint8array.length; i++) {
      myString += String.fromCharCode(uint8array[i])
  }
  return myString;
}


function deleteDuplicateGadgets(currentGadgets) {
    var gadgets_content_set = new Set();
    var unique_gadgets = [];

    for (gi in currentGadgets) {
      var gadget = currentGadgets[gi];
      var gad = gadget["gadget"]
      if (gadgets_content_set.has(gad)) {
        continue
      }
      gadgets_content_set.add(gad)
      unique_gadgets.push(gadget);
    }
    return unique_gadgets
}

function stripGadgets(gadgets) {
  var strippedGadgets = [];

  for (var gi in gadgets) {
    var gadget = gadgets[gi];
    var strippedGadget = {
      vaddr: gadget.vaddr.toString(16),
      gadget: gadget.gadget
    };
    strippedGadgets.push(strippedGadget);
  }

  return strippedGadgets;
}
