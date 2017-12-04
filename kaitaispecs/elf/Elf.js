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

  Elf.Bits = Object.freeze({
    B32: 1,
    B64: 2,

    1: "B32",
    2: "B64",
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
      Object.defineProperty(SectionHeader.prototype, 'name', {
        get: function() {
          if (this._m_name !== undefined)
            return this._m_name;
          var io = this._root.header.strings._io;
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
    Object.defineProperty(EndianElf.prototype, 'strings', {
      get: function() {
        if (this._m_strings !== undefined)
          return this._m_strings;
        var _pos = this._io.pos;
        this._io.seek(this.sectionHeaders[this.sectionNamesIdx].offset);
        if (this._is_le) {
          this._raw__m_strings = this._io.readBytes(this.sectionHeaders[this.sectionNamesIdx].size);
          var _io__raw__m_strings = new KaitaiStream(this._raw__m_strings);
          this._m_strings = new StringsStruct(_io__raw__m_strings, this, this._root, this._is_le);
        } else {
          this._raw__m_strings = this._io.readBytes(this.sectionHeaders[this.sectionNamesIdx].size);
          var _io__raw__m_strings = new KaitaiStream(this._raw__m_strings);
          this._m_strings = new StringsStruct(_io__raw__m_strings, this, this._root, this._is_le);
        }
        this._io.seek(_pos);
        return this._m_strings;
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
