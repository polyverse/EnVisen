# EnVisen User Guide

## Introduction to EnVisen capabilities

EnVisen (Short for *En*tropy *Vis*ualizer), is a tool for binary extraction, ROP/JOP analysis, 
and symbol parsing. It does what a few distinct tools do today, and not all of them are available on
all platforms. EnVisen supports Elf (Linux, BSD, Solaris, etc.), MachO (Mach kernel, MacOS X, etc.), 
Portable Executable (Windows), and RAW (Kernels, ROMs) binary formats for nearly all major architectures.

EnVisen is easy to install, and trivial to run, being purely client-side in-browser with zero external 
dependencies, and works with full fidelity completely offline.

## Ready to Use

We host EnVisen at https://analyze.polyverse.io. This document will use that version as the 
basis for all guidance and screenshots.

## Getting Started: Dissecting a File

The best way to get started with EnVisen is to dump a file on it. You should see a File Chooser, 
as well as a drop area where you may drag-drop a file from your local machine.

