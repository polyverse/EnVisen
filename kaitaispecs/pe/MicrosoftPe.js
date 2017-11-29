// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

/**
 * @see {@link http://www.microsoft.com/whdc/system/platform/firmware/PECOFF.mspx|Source}
 */

var MicrosoftPe = (function() {
  MicrosoftPe.PeFormat = Object.freeze({
    ROM_IMAGE: 263,
    PE32: 267,
    PE32_PLUS: 523,

    263: "ROM_IMAGE",
    267: "PE32",
    523: "PE32_PLUS",
  });

  function MicrosoftPe(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this.mz1 = new MzPlaceholder(this._io, this, this._root);
    this.mz2 = this._io.readBytes((this.mz1.headerSize - 64));
    this.peSignature = this._io.ensureFixedContents([80, 69, 0, 0]);
    this.coffHdr = new CoffHeader(this._io, this, this._root);
    this._raw_optionalHdr = this._io.readBytes(this.coffHdr.sizeOfOptionalHeader);
    var _io__raw_optionalHdr = new KaitaiStream(this._raw_optionalHdr);
    this.optionalHdr = new OptionalHeader(_io__raw_optionalHdr, this, this._root);
    this.sections = new Array(this.coffHdr.numberOfSections);
    for (var i = 0; i < this.coffHdr.numberOfSections; i++) {
      this.sections[i] = new Section(this._io, this, this._root);
    }
  }

  var OptionalHeaderWindows = MicrosoftPe.OptionalHeaderWindows = (function() {
    OptionalHeaderWindows.SubsystemEnum = Object.freeze({
      UNKNOWN: 0,
      NATIVE: 1,
      WINDOWS_GUI: 2,
      WINDOWS_CUI: 3,
      POSIX_CUI: 7,
      WINDOWS_CE_GUI: 9,
      EFI_APPLICATION: 10,
      EFI_BOOT_SERVICE_DRIVER: 11,
      EFI_RUNTIME_DRIVER: 12,
      EFI_ROM: 13,
      XBOX: 14,

      0: "UNKNOWN",
      1: "NATIVE",
      2: "WINDOWS_GUI",
      3: "WINDOWS_CUI",
      7: "POSIX_CUI",
      9: "WINDOWS_CE_GUI",
      10: "EFI_APPLICATION",
      11: "EFI_BOOT_SERVICE_DRIVER",
      12: "EFI_RUNTIME_DRIVER",
      13: "EFI_ROM",
      14: "XBOX",
    });

    function OptionalHeaderWindows(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      if (this._parent.std.format == MicrosoftPe.PeFormat.PE32) {
        this.imageBase32 = this._io.readU4le();
      }
      if (this._parent.std.format == MicrosoftPe.PeFormat.PE32_PLUS) {
        this.imageBase64 = this._io.readU8le();
      }
      this.sectionAlignment = this._io.readU4le();
      this.fileAlignment = this._io.readU4le();
      this.majorOperatingSystemVersion = this._io.readU2le();
      this.minorOperatingSystemVersion = this._io.readU2le();
      this.majorImageVersion = this._io.readU2le();
      this.minorImageVersion = this._io.readU2le();
      this.majorSubsystemVersion = this._io.readU2le();
      this.minorSubsystemVersion = this._io.readU2le();
      this.win32VersionValue = this._io.readU4le();
      this.sizeOfImage = this._io.readU4le();
      this.sizeOfHeaders = this._io.readU4le();
      this.checkSum = this._io.readU4le();
      this.subsystem = this._io.readU2le();
      this.dllCharacteristics = this._io.readU2le();
      if (this._parent.std.format == MicrosoftPe.PeFormat.PE32) {
        this.sizeOfStackReserve32 = this._io.readU4le();
      }
      if (this._parent.std.format == MicrosoftPe.PeFormat.PE32_PLUS) {
        this.sizeOfStackReserve64 = this._io.readU8le();
      }
      if (this._parent.std.format == MicrosoftPe.PeFormat.PE32) {
        this.sizeOfStackCommit32 = this._io.readU4le();
      }
      if (this._parent.std.format == MicrosoftPe.PeFormat.PE32_PLUS) {
        this.sizeOfStackCommit64 = this._io.readU8le();
      }
      if (this._parent.std.format == MicrosoftPe.PeFormat.PE32) {
        this.sizeOfHeapReserve32 = this._io.readU4le();
      }
      if (this._parent.std.format == MicrosoftPe.PeFormat.PE32_PLUS) {
        this.sizeOfHeapReserve64 = this._io.readU8le();
      }
      if (this._parent.std.format == MicrosoftPe.PeFormat.PE32) {
        this.sizeOfHeapCommit32 = this._io.readU4le();
      }
      if (this._parent.std.format == MicrosoftPe.PeFormat.PE32_PLUS) {
        this.sizeOfHeapCommit64 = this._io.readU8le();
      }
      this.loaderFlags = this._io.readU4le();
      this.numberOfRvaAndSizes = this._io.readU4le();
    }

    return OptionalHeaderWindows;
  })();

  var OptionalHeaderDataDirs = MicrosoftPe.OptionalHeaderDataDirs = (function() {
    function OptionalHeaderDataDirs(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.exportTable = new DataDir(this._io, this, this._root);
      this.importTable = new DataDir(this._io, this, this._root);
      this.resourceTable = new DataDir(this._io, this, this._root);
      this.exceptionTable = new DataDir(this._io, this, this._root);
      this.certificateTable = new DataDir(this._io, this, this._root);
      this.baseRelocationTable = new DataDir(this._io, this, this._root);
      this.debug = new DataDir(this._io, this, this._root);
      this.architecture = new DataDir(this._io, this, this._root);
      this.globalPtr = new DataDir(this._io, this, this._root);
      this.tlsTable = new DataDir(this._io, this, this._root);
      this.loadConfigTable = new DataDir(this._io, this, this._root);
      this.boundImport = new DataDir(this._io, this, this._root);
      this.iat = new DataDir(this._io, this, this._root);
      this.delayImportDescriptor = new DataDir(this._io, this, this._root);
      this.clrRuntimeHeader = new DataDir(this._io, this, this._root);
    }

    return OptionalHeaderDataDirs;
  })();

  var DataDir = MicrosoftPe.DataDir = (function() {
    function DataDir(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.virtualAddress = this._io.readU4le();
      this.size = this._io.readU4le();
    }

    return DataDir;
  })();

  var OptionalHeader = MicrosoftPe.OptionalHeader = (function() {
    function OptionalHeader(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.std = new OptionalHeaderStd(this._io, this, this._root);
      this.windows = new OptionalHeaderWindows(this._io, this, this._root);
      this.dataDirs = new OptionalHeaderDataDirs(this._io, this, this._root);
    }

    return OptionalHeader;
  })();

  var Section = MicrosoftPe.Section = (function() {
    function Section(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.name = KaitaiStream.bytesToStr(KaitaiStream.bytesStripRight(this._io.readBytes(8), 0), "UTF-8");
      this.virtualSize = this._io.readU4le();
      this.virtualAddress = this._io.readU4le();
      this.sizeOfRawData = this._io.readU4le();
      this.pointerToRawData = this._io.readU4le();
      this.pointerToRelocations = this._io.readU4le();
      this.pointerToLinenumbers = this._io.readU4le();
      this.numberOfRelocations = this._io.readU2le();
      this.numberOfLinenumbers = this._io.readU2le();
      this.characteristics = this._io.readU4le();
    }
    Object.defineProperty(Section.prototype, 'body', {
      get: function() {
        if (this._m_body !== undefined)
          return this._m_body;
        var _pos = this._io.pos;
        this._io.seek(this.pointerToRawData);
        this._m_body = this._io.readBytes(this.sizeOfRawData);
        this._io.seek(_pos);
        return this._m_body;
      }
    });

    return Section;
  })();

  var MzPlaceholder = MicrosoftPe.MzPlaceholder = (function() {
    function MzPlaceholder(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.magic = this._io.ensureFixedContents([77, 90]);
      this.data1 = this._io.readBytes(58);
      this.headerSize = this._io.readU4le();
    }

    return MzPlaceholder;
  })();

  var OptionalHeaderStd = MicrosoftPe.OptionalHeaderStd = (function() {
    function OptionalHeaderStd(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.format = this._io.readU2le();
      this.majorLinkerVersion = this._io.readU1();
      this.minorLinkerVersion = this._io.readU1();
      this.sizeOfCode = this._io.readU4le();
      this.sizeOfInitializedData = this._io.readU4le();
      this.sizeOfUninitializedData = this._io.readU4le();
      this.addressOfEntryPoint = this._io.readU4le();
      this.baseOfCode = this._io.readU4le();
      if (this.format == MicrosoftPe.PeFormat.PE32) {
        this.baseOfData = this._io.readU4le();
      }
    }

    return OptionalHeaderStd;
  })();

  /**
   * @see 3.3. COFF File Header (Object and Image)
   */

  var CoffHeader = MicrosoftPe.CoffHeader = (function() {
    CoffHeader.MachineType = Object.freeze({
      UNKNOWN: 0,
      I386: 332,
      R4000: 358,
      WCEMIPSV2: 361,
      SH3: 418,
      SH3DSP: 419,
      SH4: 422,
      SH5: 424,
      ARM: 448,
      THUMB: 450,
      ARMNT: 452,
      AM33: 467,
      POWERPC: 496,
      POWERPCFP: 497,
      IA64: 512,
      MIPS16: 614,
      MIPSFPU: 870,
      MIPSFPU16: 1126,
      EBC: 3772,
      RISCV32: 20530,
      RISCV64: 20580,
      RISCV128: 20776,
      AMD64: 34404,
      M32R: 36929,

      0: "UNKNOWN",
      332: "I386",
      358: "R4000",
      361: "WCEMIPSV2",
      418: "SH3",
      419: "SH3DSP",
      422: "SH4",
      424: "SH5",
      448: "ARM",
      450: "THUMB",
      452: "ARMNT",
      467: "AM33",
      496: "POWERPC",
      497: "POWERPCFP",
      512: "IA64",
      614: "MIPS16",
      870: "MIPSFPU",
      1126: "MIPSFPU16",
      3772: "EBC",
      20530: "RISCV32",
      20580: "RISCV64",
      20776: "RISCV128",
      34404: "AMD64",
      36929: "M32R",
    });

    CoffHeader.Characteristics = Object.freeze({
      NO_RELOCATIONS: 1,
      EXECUTABLE_IMAGE: 2,
      DYNAMIC_LINK_LIBRARY: 8192,

      1: "NO_RELOCATIONS",
      2: "EXECUTABLE_IMAGE",
      8192: "DYNAMIC_LINK_LIBRARY",
    });

    function CoffHeader(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this.machine = this._io.readU2le();
      this.numberOfSections = this._io.readU2le();
      this.timeDateStamp = this._io.readU4le();
      this.pointerToSymbolTable = this._io.readU4le();
      this.numberOfSymbols = this._io.readU4le();
      this.sizeOfOptionalHeader = this._io.readU2le();
      this.characteristics = this._io.readU2le();
    }

    return CoffHeader;
  })();

  return MicrosoftPe;
})();

// Export for amd environments
if (typeof define === 'function' && define.amd) {
  define('MicrosoftPe', [], function() {
    return MicrosoftPe;
  });
}

// Export for CommonJS
if (typeof module === 'object' && module && module.exports) {
  module.exports = MicrosoftPe;
}
