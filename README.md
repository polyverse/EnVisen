⚠️ This tool may only be used for educational, teaching, learning,
understanding and research purposes only.

# Binary Entropy Visualizer

Completely self-contained binary ROP/JOP gadget analyzer for comparing two binaries
side-by-side and understanding their structures, in 100% pure Javascript, and a
self-contained client-side browser application. Focussed on extreme simplicity
of usage and portability across platforms.

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

# Understanding the licenses

All code contributed directly to this project, any surrounding glue-logic,
and original code is licensed under the Apache 2.0 license. It is a fairly
permissive license.

However, there is a LOT of code that is either borrowed or adapted from third
party open source projects, and those modules, any changes to those modules,
or copies/forks of those modules, continue to stay under their original
licenses.

For example,
* gadget.js is nearly a direct adaptation of
https://github.com/JonathanSalwan/ROPgadget/blob/master/ropgadget/gadgets.py,
thus making it a BSD 3-Clause license: https://github.com/JonathanSalwan/ROPgadget/blob/master/LICENSE_BSD.txt.
* JQuery continues to be MIT-licensed: https://jquery.org/license/

And so on and so forth...

If GPL code is incorporated in modules, then those modules may be considered
under the respective GPL license.

We want to emphasize that the practical and functional intent of this tool is
to take the best of what is out there and provide a useful combination that solves
a real problem, encourages study, modification, changes and distribution of the
tool. If you have concerns around your particular license or code, or if
we have failed to attribute your contributions, simply file an issue, and
we will fix it right away.

# Intended for extreme isolation, security, and simplicity

* Run on a sandboxed/airgapped host to be assured there is no phone-home.
* Requires no scripts/frameworks. Pure xcopy-deploy, and a modern web browser.
* No behind-the-scenes binaries, code-pulls, platform dependencies, etc.
  to worry about. Zero-contamination usage.

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
