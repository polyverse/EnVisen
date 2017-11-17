# Binary Entropy Visualizer

Online x86 binary visualizer for comparing two binaries side-by-side and understanding the entropy between them.

# Get Started:
Visit the Github pages hosted version here: https://polyverse.github.io/binary-entropy-visualizer/#

Or clone this repo, and start index.html! This app is 100% in-browser,
so no makefiles, no builders, no package managers, no setup scripts, no platforms,
no frameworks, no dependencies, no nothing.

[Note] Occasionally your browser might not like loading scripts from the filesystem,
in which case host this directory behind a static webserver. Hacker-y folks might
be used to:
```
python -m SimpleHTTPServer
```

# Intended for offline use

This repo intentionally clones/copies every single JS dependency. This means that you can
run the index.html completely offline, internet-disconnected and do some cool analyzing.

It gives you some assurances for paranoid people:
* Run on a sandboxed/airgapped host to be assured there is no phone-home.
* Be aware of every dependency.
* Run in VMs easily without proxies and hosts and ports and NATs.
* xcopy deploy!

# Resources:
* jQuery to tie everything together! https://jquery.com/
* Elf expansion is provided by: https://github.com/kaitai-io and the Elf Javascript template: http://formats.kaitai.io/elf/javascript.html
* Disassemly provided by Capstone.js: https://github.com/AlexAltea/capstone.js
* ROP-analysis code ported from: https://github.com/JonathanSalwan/ROPgadget
* Clusterize for showing LARGE tables fast! https://clusterize.js.org/
* Slightly modified version of tinyprogressbar: https://github.com/knadh/tinyprogressbar
* jQuery block UI plug: http://malsup.com/jquery/block/#overview
* ROP JSON saving feature from: https://github.com/eligrey/FileSaver.js
* Blob.js for FileSaver: https://github.com/eligrey/Blob.js
* Read this for help on what all that ELF stuff means: http://www.cirosantilli.com/elf-hello-world/#section-vs-segment
