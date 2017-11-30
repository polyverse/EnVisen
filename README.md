⚠️ This tool may only be used for educational, teaching, learning,
understanding and research purposes only.

# Binary Entropy Visualizer

Completely self-contained binary ROP/JOP gadget analyzer for comparing two binaries
side-by-side and understanding their structures, in 100% pure Javascript, and a self-contained client-side browser application. Focussed on extreme simplicity of usage and portability across platforms.

# Get Started:
Visit the hosted version here: https://analyze.polyverse.io/

## Self hosting

Or clone this repo, and open index.html in your web-browser locally.

[Note] Occasionally your browser might not like loading scripts from the filesystem due to CORS,
in which case host this directory behind a static webserver. Hacker-y folks might
be used to:
```
python -m SimpleHTTPServer
```

# Code Walkthrough, API, and Programmatic use

See [detailed code walkthrough](/docs/code-walkthrough.md) page.

# Intended for extreme simplicity and isolated use

* Run on a sandboxed/airgapped host to be assured there is no phone-home.
* Requires no scripts/frameworks. Pure xcopy-deploy.

# Resources:
* jQuery to tie everything together! https://jquery.com/
* Elf, MachO and PE expansion is provided by: https://github.com/kaitai-io (some templates have been customized.)
* Disassemly provided by Capstone.js: https://github.com/AlexAltea/capstone.js
* ROP-analysis code ported from: https://github.com/JonathanSalwan/ROPgadget
* Clusterize for showing LARGE tables fast! https://clusterize.js.org/
* Slightly modified version of tinyprogressbar: https://github.com/knadh/tinyprogressbar
* jQuery block UI plug: http://malsup.com/jquery/block/#overview
* ROP JSON saving feature from: https://github.com/eligrey/FileSaver.js
* Blob.js for FileSaver: https://github.com/eligrey/Blob.js
* Read this for help on what all that ELF stuff means: http://www.cirosantilli.com/elf-hello-world/#section-vs-segment
