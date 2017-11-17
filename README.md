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

# Resources:
1. Elf expansion is provided by: https://github.com/kaitai-io and the Elf Javascript template: http://formats.kaitai.io/elf/javascript.html
2. Disassemly provided by Capstone.js: https://github.com/AlexAltea/capstone.js
3. ROP-analysis code ported from: https://github.com/JonathanSalwan/ROPgadget
4. Read this for help on what all that ELF stuff means: http://www.cirosantilli.com/elf-hello-world/#section-vs-segment
