// Thank you Kaitai for this!! https://github.com/kaitai-io

// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild
// -*- mode: js; js-indent-level: 2; -*-
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.KaitaiStream = factory();
  }
}(this, function () {

/**
  KaitaiStream is an implementation of Kaitai Struct API for JavaScript.
  Based on DataStream - https://github.com/kig/DataStream.js

  @param {ArrayBuffer} arrayBuffer ArrayBuffer to read from.
  @param {?Number} byteOffset Offset from arrayBuffer beginning for the KaitaiStream.
  */
var KaitaiStream = function(arrayBuffer, byteOffset) {
  this._byteOffset = byteOffset || 0;
  if (arrayBuffer instanceof ArrayBuffer) {
    this.buffer = arrayBuffer;
  } else if (typeof arrayBuffer == "object") {
    this.dataView = arrayBuffer;
    if (byteOffset) {
      this._byteOffset += byteOffset;
    }
  } else {
    this.buffer = new ArrayBuffer(arrayBuffer || 1);
  }
  this.pos = 0;
  this.alignToByte();
};


KaitaiStream.prototype = {};

/**
  Dependency configuration data. Holds urls for (optional) dynamic loading
  of code dependencies from a remote server. For use by (static) processing functions.

  Caller should the supported keys to the asset urls as needed.
  NOTE: `depUrls` is a static property of KaitaiStream (the factory),like the various
        processing functions. It is NOT part of the prototype of instances.
  @type {Object}
  */
KaitaiStream.depUrls = {
  // processZlib uses this and expected a link to a copy of pako.
  // specifically the pako_inflate.min.js script at:
  // https://raw.githubusercontent.com/nodeca/pako/master/dist/pako_inflate.min.js
  zlib: undefined
};

/**
  Virtual byte length of the KaitaiStream backing buffer.
  Updated to be max of original buffer size and last written size.
  If dynamicSize is false is set to buffer size.
  @type {number}
  */
KaitaiStream.prototype._byteLength = 0;

/**
  Set/get the backing ArrayBuffer of the KaitaiStream object.
  The setter updates the DataView to point to the new buffer.
  @type {Object}
  */
Object.defineProperty(KaitaiStream.prototype, 'buffer',
  { get: function() {
      this._trimAlloc();
      return this._buffer;
    },
    set: function(v) {
      this._buffer = v;
      this._dataView = new DataView(this._buffer, this._byteOffset);
      this._byteLength = this._buffer.byteLength;
    } });

/**
  Set/get the byteOffset of the KaitaiStream object.
  The setter updates the DataView to point to the new byteOffset.
  @type {number}
  */
Object.defineProperty(KaitaiStream.prototype, 'byteOffset',
  { get: function() {
      return this._byteOffset;
    },
    set: function(v) {
      this._byteOffset = v;
      this._dataView = new DataView(this._buffer, this._byteOffset);
      this._byteLength = this._buffer.byteLength;
    } });

/**
  Set/get the backing DataView of the KaitaiStream object.
  The setter updates the buffer and byteOffset to point to the DataView values.
  @type {Object}
  */
Object.defineProperty(KaitaiStream.prototype, 'dataView',
  { get: function() {
      return this._dataView;
    },
    set: function(v) {
      this._byteOffset = v.byteOffset;
      this._buffer = v.buffer;
      this._dataView = new DataView(this._buffer, this._byteOffset);
      this._byteLength = this._byteOffset + v.byteLength;
    } });

/**
  Internal function to trim the KaitaiStream buffer when required.
  Used for stripping out the extra bytes from the backing buffer when
  the virtual byteLength is smaller than the buffer byteLength (happens after
  growing the buffer with writes and not filling the extra space completely).

  @return {null}
  */
KaitaiStream.prototype._trimAlloc = function() {
  if (this._byteLength == this._buffer.byteLength) {
    return;
  }
  var buf = new ArrayBuffer(this._byteLength);
  var dst = new Uint8Array(buf);
  var src = new Uint8Array(this._buffer, 0, dst.length);
  dst.set(src);
  this.buffer = buf;
};

// ========================================================================
// Stream positioning
// ========================================================================

/**
  Returns true if the KaitaiStream seek pointer is at the end of buffer and
  there's no more data to read.

  @return {boolean} True if the seek pointer is at the end of the buffer.
  */
KaitaiStream.prototype.isEof = function() {
  return (this.pos >= this.size);
};

/**
  Sets the KaitaiStream read/write position to given position.
  Clamps between 0 and KaitaiStream length.

  @param {number} pos Position to seek to.
  @return {null}
  */
KaitaiStream.prototype.seek = function(pos) {
  var npos = Math.max(0, Math.min(this.size, pos));
  this.pos = (isNaN(npos) || !isFinite(npos)) ? 0 : npos;
};

/**
  Returns the byte length of the KaitaiStream object.
  @type {number}
  */
Object.defineProperty(KaitaiStream.prototype, 'size',
  { get: function() {
    return this._byteLength - this._byteOffset;
  }});

// ========================================================================
// Integer numbers
// ========================================================================

// ------------------------------------------------------------------------
// Signed
// ------------------------------------------------------------------------

/**
  Reads an 8-bit signed int from the stream.
  @return {number} The read number.
 */
KaitaiStream.prototype.readS1 = function() {
  var v = this._dataView.getInt8(this.pos);
  this.pos += 1;
  return v;
};

// ........................................................................
// Big-endian
// ........................................................................

/**
  Reads a 16-bit big-endian signed int from the stream.
  @return {number} The read number.
 */
KaitaiStream.prototype.readS2be = function(e) {
  var v = this._dataView.getInt16(this.pos);
  this.pos += 2;
  return v;
};

/**
  Reads a 32-bit big-endian signed int from the stream.
  @return {number} The read number.
 */
KaitaiStream.prototype.readS4be = function(e) {
  var v = this._dataView.getInt32(this.pos);
  this.pos += 4;
  return v;
};

/**
  Reads a 64-bit big-endian unsigned int from the stream. Note that
  JavaScript does not support 64-bit integers natively, so it will
  automatically upgrade internal representation to use IEEE 754
  double precision float.
  @return {number} The read number.
 */
KaitaiStream.prototype.readS8be = function(e) {
  var v1 = this.readU4be();
  var v2 = this.readU4be();

  if (v1 & 0x80000000 != 0) {
    // negative number
    return -(0x100000000 * (v1 ^ 0xffffffff) + (v2 ^ 0xffffffff)) - 1;
  } else {
    return 0x100000000 * v1 + v2;
  }
};

// ........................................................................
// Little-endian
// ........................................................................

/**
  Reads a 16-bit little-endian signed int from the stream.
  @return {number} The read number.
 */
KaitaiStream.prototype.readS2le = function(e) {
  var v = this._dataView.getInt16(this.pos, 1);
  this.pos += 2;
  return v;
};

/**
  Reads a 32-bit little-endian signed int from the stream.
  @return {number} The read number.
 */
KaitaiStream.prototype.readS4le = function(e) {
  var v = this._dataView.getInt32(this.pos, 1);
  this.pos += 4;
  return v;
};

/**
  Reads a 64-bit little-endian unsigned int from the stream. Note that
  JavaScript does not support 64-bit integers natively, so it will
  automatically upgrade internal representation to use IEEE 754
  double precision float.
  @return {number} The read number.
 */
KaitaiStream.prototype.readS8le = function(e) {
  var v1 = this.readU4le();
  var v2 = this.readU4le();

  if (v2 & 0x80000000 != 0) {
    // negative number
    return -(0x100000000 * (v2 ^ 0xffffffff) + (v1 ^ 0xffffffff)) - 1;
  } else {
    return 0x100000000 * v2 + v1;
  }
};

// ------------------------------------------------------------------------
// Unsigned
// ------------------------------------------------------------------------

/**
  Reads an 8-bit unsigned int from the stream.
  @return {number} The read number.
 */
KaitaiStream.prototype.readU1 = function() {
  var v = this._dataView.getUint8(this.pos);
  this.pos += 1;
  return v;
};

// ........................................................................
// Big-endian
// ........................................................................

/**
  Reads a 16-bit big-endian unsigned int from the stream.
  @return {number} The read number.
 */
KaitaiStream.prototype.readU2be = function(e) {
  var v = this._dataView.getUint16(this.pos);
  this.pos += 2;
  return v;
};

/**
  Reads a 32-bit big-endian unsigned int from the stream.
  @return {number} The read number.
 */
KaitaiStream.prototype.readU4be = function(e) {
  var v = this._dataView.getUint32(this.pos);
  this.pos += 4;
  return v;
};

/**
  Reads a 64-bit big-endian unsigned int from the stream. Note that
  JavaScript does not support 64-bit integers natively, so it will
  automatically upgrade internal representation to use IEEE 754
  double precision float.
  @return {number} The read number.
 */
KaitaiStream.prototype.readU8be = function(e) {
  var v1 = this.readU4be();
  var v2 = this.readU4be();
  return 0x100000000 * v1 + v2;
};

// ........................................................................
// Little-endian
// ........................................................................

/**
  Reads a 16-bit little-endian unsigned int from the stream.
  @return {number} The read number.
 */
KaitaiStream.prototype.readU2le = function(e) {
  var v = this._dataView.getUint16(this.pos, 1);
  this.pos += 2;
  return v;
};

/**
  Reads a 32-bit little-endian unsigned int from the stream.
  @return {number} The read number.
 */
KaitaiStream.prototype.readU4le = function(e) {
  var v = this._dataView.getUint32(this.pos, 1);
  this.pos += 4;
  return v;
};

/**
  Reads a 64-bit little-endian unsigned int from the stream. Note that
  JavaScript does not support 64-bit integers natively, so it will
  automatically upgrade internal representation to use IEEE 754
  double precision float.
  @return {number} The read number.
 */
KaitaiStream.prototype.readU8le = function(e) {
  var v1 = this.readU4le();
  var v2 = this.readU4le();
  return 0x100000000 * v2 + v1;
};

// ========================================================================
// Floating point numbers
// ========================================================================

// ------------------------------------------------------------------------
// Big endian
// ------------------------------------------------------------------------

KaitaiStream.prototype.readF4be = function(e) {
  var v = this._dataView.getFloat32(this.pos);
  this.pos += 4;
  return v;
};

KaitaiStream.prototype.readF8be = function(e) {
  var v = this._dataView.getFloat64(this.pos);
  this.pos += 8;
  return v;
};

// ------------------------------------------------------------------------
// Little endian
// ------------------------------------------------------------------------

KaitaiStream.prototype.readF4le = function(e) {
  var v = this._dataView.getFloat32(this.pos, 1);
  this.pos += 4;
  return v;
};

KaitaiStream.prototype.readF8le = function(e) {
  var v = this._dataView.getFloat64(this.pos, 1);
  this.pos += 8;
  return v;
};

// ------------------------------------------------------------------------
// Unaligned bit values
// ------------------------------------------------------------------------

KaitaiStream.prototype.alignToByte = function() {
  this.bits = 0;
  this.bitsLeft = 0;
}

KaitaiStream.prototype.readBitsInt = function(n) {
  // JS only supports bit operations on 32 bits
  if (n > 32)
    throw new Error(`readBitsInt: the maximum supported bit length is 32 (tried to read ${n} bits)`);

  var bitsNeeded = n - this.bitsLeft;
  if (bitsNeeded > 0) {
    // 1 bit  => 1 byte
    // 8 bits => 1 byte
    // 9 bits => 2 bytes
    var bytesNeeded = Math.ceil(bitsNeeded / 8);
    var buf = this.readBytes(bytesNeeded);
    for (var i = 0; i < buf.length; i++) {
      this.bits <<= 8;
      this.bits |= buf[i];
      this.bitsLeft += 8;
    }
  }

  // raw mask with required number of 1s, starting from lowest bit
  var mask = n == 32 ? 0xffffffff : (1 << n) - 1;
  // shift mask to align with highest bits available in this.bits
  var shiftBits = this.bitsLeft - n;
  mask <<= shiftBits;
  // derive reading result
  var res = (this.bits & mask) >>> shiftBits;
  // clear top bits that we've just read => AND with 1s
  this.bitsLeft -= n;
  mask = (1 << this.bitsLeft) - 1;
  this.bits &= mask;

  return res;
}

/**
  Native endianness. Either KaitaiStream.BIG_ENDIAN or KaitaiStream.LITTLE_ENDIAN
  depending on the platform endianness.

  @type {boolean}
 */
KaitaiStream.endianness = new Int8Array(new Int16Array([1]).buffer)[0] > 0;

// ========================================================================
// Byte arrays
// ========================================================================

KaitaiStream.prototype.readBytes = function(len) {
  return this.mapUint8Array(len);
}

KaitaiStream.prototype.readBytesFull = function() {
  return this.mapUint8Array(this.size - this.pos);
}

KaitaiStream.prototype.readBytesTerm = function(terminator, include, consume, eosError) {
  var blen = this.size - this.pos;
  var u8 = new Uint8Array(this._buffer, this._byteOffset + this.pos);
  for (var i = 0; i < blen && u8[i] != terminator; i++); // find first zero byte
  if (i == blen) {
    // we've read all the buffer and haven't found the terminator
    if (eosError) {
      throw "End of stream reached, but no terminator " + term + " found";
    } else {
      return this.mapUint8Array(i);
    }
  } else {
    var arr;
    if (include) {
      arr = this.mapUint8Array(i + 1);
    } else {
      arr = this.mapUint8Array(i);
    }
    if (consume) {
      this.pos += 1;
    }
    return arr;
  }
}

KaitaiStream.prototype.ensureFixedContents = function(expected) {
  var actual = this.readBytes(expected.length);
  if (actual.length !== expected.length) {
    throw new UnexpectedDataError(expected, actual);
  }
  var actLen = actual.length;
  for (var i = 0; i < actLen; i++) {
    if (actual[i] != expected[i]) {
      throw new UnexpectedDataError(expected, actual);
    }
  }
  return actual;
}

KaitaiStream.bytesStripRight = function(data, padByte) {
  var newLen = data.length;
  while (data[newLen - 1] == padByte)
    newLen--;
  return data.slice(0, newLen);
}

KaitaiStream.bytesTerminate = function(data, term, include) {
  var newLen = 0;
  var maxLen = data.length;
  while (newLen < maxLen && data[newLen] != term)
    newLen++;
  if (include && newLen < maxLen)
    newLen++;
  return data.slice(0, newLen);
}

KaitaiStream.bytesToStr = function(arr, encoding) {
  if (encoding == null || encoding == "ASCII") {
    return KaitaiStream.createStringFromArray(arr);
  } else {
    if (typeof TextDecoder === 'function') {
      // we're in the browser that supports TextDecoder
      return (new TextDecoder(encoding)).decode(arr);
    } else {
      // probably we're in node.js

      // check if it's supported natively by node.js Buffer
      // see https://github.com/nodejs/node/blob/master/lib/buffer.js#L187 for details
      switch (encoding.toLowerCase()) {
        case 'utf8':
        case 'utf-8':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return new Buffer(arr).toString(encoding);
          break;
        default:
          // unsupported encoding, we'll have to resort to iconv-lite
          if (typeof KaitaiStream.iconvlite === 'undefined')
            KaitaiStream.iconvlite = require('iconv-lite');

          return KaitaiStream.iconvlite.decode(arr, encoding);
      }
    }
  }
}

// ========================================================================
// Byte array processing
// ========================================================================

KaitaiStream.processXorOne = function(data, key) {
  var r = new Uint8Array(data.length);
  var dl = data.length;
  for (var i = 0; i < dl; i++)
    r[i] = data[i] ^ key;
  return r;
}

KaitaiStream.processXorMany = function(data, key) {
  var r = new Uint8Array(data.length);
  var dl = data.length;
  var kl = key.length;
  var ki = 0;
  for (var i = 0; i < data.length; i++) {
    r[i] = data[i] ^ key[ki];
    ki++;
    if (ki >= kl)
      ki = 0;
  }
  return r;
}

KaitaiStream.processRotateLeft = function(data, amount, groupSize) {
  if (groupSize != 1)
    throw("unable to rotate group of " + groupSize + " bytes yet");

  var mask = groupSize * 8 - 1;
  var antiAmount = -amount & mask;

  var r = new Uint8Array(data.length);
  for (var i = 0; i < data.length; i++)
    r[i] = (data[i] << amount) & 0xff | (data[i] >> antiAmount);

  return r;
}

KaitaiStream.processZlib = function(buf) {
  if (typeof require !== 'undefined')  {
    // require is available - we're running under node
    if (typeof KaitaiStream.zlib === 'undefined')
      KaitaiStream.zlib = require('zlib');
    if (buf instanceof Uint8Array) {
      var b = new Buffer(buf.buffer);
    } else {
      var b = buf;
    }
    // use node's zlib module API
    var r = KaitaiStream.zlib.inflateSync(b);
    return r;
  } else {
    // no require() - assume we're running as a web worker in browser.
    // user should have configured KaitaiStream.depUrls.zlib, if not
    // we'll throw.
    if (typeof KaitaiStream.zlib === 'undefined'
      && typeof KaitaiStream.depUrls.zlib !== 'undefined') {
      importScripts(KaitaiStream.depUrls.zlib);
      KaitaiStream.zlib = pako;
    }
    // use pako API
    r = KaitaiStream.zlib.inflate(buf);
    return r;
  }
}

// ========================================================================
// Misc runtime operations
// ========================================================================

KaitaiStream.mod = function(a, b) {
  if (b <= 0)
    throw "mod divisor <= 0";
  var r = a % b;
  if (r < 0)
    r += b;
  return r;
}

KaitaiStream.arrayMin = function(arr) {
  var min = arr[0];
  var x;
  for (var i = 1, n = arr.length; i < n; ++i) {
    x = arr[i];
    if (x < min) min = x;
  }
  return min;
}

KaitaiStream.arrayMax = function(arr) {
  var max = arr[0];
  var x;
  for (var i = 1, n = arr.length; i < n; ++i) {
    x = arr[i];
    if (x > max) max = x;
  }
  return max;
}

KaitaiStream.byteArrayCompare = function(a, b) {
  if (a === b)
    return 0;
  var al = a.length;
  var bl = b.length;
  var minLen = al < bl ? al : bl;
  for (var i = 0; i < minLen; i++) {
    var cmp = a[i] - b[i];
    if (cmp != 0)
      return cmp;
  }

  // Reached the end of at least one of the arrays
  if (al == bl) {
    return 0;
  } else {
    return al - bl;
  }
}

// ========================================================================
// Internal implementation details
// ========================================================================

var EOFError = KaitaiStream.EOFError = function(bytesReq, bytesAvail) {
  this.name = "EOFError";
  this.message = "requested " + bytesReq + " bytes, but only " + bytesAvail + " bytes available";
  this.bytesReq = bytesReq;
  this.bytesAvail = bytesAvail;
  this.stack = (new Error()).stack;
}

EOFError.prototype = Object.create(Error.prototype);
EOFError.prototype.constructor = EOFError;

var UnexpectedDataError = KaitaiStream.UnexpectedDataError = function(expected, actual) {
  this.name = "UnexpectedDataError";
  this.message = "expected [" + expected + "], but got [" + actual + "]";
  this.expected = expected;
  this.actual = actual;
  this.stack = (new Error()).stack;
}

UnexpectedDataError.prototype = Object.create(Error.prototype);
UnexpectedDataError.prototype.constructor = UnexpectedDataError;

var UndecidedEndiannessError = KaitaiStream.UndecidedEndiannessError = function() {
  this.name = "UndecidedEndiannessError";
  this.stack = (new Error()).stack;
}

UndecidedEndiannessError.prototype = Object.create(Error.prototype);
UndecidedEndiannessError.prototype.constructor = UndecidedEndiannessError;

/**
  Maps a Uint8Array into the KaitaiStream buffer.

  Nice for quickly reading in data.

  @param {number} length Number of elements to map.
  @return {Object} Uint8Array to the KaitaiStream backing buffer.
  */
KaitaiStream.prototype.mapUint8Array = function(length) {
  length |= 0;

  if (this.pos + length > this.size) {
    throw new EOFError(length, this.size - this.pos);
  }

  var arr = new Uint8Array(this._buffer, this.byteOffset + this.pos, length);
  this.pos += length;
  return arr;
};

/**
  Creates an array from an array of character codes.
  Uses String.fromCharCode in chunks for memory efficiency and then concatenates
  the resulting string chunks.

  @param {array} array Array of character codes.
  @return {string} String created from the character codes.
**/
KaitaiStream.createStringFromArray = function(array) {
  var chunk_size = 0x8000;
  var chunks = [];
  for (var i=0; i < array.length; i += chunk_size) {
    chunks.push(String.fromCharCode.apply(null, array.subarray(i, i + chunk_size)));
  }
  return chunks.join("");
};

return KaitaiStream;

}));


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
