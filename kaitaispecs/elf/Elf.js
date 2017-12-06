// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'));
  } else {
    root.Elf = factory(root.KaitaiStream);
  }
}(this, function (KaitaiStream) {
var Elf = (function() {
  Elf.SymbolBind = Object.freeze({
    LOCAL: 0,
    GLOBAL: 1,
    WEAK: 2,

    0: "LOCAL",
    1: "GLOBAL",
    2: "WEAK",
  });

  Elf.Endian = Object.freeze({
    LE: 1,
    BE: 2,

    1: "LE",
    2: "BE",
  });

  Elf.PhFlags = Object.freeze({
    PF_X: 1,
    PF_W: 2,
    PF_R: 4,
    PF_MASKPROC: 4026531840,

    1: "PF_X",
    2: "PF_W",
    4: "PF_R",
    4026531840: "PF_MASKPROC",
  });

  Elf.ShFlags = Object.freeze({
    SHF_WRITE: 1,
    SHF_ALLOC: 2,
    SHF_EXECINSTR: 4,
    SHF_MERGE: 16,
    SHF_STRINGS: 32,
    SHF_INFO_LINK: 64,
    SHF_LINK_ORDER: 128,
    SHF_OS_NONCONFORMING: 256,
    SHF_GROUP: 512,
    SHF_TLS: 1024,
    SHF_ORDERED: 67108864,
    SHF_EXCLUDE: 134217728,
    SHF_MASKOS: 267386880,
    SHF_MASKPROC: 4026531840,

    1: "SHF_WRITE",
    2: "SHF_ALLOC",
    4: "SHF_EXECINSTR",
    16: "SHF_MERGE",
    32: "SHF_STRINGS",
    64: "SHF_INFO_LINK",
    128: "SHF_LINK_ORDER",
    256: "SHF_OS_NONCONFORMING",
    512: "SHF_GROUP",
    1024: "SHF_TLS",
    67108864: "SHF_ORDERED",
    134217728: "SHF_EXCLUDE",
    267386880: "SHF_MASKOS",
    4026531840: "SHF_MASKPROC",
  });

  Elf.RelocationTypesSparc32 = Object.freeze({
    SPARC_NONE: 0,
    SPARC_8: 1,
    SPARC_16: 2,
    SPARC_32: 3,
    SPARC_DISP8: 4,
    SPARC_DISP16: 5,
    SPARC_DISP32: 6,
    SPARC_WDISP30: 7,
    SPARC_WDISP22: 8,
    SPARC_HI22: 9,
    SPARC_22: 10,
    SPARC_13: 11,
    SPARC_LO10: 12,
    SPARC_GOT10: 13,
    SPARC_GOT13: 14,
    SPARC_GOT22: 15,
    SPARC_PC10: 16,
    SPARC_PC22: 17,
    SPARC_WPLT30: 18,
    SPARC_COPY: 19,
    SPARC_GLOB_DAT: 20,
    SPARC_JMP_SLOT: 21,
    SPARC_RELATIVE: 22,
    SPARC_UA32: 23,
    SPARC_PLT32: 24,
    SPARC_HIPLT22: 25,
    SPARC_LOPLT10: 26,
    SPARC_PCPLT32: 27,
    SPARC_PCPLT22: 28,
    SPARC_PCPLT10: 29,
    SPARC_10: 30,
    SPARC_11: 31,
    SPARC_HH22: 34,
    SPARC_HM10: 35,
    SPARC_LM22: 36,
    SPARC_PC_HH22: 37,
    SPARC_PC_HM10: 38,
    SPARC_PC_LM22: 39,
    SPARC_WDISP16: 40,
    SPARC_WDISP19: 41,
    SPARC_7: 43,
    SPARC_5: 44,
    SPARC_6: 45,
    SPARC_HIX22: 48,
    SPARC_LOX10: 49,
    SPARC_44: 50,
    SPARC_M44: 51,
    SPARC_L44: 52,
    SPARC_REGISTER: 53,
    SPARC_UA16: 55,
    SPARC_GOTDATA_HIX22: 80,
    SPARC_GOTDATA_LOX10: 81,
    SPARC_GOTDATA_OP_HIX22: 82,
    SPARC_GOTDATA_OP_LOX10: 83,
    SPARC_GOTDATA_OP: 84,
    SPARC_SIZE_32: 86,
    SPARC_SPARC_WDISP10: 88,

    0: "SPARC_NONE",
    1: "SPARC_8",
    2: "SPARC_16",
    3: "SPARC_32",
    4: "SPARC_DISP8",
    5: "SPARC_DISP16",
    6: "SPARC_DISP32",
    7: "SPARC_WDISP30",
    8: "SPARC_WDISP22",
    9: "SPARC_HI22",
    10: "SPARC_22",
    11: "SPARC_13",
    12: "SPARC_LO10",
    13: "SPARC_GOT10",
    14: "SPARC_GOT13",
    15: "SPARC_GOT22",
    16: "SPARC_PC10",
    17: "SPARC_PC22",
    18: "SPARC_WPLT30",
    19: "SPARC_COPY",
    20: "SPARC_GLOB_DAT",
    21: "SPARC_JMP_SLOT",
    22: "SPARC_RELATIVE",
    23: "SPARC_UA32",
    24: "SPARC_PLT32",
    25: "SPARC_HIPLT22",
    26: "SPARC_LOPLT10",
    27: "SPARC_PCPLT32",
    28: "SPARC_PCPLT22",
    29: "SPARC_PCPLT10",
    30: "SPARC_10",
    31: "SPARC_11",
    34: "SPARC_HH22",
    35: "SPARC_HM10",
    36: "SPARC_LM22",
    37: "SPARC_PC_HH22",
    38: "SPARC_PC_HM10",
    39: "SPARC_PC_LM22",
    40: "SPARC_WDISP16",
    41: "SPARC_WDISP19",
    43: "SPARC_7",
    44: "SPARC_5",
    45: "SPARC_6",
    48: "SPARC_HIX22",
    49: "SPARC_LOX10",
    50: "SPARC_44",
    51: "SPARC_M44",
    52: "SPARC_L44",
    53: "SPARC_REGISTER",
    55: "SPARC_UA16",
    80: "SPARC_GOTDATA_HIX22",
    81: "SPARC_GOTDATA_LOX10",
    82: "SPARC_GOTDATA_OP_HIX22",
    83: "SPARC_GOTDATA_OP_LOX10",
    84: "SPARC_GOTDATA_OP",
    86: "SPARC_SIZE_32",
    88: "SPARC_SPARC_WDISP10",
  });

  Elf.RelocationTypesSparc64 = Object.freeze({
    SPARC_HI22: 9,
    SPARC_GLOB_DAT: 20,
    SPARC_RELATIVE: 22,
    SPARC_64: 32,
    SPARC_OLO10: 33,
    SPARC_DISP64: 46,
    SPARC_PLT64: 47,
    SPARC_REGISTER: 53,
    SPARC_UA64: 54,
    SPARC_H34: 85,
    SPARC_SIZE64: 87,

    9: "SPARC_HI22",
    20: "SPARC_GLOB_DAT",
    22: "SPARC_RELATIVE",
    32: "SPARC_64",
    33: "SPARC_OLO10",
    46: "SPARC_DISP64",
    47: "SPARC_PLT64",
    53: "SPARC_REGISTER",
    54: "SPARC_UA64",
    85: "SPARC_H34",
    87: "SPARC_SIZE64",
  });

  Elf.ShType = Object.freeze({
    NULL_TYPE: 0,
    PROGBITS: 1,
    SYMTAB: 2,
    STRTAB: 3,
    RELA: 4,
    HASH: 5,
    DYNAMIC: 6,
    NOTE: 7,
    NOBITS: 8,
    REL: 9,
    SHLIB: 10,
    DYNSYM: 11,
    INIT_ARRAY: 14,
    FINI_ARRAY: 15,
    PREINIT_ARRAY: 16,
    GROUP: 17,
    SYMTAB_SHNDX: 18,
    SUNW_CAPCHAIN: 1879048175,
    SUNW_CAPINFO: 1879048176,
    SUNW_SYMSORT: 1879048177,
    SUNW_TLSSORT: 1879048178,
    SUNW_LDYNSYM: 1879048179,
    SUNW_DOF: 1879048180,
    SUNW_CAP: 1879048181,
    SUNW_SIGNATURE: 1879048182,
    SUNW_ANNOTATE: 1879048183,
    SUNW_DEBUGSTR: 1879048184,
    SUNW_DEBUG: 1879048185,
    SUNW_MOVE: 1879048186,
    SUNW_COMDAT: 1879048187,
    SUNW_SYMINFO: 1879048188,
    SUNW_VERDEF: 1879048189,
    SUNW_VERNEED: 1879048190,
    SUNW_VERSYM: 1879048191,
    SPARC_GOTDATA: 1879048192,
    AMD64_UNWIND: 1879048193,

    0: "NULL_TYPE",
    1: "PROGBITS",
    2: "SYMTAB",
    3: "STRTAB",
    4: "RELA",
    5: "HASH",
    6: "DYNAMIC",
    7: "NOTE",
    8: "NOBITS",
    9: "REL",
    10: "SHLIB",
    11: "DYNSYM",
    14: "INIT_ARRAY",
    15: "FINI_ARRAY",
    16: "PREINIT_ARRAY",
    17: "GROUP",
    18: "SYMTAB_SHNDX",
    1879048175: "SUNW_CAPCHAIN",
    1879048176: "SUNW_CAPINFO",
    1879048177: "SUNW_SYMSORT",
    1879048178: "SUNW_TLSSORT",
    1879048179: "SUNW_LDYNSYM",
    1879048180: "SUNW_DOF",
    1879048181: "SUNW_CAP",
    1879048182: "SUNW_SIGNATURE",
    1879048183: "SUNW_ANNOTATE",
    1879048184: "SUNW_DEBUGSTR",
    1879048185: "SUNW_DEBUG",
    1879048186: "SUNW_MOVE",
    1879048187: "SUNW_COMDAT",
    1879048188: "SUNW_SYMINFO",
    1879048189: "SUNW_VERDEF",
    1879048190: "SUNW_VERNEED",
    1879048191: "SUNW_VERSYM",
    1879048192: "SPARC_GOTDATA",
    1879048193: "AMD64_UNWIND",
  });

  Elf.OsAbi = Object.freeze({
    SYSTEM_V: 0,
    HP_UX: 1,
    NETBSD: 2,
    GNU: 3,
    SOLARIS: 6,
    AIX: 7,
    IRIX: 8,
    FREEBSD: 9,
    TRU64: 10,
    MODESTO: 11,
    OPENBSD: 12,
    OPENVMS: 13,
    NSK: 14,
    AROS: 15,
    FENIXOS: 16,
    CLOUDABI: 17,
    OPENVOS: 18,

    0: "SYSTEM_V",
    1: "HP_UX",
    2: "NETBSD",
    3: "GNU",
    6: "SOLARIS",
    7: "AIX",
    8: "IRIX",
    9: "FREEBSD",
    10: "TRU64",
    11: "MODESTO",
    12: "OPENBSD",
    13: "OPENVMS",
    14: "NSK",
    15: "AROS",
    16: "FENIXOS",
    17: "CLOUDABI",
    18: "OPENVOS",
  });

  Elf.Machine = Object.freeze({
    NOT_SET: 0,
    SPARC: 2,
    X86: 3,
    MIPS: 8,
    SPARCPLUS: 18,
    POWERPC: 20,
    ARM: 40,
    SUPERH: 42,
    IA_64: 50,
    X86_64: 62,
    AARCH64: 183,

    0: "NOT_SET",
    2: "SPARC",
    3: "X86",
    8: "MIPS",
    18: "SPARCPLUS",
    20: "POWERPC",
    40: "ARM",
    42: "SUPERH",
    50: "IA_64",
    62: "X86_64",
    183: "AARCH64",
  });

  Elf.SymbolType = Object.freeze({
    NO_TYPE: 0,
    OBJECT: 1,
    FUNC: 2,
    SECTION: 3,
    FILE: 4,

    0: "NO_TYPE",
    1: "OBJECT",
    2: "FUNC",
    3: "SECTION",
    4: "FILE",
  });

  Elf.Bits = Object.freeze({
    B32: 1,
    B64: 2,

    1: "B32",
    2: "B64",
  });

  Elf.RelocationTypesX8664 = Object.freeze({
    AMD64_NONE: 0,
    AMD64_64: 1,
    AMD64_PC32: 2,
    AMD64_GOT32: 3,
    AMD64_PLT32: 4,
    AMD64_COPY: 5,
    AMD64_GLOB_DAT: 6,
    AMD64_JUMP_SLOT: 7,
    AMD64_RELATIVE: 8,
    AMD64_GOTPCREL: 9,
    AMD64_32: 10,
    AMD64_32S: 11,
    AMD64_16: 12,
    AMD64_PC16: 13,
    AMD64_8: 14,
    AMD64_PC8: 15,
    AMD64_PC64: 24,
    AMD64_GOTOFF64: 25,
    AMD64_GOTPC32: 26,
    AMD64_SIZE32: 32,
    AMD64_SIZE64: 33,

    0: "AMD64_NONE",
    1: "AMD64_64",
    2: "AMD64_PC32",
    3: "AMD64_GOT32",
    4: "AMD64_PLT32",
    5: "AMD64_COPY",
    6: "AMD64_GLOB_DAT",
    7: "AMD64_JUMP_SLOT",
    8: "AMD64_RELATIVE",
    9: "AMD64_GOTPCREL",
    10: "AMD64_32",
    11: "AMD64_32S",
    12: "AMD64_16",
    13: "AMD64_PC16",
    14: "AMD64_8",
    15: "AMD64_PC8",
    24: "AMD64_PC64",
    25: "AMD64_GOTOFF64",
    26: "AMD64_GOTPC32",
    32: "AMD64_SIZE32",
    33: "AMD64_SIZE64",
  });

  Elf.PhType = Object.freeze({
    NULL_TYPE: 0,
    LOAD: 1,
    DYNAMIC: 2,
    INTERP: 3,
    NOTE: 4,
    SHLIB: 5,
    PHDR: 6,
    TLS: 7,
    GNU_EH_FRAME: 1685382480,
    GNU_STACK: 1685382481,
    GNU_RELRO: 1685382482,
    HIOS: 1879048191,

    0: "NULL_TYPE",
    1: "LOAD",
    2: "DYNAMIC",
    3: "INTERP",
    4: "NOTE",
    5: "SHLIB",
    6: "PHDR",
    7: "TLS",
    1685382480: "GNU_EH_FRAME",
    1685382481: "GNU_STACK",
    1685382482: "GNU_RELRO",
    1879048191: "HIOS",
  });

  Elf.ObjType = Object.freeze({
    RELOCATABLE: 1,
    EXECUTABLE: 2,
    SHARED: 3,
    CORE: 4,

    1: "RELOCATABLE",
    2: "EXECUTABLE",
    3: "SHARED",
    4: "CORE",
  });

  Elf.RelocationTypesX8632 = Object.freeze({
    X86_386_NONE: 0,
    X86_386_32: 1,
    X86_386_PC32: 2,
    X86_386_GOT32: 3,
    X86_386_PLT32: 4,
    X86_386_COPY: 5,
    X86_386_GLOB_DAT: 6,
    X86_386_JMP_SLOT: 7,
    X86_386_RELATIVE: 8,
    X86_386_GOTOFF: 9,
    X86_386_GOTPC: 10,
    X86_386_32PLT: 11,
    X86_386_16: 20,
    X86_386_PC16: 21,
    X86_386_8: 22,
    X86_386_PC8: 23,
    X86_386_SIZE32: 38,

    0: "X86_386_NONE",
    1: "X86_386_32",
    2: "X86_386_PC32",
    3: "X86_386_GOT32",
    4: "X86_386_PLT32",
    5: "X86_386_COPY",
    6: "X86_386_GLOB_DAT",
    7: "X86_386_JMP_SLOT",
    8: "X86_386_RELATIVE",
    9: "X86_386_GOTOFF",
    10: "X86_386_GOTPC",
    11: "X86_386_32PLT",
    20: "X86_386_16",
    21: "X86_386_PC16",
    22: "X86_386_8",
    23: "X86_386_PC8",
    38: "X86_386_SIZE32",
  });

  Elf.SymbolSectionIndex = Object.freeze({
    UNDEF: 0,
    LIVEPATCH: 65312,
    ABS: 65521,
    COMMON: 65522,

    0: "UNDEF",
    65312: "LIVEPATCH",
    65521: "ABS",
    65522: "COMMON",
  });

  function Elf(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this._read();
  }
  Elf.prototype._read = function() {
    this.magic = this._io.ensureFixedContents([127, 69, 76, 70]);
    this.bits = this._io.readU1();
    this.endian = this._io.readU1();
    this.eiVersion = this._io.readU1();
    this.abi = this._io.readU1();
    this.abiVersion = this._io.readU1();
    this.pad = this._io.readBytes(7);
    this.header = new EndianElf(this._io, this, this._root);
  }

  var EndianElf = Elf.EndianElf = (function() {
    function EndianElf(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    EndianElf.prototype._read = function() {
      switch (this._root.endian) {
      case Elf.Endian.LE:
        this._is_le = true;
        break;
      case Elf.Endian.BE:
        this._is_le = false;
        break;
      }

      if (this._is_le === true) {
        this._readLE();
      } else if (this._is_le === false) {
        this._readBE();
      } else {
        throw new KaitaiStream.UndecidedEndiannessError();
      }
    }
    EndianElf.prototype._readLE = function() {
      this.eType = this._io.readU2le();
      this.machine = this._io.readU2le();
      this.eVersion = this._io.readU4le();
      switch (this._root.bits) {
      case Elf.Bits.B32:
        this.entryPoint = this._io.readU4le();
        break;
      case Elf.Bits.B64:
        this.entryPoint = this._io.readU8le();
        break;
      }
      switch (this._root.bits) {
      case Elf.Bits.B32:
        this.programHeaderOffset = this._io.readU4le();
        break;
      case Elf.Bits.B64:
        this.programHeaderOffset = this._io.readU8le();
        break;
      }
      switch (this._root.bits) {
      case Elf.Bits.B32:
        this.sectionHeaderOffset = this._io.readU4le();
        break;
      case Elf.Bits.B64:
        this.sectionHeaderOffset = this._io.readU8le();
        break;
      }
      this.flags = this._io.readBytes(4);
      this.eEhsize = this._io.readU2le();
      this.programHeaderEntrySize = this._io.readU2le();
      this.qtyProgramHeader = this._io.readU2le();
      this.sectionHeaderEntrySize = this._io.readU2le();
      this.qtySectionHeader = this._io.readU2le();
      this.sectionNamesIdx = this._io.readU2le();
    }
    EndianElf.prototype._readBE = function() {
      this.eType = this._io.readU2be();
      this.machine = this._io.readU2be();
      this.eVersion = this._io.readU4be();
      switch (this._root.bits) {
      case Elf.Bits.B32:
        this.entryPoint = this._io.readU4be();
        break;
      case Elf.Bits.B64:
        this.entryPoint = this._io.readU8be();
        break;
      }
      switch (this._root.bits) {
      case Elf.Bits.B32:
        this.programHeaderOffset = this._io.readU4be();
        break;
      case Elf.Bits.B64:
        this.programHeaderOffset = this._io.readU8be();
        break;
      }
      switch (this._root.bits) {
      case Elf.Bits.B32:
        this.sectionHeaderOffset = this._io.readU4be();
        break;
      case Elf.Bits.B64:
        this.sectionHeaderOffset = this._io.readU8be();
        break;
      }
      this.flags = this._io.readBytes(4);
      this.eEhsize = this._io.readU2be();
      this.programHeaderEntrySize = this._io.readU2be();
      this.qtyProgramHeader = this._io.readU2be();
      this.sectionHeaderEntrySize = this._io.readU2be();
      this.qtySectionHeader = this._io.readU2be();
      this.sectionNamesIdx = this._io.readU2be();
    }

    var ProgramHeader = EndianElf.ProgramHeader = (function() {
      function ProgramHeader(_io, _parent, _root, _is_le) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;
        this._is_le = _is_le;

        this._read();
      }
      ProgramHeader.prototype._read = function() {

        if (this._is_le === true) {
          this._readLE();
        } else if (this._is_le === false) {
          this._readBE();
        } else {
          throw new KaitaiStream.UndecidedEndiannessError();
        }
      }
      ProgramHeader.prototype._readLE = function() {
        this.type = this._io.readU4le();
        if (this._root.bits == Elf.Bits.B64) {
          this.flags64 = this._io.readU4le();
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.offset = this._io.readU4le();
          break;
        case Elf.Bits.B64:
          this.offset = this._io.readU8le();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.vaddr = this._io.readU4le();
          break;
        case Elf.Bits.B64:
          this.vaddr = this._io.readU8le();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.paddr = this._io.readU4le();
          break;
        case Elf.Bits.B64:
          this.paddr = this._io.readU8le();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.filesz = this._io.readU4le();
          break;
        case Elf.Bits.B64:
          this.filesz = this._io.readU8le();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.memsz = this._io.readU4le();
          break;
        case Elf.Bits.B64:
          this.memsz = this._io.readU8le();
          break;
        }
        if (this._root.bits == Elf.Bits.B32) {
          this.flags32 = this._io.readU4le();
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.align = this._io.readU4le();
          break;
        case Elf.Bits.B64:
          this.align = this._io.readU8le();
          break;
        }
      }
      ProgramHeader.prototype._readBE = function() {
        this.type = this._io.readU4be();
        if (this._root.bits == Elf.Bits.B64) {
          this.flags64 = this._io.readU4be();
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.offset = this._io.readU4be();
          break;
        case Elf.Bits.B64:
          this.offset = this._io.readU8be();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.vaddr = this._io.readU4be();
          break;
        case Elf.Bits.B64:
          this.vaddr = this._io.readU8be();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.paddr = this._io.readU4be();
          break;
        case Elf.Bits.B64:
          this.paddr = this._io.readU8be();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.filesz = this._io.readU4be();
          break;
        case Elf.Bits.B64:
          this.filesz = this._io.readU8be();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.memsz = this._io.readU4be();
          break;
        case Elf.Bits.B64:
          this.memsz = this._io.readU8be();
          break;
        }
        if (this._root.bits == Elf.Bits.B32) {
          this.flags32 = this._io.readU4be();
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.align = this._io.readU4be();
          break;
        case Elf.Bits.B64:
          this.align = this._io.readU8be();
          break;
        }
      }
      Object.defineProperty(ProgramHeader.prototype, 'body', {
        get: function() {
          if (this._m_body !== undefined)
            return this._m_body;
          var io = this._root._io;
          var _pos = io.pos;
          io.seek(this.offset);
          if (this._is_le) {
            this._m_body = io.readBytes(this.memsz);
          } else {
            this._m_body = io.readBytes(this.memsz);
          }
          io.seek(_pos);
          return this._m_body;
        }
      });
      Object.defineProperty(ProgramHeader.prototype, 'flags', {
        get: function() {
          if (this._m_flags !== undefined)
            return this._m_flags;
          this._m_flags = (this._root.bits == Elf.Bits.B32 ? this.flags32 : this.flags64);
          return this._m_flags;
        }
      });

      return ProgramHeader;
    })();

    var SectionHeader = EndianElf.SectionHeader = (function() {
      function SectionHeader(_io, _parent, _root, _is_le) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;
        this._is_le = _is_le;

        this._read();
      }
      SectionHeader.prototype._read = function() {

        if (this._is_le === true) {
          this._readLE();
        } else if (this._is_le === false) {
          this._readBE();
        } else {
          throw new KaitaiStream.UndecidedEndiannessError();
        }
      }
      SectionHeader.prototype._readLE = function() {
        this.nameOffset = this._io.readU4le();
        this.type = this._io.readU4le();
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.flags = this._io.readU4le();
          break;
        case Elf.Bits.B64:
          this.flags = this._io.readU8le();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.addr = this._io.readU4le();
          break;
        case Elf.Bits.B64:
          this.addr = this._io.readU8le();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.offset = this._io.readU4le();
          break;
        case Elf.Bits.B64:
          this.offset = this._io.readU8le();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.size = this._io.readU4le();
          break;
        case Elf.Bits.B64:
          this.size = this._io.readU8le();
          break;
        }
        this.linkedSectionIdx = this._io.readU4le();
        this.info = this._io.readBytes(4);
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.align = this._io.readU4le();
          break;
        case Elf.Bits.B64:
          this.align = this._io.readU8le();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.entrySize = this._io.readU4le();
          break;
        case Elf.Bits.B64:
          this.entrySize = this._io.readU8le();
          break;
        }
      }
      SectionHeader.prototype._readBE = function() {
        this.nameOffset = this._io.readU4be();
        this.type = this._io.readU4be();
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.flags = this._io.readU4be();
          break;
        case Elf.Bits.B64:
          this.flags = this._io.readU8be();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.addr = this._io.readU4be();
          break;
        case Elf.Bits.B64:
          this.addr = this._io.readU8be();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.offset = this._io.readU4be();
          break;
        case Elf.Bits.B64:
          this.offset = this._io.readU8be();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.size = this._io.readU4be();
          break;
        case Elf.Bits.B64:
          this.size = this._io.readU8be();
          break;
        }
        this.linkedSectionIdx = this._io.readU4be();
        this.info = this._io.readBytes(4);
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.align = this._io.readU4be();
          break;
        case Elf.Bits.B64:
          this.align = this._io.readU8be();
          break;
        }
        switch (this._root.bits) {
        case Elf.Bits.B32:
          this.entrySize = this._io.readU4be();
          break;
        case Elf.Bits.B64:
          this.entrySize = this._io.readU8be();
          break;
        }
      }

      var Symbol32 = SectionHeader.Symbol32 = (function() {
        function Symbol32(_io, _parent, _root, _is_le) {
          this._io = _io;
          this._parent = _parent;
          this._root = _root || this;
          this._is_le = _is_le;

          this._read();
        }
        Symbol32.prototype._read = function() {

          if (this._is_le === true) {
            this._readLE();
          } else if (this._is_le === false) {
            this._readBE();
          } else {
            throw new KaitaiStream.UndecidedEndiannessError();
          }
        }
        Symbol32.prototype._readLE = function() {
          this.nameOffset = this._io.readU4le();
          this.value = this._io.readU4le();
          this.size = this._io.readU4le();
          this.info = new SymInfo(this._io, this, this._root, this._is_le);
          this.other = this._io.readU1();
          this.shndx = this._io.readU2le();
        }
        Symbol32.prototype._readBE = function() {
          this.nameOffset = this._io.readU4be();
          this.value = this._io.readU4be();
          this.size = this._io.readU4be();
          this.info = new SymInfo(this._io, this, this._root, this._is_le);
          this.other = this._io.readU1();
          this.shndx = this._io.readU2be();
        }

        return Symbol32;
      })();

      var Symbol64 = SectionHeader.Symbol64 = (function() {
        function Symbol64(_io, _parent, _root, _is_le) {
          this._io = _io;
          this._parent = _parent;
          this._root = _root || this;
          this._is_le = _is_le;

          this._read();
        }
        Symbol64.prototype._read = function() {

          if (this._is_le === true) {
            this._readLE();
          } else if (this._is_le === false) {
            this._readBE();
          } else {
            throw new KaitaiStream.UndecidedEndiannessError();
          }
        }
        Symbol64.prototype._readLE = function() {
          this.nameOffset = this._io.readU4le();
          this.info = new SymInfo(this._io, this, this._root, this._is_le);
          this.other = this._io.readU1();
          this.shndx = this._io.readU2le();
          this.value = this._io.readU8le();
          this.size = this._io.readU8le();
        }
        Symbol64.prototype._readBE = function() {
          this.nameOffset = this._io.readU4be();
          this.info = new SymInfo(this._io, this, this._root, this._is_le);
          this.other = this._io.readU1();
          this.shndx = this._io.readU2be();
          this.value = this._io.readU8be();
          this.size = this._io.readU8be();
        }

        return Symbol64;
      })();

      var BlobSection = SectionHeader.BlobSection = (function() {
        function BlobSection(_io, _parent, _root, _is_le) {
          this._io = _io;
          this._parent = _parent;
          this._root = _root || this;
          this._is_le = _is_le;

          this._read();
        }
        BlobSection.prototype._read = function() {

          if (this._is_le === true) {
            this._readLE();
          } else if (this._is_le === false) {
            this._readBE();
          } else {
            throw new KaitaiStream.UndecidedEndiannessError();
          }
        }
        BlobSection.prototype._readLE = function() {
          this.bytes = this._io.readBytesFull();
        }
        BlobSection.prototype._readBE = function() {
          this.bytes = this._io.readBytesFull();
        }

        return BlobSection;
      })();

      var Rela64 = SectionHeader.Rela64 = (function() {
        function Rela64(_io, _parent, _root, _is_le) {
          this._io = _io;
          this._parent = _parent;
          this._root = _root || this;
          this._is_le = _is_le;

          this._read();
        }
        Rela64.prototype._read = function() {

          if (this._is_le === true) {
            this._readLE();
          } else if (this._is_le === false) {
            this._readBE();
          } else {
            throw new KaitaiStream.UndecidedEndiannessError();
          }
        }
        Rela64.prototype._readLE = function() {
          this.rel = new Rel64(this._io, this, this._root, this._is_le);
          this.addend = this._io.readS8le();
        }
        Rela64.prototype._readBE = function() {
          this.rel = new Rel64(this._io, this, this._root, this._is_le);
          this.addend = this._io.readS8be();
        }

        return Rela64;
      })();

      var Rel64 = SectionHeader.Rel64 = (function() {
        function Rel64(_io, _parent, _root, _is_le) {
          this._io = _io;
          this._parent = _parent;
          this._root = _root || this;
          this._is_le = _is_le;

          this._read();
        }
        Rel64.prototype._read = function() {

          if (this._is_le === true) {
            this._readLE();
          } else if (this._is_le === false) {
            this._readBE();
          } else {
            throw new KaitaiStream.UndecidedEndiannessError();
          }
        }
        Rel64.prototype._readLE = function() {
          this.addr = this._io.readU8le();
          this.info = this._io.readU8le();
        }
        Rel64.prototype._readBE = function() {
          this.addr = this._io.readU8be();
          this.info = this._io.readU8be();
        }
        Object.defineProperty(Rel64.prototype, 'symTabIndex', {
          get: function() {
            if (this._m_symTabIndex !== undefined)
              return this._m_symTabIndex;
            this._m_symTabIndex = (this.info >>> 32);
            return this._m_symTabIndex;
          }
        });
        Object.defineProperty(Rel64.prototype, 'type', {
          get: function() {
            if (this._m_type !== undefined)
              return this._m_type;
            this._m_type = (this.info & 4294967295);
            return this._m_type;
          }
        });

        return Rel64;
      })();

      var SymtabSection = SectionHeader.SymtabSection = (function() {
        function SymtabSection(_io, _parent, _root, _is_le) {
          this._io = _io;
          this._parent = _parent;
          this._root = _root || this;
          this._is_le = _is_le;

          this._read();
        }
        SymtabSection.prototype._read = function() {

          if (this._is_le === true) {
            this._readLE();
          } else if (this._is_le === false) {
            this._readBE();
          } else {
            throw new KaitaiStream.UndecidedEndiannessError();
          }
        }
        SymtabSection.prototype._readLE = function() {
          this.symbols = [];
          var i = 0;
          while (!this._io.isEof()) {
            switch (this._root.bits) {
            case Elf.Bits.B32:
              this.symbols.push(new Symbol32(this._io, this, this._root, this._is_le));
              break;
            case Elf.Bits.B64:
              this.symbols.push(new Symbol64(this._io, this, this._root, this._is_le));
              break;
            }
            i++;
          }
        }
        SymtabSection.prototype._readBE = function() {
          this.symbols = [];
          var i = 0;
          while (!this._io.isEof()) {
            switch (this._root.bits) {
            case Elf.Bits.B32:
              this.symbols.push(new Symbol32(this._io, this, this._root, this._is_le));
              break;
            case Elf.Bits.B64:
              this.symbols.push(new Symbol64(this._io, this, this._root, this._is_le));
              break;
            }
            i++;
          }
        }

        return SymtabSection;
      })();

      var SymInfo = SectionHeader.SymInfo = (function() {
        function SymInfo(_io, _parent, _root, _is_le) {
          this._io = _io;
          this._parent = _parent;
          this._root = _root || this;
          this._is_le = _is_le;

          this._read();
        }
        SymInfo.prototype._read = function() {

          if (this._is_le === true) {
            this._readLE();
          } else if (this._is_le === false) {
            this._readBE();
          } else {
            throw new KaitaiStream.UndecidedEndiannessError();
          }
        }
        SymInfo.prototype._readLE = function() {
          this.info = this._io.readU1();
        }
        SymInfo.prototype._readBE = function() {
          this.info = this._io.readU1();
        }
        Object.defineProperty(SymInfo.prototype, 'bind', {
          get: function() {
            if (this._m_bind !== undefined)
              return this._m_bind;
            this._m_bind = (this.info >>> 4);
            return this._m_bind;
          }
        });
        Object.defineProperty(SymInfo.prototype, 'type', {
          get: function() {
            if (this._m_type !== undefined)
              return this._m_type;
            this._m_type = (this.info & 15);
            return this._m_type;
          }
        });

        return SymInfo;
      })();

      var Rela32 = SectionHeader.Rela32 = (function() {
        function Rela32(_io, _parent, _root, _is_le) {
          this._io = _io;
          this._parent = _parent;
          this._root = _root || this;
          this._is_le = _is_le;

          this._read();
        }
        Rela32.prototype._read = function() {

          if (this._is_le === true) {
            this._readLE();
          } else if (this._is_le === false) {
            this._readBE();
          } else {
            throw new KaitaiStream.UndecidedEndiannessError();
          }
        }
        Rela32.prototype._readLE = function() {
          this.rel = new Rel32(this._io, this, this._root, this._is_le);
          this.addend = this._io.readS4le();
        }
        Rela32.prototype._readBE = function() {
          this.rel = new Rel32(this._io, this, this._root, this._is_le);
          this.addend = this._io.readS4be();
        }

        return Rela32;
      })();

      var RelSection = SectionHeader.RelSection = (function() {
        function RelSection(_io, _parent, _root, _is_le) {
          this._io = _io;
          this._parent = _parent;
          this._root = _root || this;
          this._is_le = _is_le;

          this._read();
        }
        RelSection.prototype._read = function() {

          if (this._is_le === true) {
            this._readLE();
          } else if (this._is_le === false) {
            this._readBE();
          } else {
            throw new KaitaiStream.UndecidedEndiannessError();
          }
        }
        RelSection.prototype._readLE = function() {
          this.relocations = [];
          var i = 0;
          while (!this._io.isEof()) {
            switch (this._root.bits) {
            case Elf.Bits.B32:
              this.relocations.push(new Rel32(this._io, this, this._root, this._is_le));
              break;
            case Elf.Bits.B64:
              this.relocations.push(new Rel64(this._io, this, this._root, this._is_le));
              break;
            }
            i++;
          }
        }
        RelSection.prototype._readBE = function() {
          this.relocations = [];
          var i = 0;
          while (!this._io.isEof()) {
            switch (this._root.bits) {
            case Elf.Bits.B32:
              this.relocations.push(new Rel32(this._io, this, this._root, this._is_le));
              break;
            case Elf.Bits.B64:
              this.relocations.push(new Rel64(this._io, this, this._root, this._is_le));
              break;
            }
            i++;
          }
        }

        return RelSection;
      })();

      var Rel32 = SectionHeader.Rel32 = (function() {
        function Rel32(_io, _parent, _root, _is_le) {
          this._io = _io;
          this._parent = _parent;
          this._root = _root || this;
          this._is_le = _is_le;

          this._read();
        }
        Rel32.prototype._read = function() {

          if (this._is_le === true) {
            this._readLE();
          } else if (this._is_le === false) {
            this._readBE();
          } else {
            throw new KaitaiStream.UndecidedEndiannessError();
          }
        }
        Rel32.prototype._readLE = function() {
          this.addr = this._io.readU4le();
          this.info = this._io.readU4le();
        }
        Rel32.prototype._readBE = function() {
          this.addr = this._io.readU4be();
          this.info = this._io.readU4be();
        }
        Object.defineProperty(Rel32.prototype, 'symTabIndex', {
          get: function() {
            if (this._m_symTabIndex !== undefined)
              return this._m_symTabIndex;
            this._m_symTabIndex = (this.info >>> 8);
            return this._m_symTabIndex;
          }
        });
        Object.defineProperty(Rel32.prototype, 'type', {
          get: function() {
            if (this._m_type !== undefined)
              return this._m_type;
            this._m_type = (this.info & 255);
            return this._m_type;
          }
        });

        return Rel32;
      })();

      var RelaSection = SectionHeader.RelaSection = (function() {
        function RelaSection(_io, _parent, _root, _is_le) {
          this._io = _io;
          this._parent = _parent;
          this._root = _root || this;
          this._is_le = _is_le;

          this._read();
        }
        RelaSection.prototype._read = function() {

          if (this._is_le === true) {
            this._readLE();
          } else if (this._is_le === false) {
            this._readBE();
          } else {
            throw new KaitaiStream.UndecidedEndiannessError();
          }
        }
        RelaSection.prototype._readLE = function() {
          this.relocations = [];
          var i = 0;
          while (!this._io.isEof()) {
            switch (this._root.bits) {
            case Elf.Bits.B32:
              this.relocations.push(new Rela32(this._io, this, this._root, this._is_le));
              break;
            case Elf.Bits.B64:
              this.relocations.push(new Rela64(this._io, this, this._root, this._is_le));
              break;
            }
            i++;
          }
        }
        RelaSection.prototype._readBE = function() {
          this.relocations = [];
          var i = 0;
          while (!this._io.isEof()) {
            switch (this._root.bits) {
            case Elf.Bits.B32:
              this.relocations.push(new Rela32(this._io, this, this._root, this._is_le));
              break;
            case Elf.Bits.B64:
              this.relocations.push(new Rela64(this._io, this, this._root, this._is_le));
              break;
            }
            i++;
          }
        }

        return RelaSection;
      })();

      var StrtabSection = SectionHeader.StrtabSection = (function() {
        function StrtabSection(_io, _parent, _root, _is_le) {
          this._io = _io;
          this._parent = _parent;
          this._root = _root || this;
          this._is_le = _is_le;

          this._read();
        }
        StrtabSection.prototype._read = function() {

          if (this._is_le === true) {
            this._readLE();
          } else if (this._is_le === false) {
            this._readBE();
          } else {
            throw new KaitaiStream.UndecidedEndiannessError();
          }
        }
        StrtabSection.prototype._readLE = function() {
          this.strings = new StringsStruct(this._io, this, this._root, this._is_le);
        }
        StrtabSection.prototype._readBE = function() {
          this.strings = new StringsStruct(this._io, this, this._root, this._is_le);
        }

        return StrtabSection;
      })();
      Object.defineProperty(SectionHeader.prototype, 'name', {
        get: function() {
          if (this._m_name !== undefined)
            return this._m_name;
          var io = this._root.header.headerNameStrings._io;
          var _pos = io.pos;
          io.seek(this.nameOffset);
          if (this._is_le) {
            this._m_name = KaitaiStream.bytesToStr(io.readBytesTerm(0, false, true, true), "ASCII");
          } else {
            this._m_name = KaitaiStream.bytesToStr(io.readBytesTerm(0, false, true, true), "ASCII");
          }
          io.seek(_pos);
          return this._m_name;
        }
      });
      Object.defineProperty(SectionHeader.prototype, 'body', {
        get: function() {
          if (this._m_body !== undefined)
            return this._m_body;
          var io = this._root._io;
          var _pos = io.pos;
          io.seek(this.offset);
          if (this._is_le) {
            this._m_body = io.readBytes(this.size);
          } else {
            this._m_body = io.readBytes(this.size);
          }
          io.seek(_pos);
          return this._m_body;
        }
      });
      Object.defineProperty(SectionHeader.prototype, 'parsed', {
        get: function() {
          if (this._m_parsed !== undefined)
            return this._m_parsed;
          if ( ((this.type != Elf.ShType.NULL_TYPE) && (this.type != Elf.ShType.NOBITS) && (this.size > 0)) ) {
            var io = this._root._io;
            var _pos = io.pos;
            io.seek(this.offset);
            if (this._is_le) {
              switch (this.type) {
              case Elf.ShType.NOTE:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.GROUP:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.FINI_ARRAY:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.DYNAMIC:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.NOBITS:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.PREINIT_ARRAY:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.STRTAB:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new StrtabSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.HASH:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.PROGBITS:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.REL:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new RelSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.INIT_ARRAY:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.DYNSYM:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new SymtabSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.SHLIB:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.SYMTAB:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new SymtabSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.SYMTAB_SHNDX:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.RELA:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new RelaSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              default:
                this._m_parsed = io.readBytes(this.size);
                break;
              }
            } else {
              switch (this.type) {
              case Elf.ShType.NOTE:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.GROUP:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.FINI_ARRAY:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.DYNAMIC:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.NOBITS:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.PREINIT_ARRAY:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.STRTAB:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new StrtabSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.HASH:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.PROGBITS:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.REL:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new RelSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.INIT_ARRAY:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.DYNSYM:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new SymtabSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.SHLIB:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.SYMTAB:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new SymtabSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.SYMTAB_SHNDX:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new BlobSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              case Elf.ShType.RELA:
                this._raw__m_parsed = io.readBytes(this.size);
                var _io__raw__m_parsed = new KaitaiStream(this._raw__m_parsed);
                this._m_parsed = new RelaSection(_io__raw__m_parsed, this, this._root, this._is_le);
                break;
              default:
                this._m_parsed = io.readBytes(this.size);
                break;
              }
            }
            io.seek(_pos);
          }
          return this._m_parsed;
        }
      });

      return SectionHeader;
    })();

    var StringsStruct = EndianElf.StringsStruct = (function() {
      function StringsStruct(_io, _parent, _root, _is_le) {
        this._io = _io;
        this._parent = _parent;
        this._root = _root || this;
        this._is_le = _is_le;

        this._read();
      }
      StringsStruct.prototype._read = function() {

        if (this._is_le === true) {
          this._readLE();
        } else if (this._is_le === false) {
          this._readBE();
        } else {
          throw new KaitaiStream.UndecidedEndiannessError();
        }
      }
      StringsStruct.prototype._readLE = function() {
        this.entries = [];
        var i = 0;
        while (!this._io.isEof()) {
          this.entries.push(KaitaiStream.bytesToStr(this._io.readBytesTerm(0, false, true, true), "ASCII"));
          i++;
        }
      }
      StringsStruct.prototype._readBE = function() {
        this.entries = [];
        var i = 0;
        while (!this._io.isEof()) {
          this.entries.push(KaitaiStream.bytesToStr(this._io.readBytesTerm(0, false, true, true), "ASCII"));
          i++;
        }
      }

      return StringsStruct;
    })();
    Object.defineProperty(EndianElf.prototype, 'programHeaders', {
      get: function() {
        if (this._m_programHeaders !== undefined)
          return this._m_programHeaders;
        var _pos = this._io.pos;
        this._io.seek(this.programHeaderOffset);
        if (this._is_le) {
          this._raw__m_programHeaders = new Array(this.qtyProgramHeader);
          this._m_programHeaders = new Array(this.qtyProgramHeader);
          for (var i = 0; i < this.qtyProgramHeader; i++) {
            this._raw__m_programHeaders[i] = this._io.readBytes(this.programHeaderEntrySize);
            var _io__raw__m_programHeaders = new KaitaiStream(this._raw__m_programHeaders[i]);
            this._m_programHeaders[i] = new ProgramHeader(_io__raw__m_programHeaders, this, this._root, this._is_le);
          }
        } else {
          this._raw__m_programHeaders = new Array(this.qtyProgramHeader);
          this._m_programHeaders = new Array(this.qtyProgramHeader);
          for (var i = 0; i < this.qtyProgramHeader; i++) {
            this._raw__m_programHeaders[i] = this._io.readBytes(this.programHeaderEntrySize);
            var _io__raw__m_programHeaders = new KaitaiStream(this._raw__m_programHeaders[i]);
            this._m_programHeaders[i] = new ProgramHeader(_io__raw__m_programHeaders, this, this._root, this._is_le);
          }
        }
        this._io.seek(_pos);
        return this._m_programHeaders;
      }
    });
    Object.defineProperty(EndianElf.prototype, 'sectionHeaders', {
      get: function() {
        if (this._m_sectionHeaders !== undefined)
          return this._m_sectionHeaders;
        var _pos = this._io.pos;
        this._io.seek(this.sectionHeaderOffset);
        if (this._is_le) {
          this._raw__m_sectionHeaders = new Array(this.qtySectionHeader);
          this._m_sectionHeaders = new Array(this.qtySectionHeader);
          for (var i = 0; i < this.qtySectionHeader; i++) {
            this._raw__m_sectionHeaders[i] = this._io.readBytes(this.sectionHeaderEntrySize);
            var _io__raw__m_sectionHeaders = new KaitaiStream(this._raw__m_sectionHeaders[i]);
            this._m_sectionHeaders[i] = new SectionHeader(_io__raw__m_sectionHeaders, this, this._root, this._is_le);
          }
        } else {
          this._raw__m_sectionHeaders = new Array(this.qtySectionHeader);
          this._m_sectionHeaders = new Array(this.qtySectionHeader);
          for (var i = 0; i < this.qtySectionHeader; i++) {
            this._raw__m_sectionHeaders[i] = this._io.readBytes(this.sectionHeaderEntrySize);
            var _io__raw__m_sectionHeaders = new KaitaiStream(this._raw__m_sectionHeaders[i]);
            this._m_sectionHeaders[i] = new SectionHeader(_io__raw__m_sectionHeaders, this, this._root, this._is_le);
          }
        }
        this._io.seek(_pos);
        return this._m_sectionHeaders;
      }
    });
    Object.defineProperty(EndianElf.prototype, 'headerNameStrings', {
      get: function() {
        if (this._m_headerNameStrings !== undefined)
          return this._m_headerNameStrings;
        var _pos = this._io.pos;
        this._io.seek(this.sectionHeaders[this.sectionNamesIdx].offset);
        if (this._is_le) {
          this._raw__m_headerNameStrings = this._io.readBytes(this.sectionHeaders[this.sectionNamesIdx].size);
          var _io__raw__m_headerNameStrings = new KaitaiStream(this._raw__m_headerNameStrings);
          this._m_headerNameStrings = new StringsStruct(_io__raw__m_headerNameStrings, this, this._root, this._is_le);
        } else {
          this._raw__m_headerNameStrings = this._io.readBytes(this.sectionHeaders[this.sectionNamesIdx].size);
          var _io__raw__m_headerNameStrings = new KaitaiStream(this._raw__m_headerNameStrings);
          this._m_headerNameStrings = new StringsStruct(_io__raw__m_headerNameStrings, this, this._root, this._is_le);
        }
        this._io.seek(_pos);
        return this._m_headerNameStrings;
      }
    });

    return EndianElf;
  })();

  /**
   * File identification, must be 0x7f + "ELF".
   */

  /**
   * File class: designates target machine word size (32 or 64
   * bits). The size of many integer fields in this format will
   * depend on this setting.
   */

  /**
   * Endianness used for all integers.
   */

  /**
   * ELF header version.
   */

  /**
   * Specifies which OS- and ABI-related extensions will be used
   * in this ELF file.
   */

  /**
   * Version of ABI targeted by this ELF file. Interpretation
   * depends on `abi` attribute.
   */

  return Elf;
})();
return Elf;
}));
