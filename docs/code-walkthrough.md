# Code walkthrough

## What to expect

All code is pure 100% javascript. There is no transpiler, helper,
renderer. The code works without any "require"s, or modules or whatever.

This was a fundamental premise behind the tool. You can copy this code
straight into a clean interpreter like Node, or Java's build-in interpreter
Nashhorn, and so on. You don't have to instrument modules, and support
finding, linking, etc.

Furthermore, key components such as the gadget finding code, are split
into "Web Workers" with clean memory separation, thereby allowing us
to guarantee their interfaces, and ensure without a doubt, that
there was no accidental leakage without explicitly specifying it.

This allows them to be deployed completely independently in other use-cases,
such as command-line tools, libraries, etc.

## Layout of files

At the root directory of this repo, is index.html, which pulls in every single
script and CSS file under internalcss, externalcss, internaljs and externaljs.

This is done for simplicity of understanding, as the tool is not intended
to be a responsive web-app. It is intended to be functional once loaded.

There is no redirection, indirection or routing performed. This is a
100% pure statically served website and the app is entirely single-page.

## Control flow

### Rendering the UI
* When index.html is loaded, in the document.load event in loader.js,
all &lt;div&gt; elements are searched having a class if `binaryVisualizer`.

* Each of these elements is then filled up programmatically with the file upload
dialog, and much more.

* Each of these elements gets an index - a monotoically increasing integer
  in the order that they are found by jQuery.

* All binaryVisualizer's except the lowest index, are blocked using
  the jQuery blockUI plugin. Once a visualizer is completed loading a file,
  the next index, if one is preset, is unblocked. This enables you to
  create nearly an infinite amount of comparators.

### File upload processing

This section is heavily coupled to the UI, although easily separable.

* When a file is loaded, we first check whether it's a JSON-array of gadgets. If
  so, the control flow jumps to the "ROP Table rendering" section below.

* Else, the file is attempted to be parsed as an ELF binary, failing that, a
  Portable Executable binary, failing that, a MachO binary, and failing that,
  a RAW binary.

* Each binary-type's parsing function is contained in files called
  "analyze_&lt;type&gt;.js". For example, "analyze_elf.js", "analyze_pe.js",
  and so on...

* Each analyzer opens up the binary, displays some interesting info about it
  inside an HTML wrapper element given to it during the call. It may render
  anything it wants, but we suggest it be wrapped in a collapser.

* Each analyzer must also fill in any options in the options struct,
  whose value is "auto detect". These options include architecture (such as
  x86, or arm64, etc.), bit length (32-bit or 64-bit interpretation), and
  endian-ness (little or big endian.) This detection function is easily used as
  a library function (it is a pure function - side-effect-free).
  * The RAW analyzer is an exception. You must not provide "auto detect" as
    an option

* Each analyzer then extracts the "sections" out of the binary where
  ROP gadgets are to be found. For RAW files, the entire file is a section,
  for PE files these are called "sections", for MachO files, they are sections
  within SEGMENTs, and for ELF files they are any sections which are executable.

* More on section formatting below.

### Gadget Detection

The gadget detection code is contained in the file gadget.js. It was lifted
wholesale from https://github.com/JonathanSalwan/ROPgadget/blob/master/ropgadget/gadgets.py
and falls under the original license, and I have tried to attribute the author
wherever possible.

The gadget detection runs through gadget_analyses.js after the file upload processing,
if the file was not a JSON file.

Gadget.js runs as a Web Worker process in the browser, thereby not blocking
the event loop. This also ensures Gadget.js is a very cleanly separated
library function, which you can use in any Javascript context - a console,
node, or built-in interpretors in languages like Java or C.

It needs some work to de-couple the Web Worker APIs like onmessage handler
and the liberal postMessage calls embedded all over.

The gadget.js onmessage handler requires four things:
1. An array of sections of the form:
```
const section = {
  offset: 0, //offset of the entire section
  size: bodyContents.length, //length of the section in bytes
  vaddr: ph.vaddr, //virtual address of section start
  opcodes: bodyContents, // Uint8Array of bytes containing machine code.
};

const sections = [section];
```

2. Architecture: x86/arm/arm64, etc.

3. Bit length: 32/64

4. Endian-ness: little/big.

5. Optionally if arm instructions are to be interpreted in THUMB mode, then
   a flag "thumb" that must be true.

The combined structure is assembled thus:
```
{
  sections: sections,
  arch: options.arch,
  bits: options.bits,
  endian: options.endian,
  thumb: options.thumb
}
```

Gadget detection posts back a list of gadgets when complete. Each gadget is of
the form:

```
{
  vaddr: "0xaddress",
  gadget: "gadget contents - usually assembly code"
}
```

### ROP Table rendering

Whether gadgets came from gadget-finding Web Worker, or a JSON file, this
code renders the gadgets into a large HTML table, that is kept manageable
using Clusterize.js: https://clusterize.js.org/

Rendering a ton of HTML rows is expensive, and performed in another
web worker that posts back periodically groups of rows. The group-size
is set in render_gadget_table.js

This table is then displayed.

#### Gadget Survival/Movement calculation
This web worker also performs another crucial function - tagging rows
of gadgets that survived and moved, using a css class.

To enable this, you provide it with an additional struct called
gadgetsHash, of the form:

```
{
  "gadget 1 contents": [addr1, addr2, ...],
  "gadget 2 contents": [addr1, addr2, ...],
}
```

This hash table maps each gadget to all the addresses it was found in previously.
If you don't provide one, no row tagging is performed.

At the end of this Web Worker, a new gadgets hash is also posted back
containing the structure for the gadgets that were just rendered, making it
usable in the next downstream rendering.

This is why on the main UI, the first table displays no comparisons, while the
second one does. The gadgets hash is managed and maintained by gadget_analysis.js.

### Gadget finding, address finding and chain execution

These are quite trivial to understand. They just go through all the rows in the table,
and look for data-* elements to match against.
