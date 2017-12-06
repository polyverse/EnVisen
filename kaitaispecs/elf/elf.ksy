meta:
  id: elf
  title: Executable and Linkable Format
  application: SVR4 ABI and up, many *nix systems
  license: CC0-1.0
  ks-version: 0.8
seq:
  # e_ident[EI_MAG0]..e[EI_MAG3]
  - id: magic
    size: 4
    contents: [0x7f, "ELF"]
    doc: File identification, must be 0x7f + "ELF".
  # e_ident[EI_CLASS]
  - id: bits
    type: u1
    enum: bits
    doc: |
      File class: designates target machine word size (32 or 64
      bits). The size of many integer fields in this format will
      depend on this setting.
  # e_ident[EI_DATA]
  - id: endian
    type: u1
    enum: endian
    doc: Endianness used for all integers.
  # e_ident[EI_VERSION]
  - id: ei_version
    type: u1
    doc: ELF header version.
  # e_ident[EI_OSABI]
  - id: abi
    type: u1
    enum: os_abi
    doc: |
      Specifies which OS- and ABI-related extensions will be used
      in this ELF file.
  - id: abi_version
    type: u1
    doc: |
      Version of ABI targeted by this ELF file. Interpretation
      depends on `abi` attribute.
  - id: pad
    size: 7
  - id: header
    type: endian_elf
types:
  endian_elf:
    meta:
      endian:
        switch-on: _root.endian
        cases:
          'endian::le': le
          'endian::be': be
    seq:
      - id: e_type
        type: u2
        enum: obj_type
      - id: machine
        type: u2
        enum: machine
      - id: e_version
        type: u4
      # e_entry
      - id: entry_point
        type:
          switch-on: _root.bits
          cases:
            'bits::b32': u4
            'bits::b64': u8
      # e_phoff
      - id: program_header_offset
        type:
          switch-on: _root.bits
          cases:
            'bits::b32': u4
            'bits::b64': u8
      # e_shoff
      - id: section_header_offset
        type:
          switch-on: _root.bits
          cases:
            'bits::b32': u4
            'bits::b64': u8
      # e_flags
      - id: flags
        size: 4
      # e_ehsize
      - id: e_ehsize
        type: u2
      # e_phentsize
      - id: program_header_entry_size
        type: u2
      # e_phnum
      - id: qty_program_header
        type: u2
      # e_shentsize
      - id: section_header_entry_size
        type: u2
      # e_shnum
      - id: qty_section_header
        type: u2
      # e_shstrndx
      - id: section_names_idx
        type: u2
    types:
      # Elf(32|64)_Phdr
      program_header:
        seq:
          # p_type
          - id: type
            type: u4
            enum: ph_type
          # p_flags
          - id: flags64
            type: u4
            if: _root.bits == bits::b64
          # p_offset
          - id: offset
            type:
              switch-on: _root.bits
              cases:
                'bits::b32': u4
                'bits::b64': u8
          # p_vaddr
          - id: vaddr
            type:
              switch-on: _root.bits
              cases:
                'bits::b32': u4
                'bits::b64': u8
          # p_paddr
          - id: paddr
            type:
              switch-on: _root.bits
              cases:
                'bits::b32': u4
                'bits::b64': u8
          # p_filesz
          - id: filesz
            type:
              switch-on: _root.bits
              cases:
                'bits::b32': u4
                'bits::b64': u8
          # p_memsz
          - id: memsz
            type:
              switch-on: _root.bits
              cases:
                'bits::b32': u4
                'bits::b64': u8
          # p_flags
          - id: flags32
            type: u4
            if: _root.bits == bits::b32
          # p_align
          - id: align
            type:
              switch-on: _root.bits
              cases:
                'bits::b32': u4
                'bits::b64': u8
        instances:
          body:
            io: _root._io
            pos: offset
            size: memsz
          flags:
            value: _root.bits == bits::b32?flags32:flags64
      # Elf(32|64)_Shdr
      section_header:
        seq:
          # sh_name
          - id: name_offset
            type: u4
          # sh_type
          - id: type
            type: u4
            enum: sh_type
          # sh_flags
          - id: flags
            type:
              switch-on: _root.bits
              cases:
                'bits::b32': u4
                'bits::b64': u8
          # sh_addr
          - id: addr
            type:
              switch-on: _root.bits
              cases:
                'bits::b32': u4
                'bits::b64': u8
          # sh_offset
          - id: offset
            type:
              switch-on: _root.bits
              cases:
                'bits::b32': u4
                'bits::b64': u8
          # sh_size
          - id: size
            type:
              switch-on: _root.bits
              cases:
                'bits::b32': u4
                'bits::b64': u8
          # sh_link
          - id: linked_section_idx
            type: u4
          # sh_info
          - id: info
            size: 4
          # sh_addralign
          - id: align
            type:
              switch-on: _root.bits
              cases:
                'bits::b32': u4
                'bits::b64': u8
          # sh_entsize
          - id: entry_size
            type:
              switch-on: _root.bits
              cases:
                'bits::b32': u4
                'bits::b64': u8
        instances:
          name:
            io: _root.header.header_name_strings._io
            pos: name_offset
            type: strz
            encoding: ASCII
          body:
            io: _root._io
            pos: offset
            size: size
          parsed:
            io: _root._io
            pos: offset
            size: size
            type:
              switch-on: type
              cases:
                'sh_type::progbits'      : blob_section
                'sh_type::symtab'        : symtab_section
                'sh_type::strtab'        : strtab_section
                'sh_type::rela'          : rela_section
                'sh_type::hash'          : blob_section
                'sh_type::dynamic'       : blob_section
                'sh_type::note'          : blob_section
                'sh_type::nobits'        : blob_section
                'sh_type::rel'           : rel_section
                'sh_type::shlib'         : blob_section
                'sh_type::dynsym'        : symtab_section
                'sh_type::init_array'    : blob_section
                'sh_type::fini_array'    : blob_section
                'sh_type::preinit_array' : blob_section
                'sh_type::group'         : blob_section
                'sh_type::symtab_shndx'  : blob_section
            if: type != sh_type::null_type and type != sh_type::nobits and size > 0
        types:
          blob_section:
            seq:
              - id: bytes
                size-eos: true
          symtab_section:
            seq:
              - id: symbols
                type:
                  switch-on: _root.bits
                  cases:
                    'bits::b32': symbol32
                    'bits::b64': symbol64
                repeat: eos
          strtab_section:
            seq:
              - id: strings
                type: strings_struct
          rel_section:
            seq:
              - id: relocations
                type:
                  switch-on: _root.bits
                  cases:
                    'bits::b32': rel32
                    'bits::b64': rel64
                repeat: eos
          rela_section:
            seq:
              - id: relocations
                type:
                  switch-on: _root.bits
                  cases:
                    'bits::b32': rela32
                    'bits::b64': rela64
                repeat: eos
          symbol32:
            seq:
              - id: name_offset
                type: u4
              - id: value
                type: u4
              - id: size
                type: u4
              - id: info
                type: sym_info
              - id: other
                type: u1
              - id: shndx
                type: u2
                enum: symbol_section_index
          symbol64:
            seq:
              - id: name_offset
                type: u4
              - id: info
                type: sym_info
              - id: other
                type: u1
              - id: shndx
                type: u2
                enum: symbol_section_index
              - id: value
                type: u8
              - id: size
                type: u8
          sym_info:
            seq:
              - id: info
                type: u1
            instances:
              bind:
                value: info >> 4
                enum: symbol_bind
              type:
                value: info & 0xf
                enum: symbol_type
          rel32:
            seq:
              - id: addr
                type: u4
              - id: info
                type: u4
            instances:
              sym_tab_index:
                value: info >> 8
              type:
                value: info & 0xff
          rel64:
            seq:
              - id: addr
                type: u8
              - id: info
                type: u8
            instances:
              sym_tab_index:
                value: info >> 32
              type:
                value: info & 0xffffffff
          rela32:
            seq:
              - id: rel
                type: rel32
              - id: addend
                type: s4
          rela64:
            seq:
              - id: rel
                type: rel64
              - id: addend
                type: s8
      strings_struct:
        seq:
          - id: entries
            type: strz
            repeat: eos
            encoding: ASCII
    instances:
      program_headers:
        pos: program_header_offset
        repeat: expr
        repeat-expr: qty_program_header
        size: program_header_entry_size
        type: program_header
      section_headers:
        pos: section_header_offset
        repeat: expr
        repeat-expr: qty_section_header
        size: section_header_entry_size
        type: section_header
      header_name_strings:
        pos: section_headers[section_names_idx].offset
        size: section_headers[section_names_idx].size
        type: strings_struct
enums:
  # EI_CLASS
  bits:
    # ELFCLASS32
    1: b32
    # ELFCLASS64
    2: b64
  # EI_DATA
  endian:
    # ELFDATA2LSB
    1: le
    # ELFDATA2MSB
    2: be
  os_abi:
    0: system_v
    1: hp_ux
    2: netbsd
    3: gnu
    6: solaris
    7: aix
    8: irix
    9: freebsd
    0xa: tru64 # Compaq TRU64 UNIX
    0xb: modesto # Novell Modesto
    0xc: openbsd
    0xd: openvms
    0xe: nsk # Hewlett-Packard Non-Stop Kernel
    0xf: aros # Amiga Research OS
    0x10: fenixos # The FenixOS highly scalable multi-core OS
    0x11: cloudabi # Nuxi CloudABI
    0x12: openvos # Stratus Technologies OpenVOS
  # e_type
  obj_type:
    # ET_REL
    1: relocatable
    # ET_EXEC
    2: executable
    # ET_DYN
    3: shared
    # ET_CORE
    4: core
  machine:
    0x00: not_set
    # EM_SPARC
    0x02: sparc
    # EM_386
    0x03: x86
    0x08: mips
    0x12: sparcplus
    0x14: powerpc
    # EM_ARM
    0x28: arm
    # EM_SH
    0x2A: superh
    0x32: ia_64
    # EM_X86_64
    0x3E: x86_64
    0xB7: aarch64
  ph_type:
    0: null_type
    1: load
    2: dynamic
    3: interp
    4: note
    5: shlib
    6: phdr
    7: tls
#    0x60000000: loos
    0x6fffffff: hios
#    0x70000000: loproc
#    0x7fffffff: hiproc
    0x6474e550: gnu_eh_frame
    0x6474e551: gnu_stack
    0x6474e552: gnu_relro
  # http://docs.oracle.com/cd/E23824_01/html/819-0690/chapter6-94076.html#chapter6-73445
  sh_type:
    0: null_type
    1: progbits
    2: symtab
    3: strtab
    4: rela
    5: hash
    6: dynamic
    7: note
    8: nobits
    9: rel
    10: shlib
    11: dynsym
    14: init_array
    15: fini_array
    16: preinit_array
    17: group
    18: symtab_shndx
#    0x60000000: loos
#    0x6fffffef: losunw
    0x6fffffef: sunw_capchain
    0x6ffffff0: sunw_capinfo
    0x6ffffff1: sunw_symsort
    0x6ffffff2: sunw_tlssort
    0x6ffffff3: sunw_ldynsym
    0x6ffffff4: sunw_dof
    0x6ffffff5: sunw_cap
    0x6ffffff6: sunw_signature
    0x6ffffff7: sunw_annotate
    0x6ffffff8: sunw_debugstr
    0x6ffffff9: sunw_debug
    0x6ffffffa: sunw_move
    0x6ffffffb: sunw_comdat
    0x6ffffffc: sunw_syminfo
    0x6ffffffd: sunw_verdef
    0x6ffffffe: sunw_verneed
    0x6fffffff: sunw_versym
#    0x6fffffff: HISUNW
#    0x6fffffff: hios
#    0x70000000: loproc
    0x70000000: sparc_gotdata
    0x70000001: amd64_unwind
#    0x7fffffff: hiproc
#    0x80000000: louser
#    0xffffffff: hiuser
  sh_flags:
    0x1: shf_write
    0x2: shf_alloc
    0x4: shf_execinstr
    0x10: shf_merge
    0x20: shf_strings
    0x40: shf_info_link
    0x80: shf_link_order
    0x100: shf_os_nonconforming
    0x200: shf_group
    0x400: shf_tls
    0x0ff00000: shf_maskos
    0xf0000000: shf_maskproc
    0x4000000: shf_ordered
    0x8000000: shf_exclude
  ph_flags:
    0x1: pf_x
    0x2: pf_w
    0x4: pf_r
    0xf0000000: pf_maskproc
  symbol_bind:
    0: local
    1: global
    2: weak
  symbol_type:
    0: no_type
    1: object
    2: func
    3: section
    4: file
  symbol_section_index:
    0      : undef
    0xff20 : livepatch
    0xfff1 : abs
    0xfff2 : common
  relocation_types_sparc_32:
    0: sparc_none
    1: sparc_8
    2: sparc_16
    3: sparc_32
    4: sparc_disp8
    5: sparc_disp16
    6: sparc_disp32
    7: sparc_wdisp30
    8: sparc_wdisp22
    9: sparc_hi22
    10: sparc_22
    11: sparc_13
    12: sparc_lo10
    13: sparc_got10
    14: sparc_got13
    15: sparc_got22
    16: sparc_pc10
    17: sparc_pc22
    18: sparc_wplt30
    19: sparc_copy
    20: sparc_glob_dat
    21: sparc_jmp_slot
    22: sparc_relative
    23: sparc_ua32
    24: sparc_plt32
    25: sparc_hiplt22
    26: sparc_loplt10
    27: sparc_pcplt32
    28: sparc_pcplt22
    29: sparc_pcplt10
    30: sparc_10
    31: sparc_11
    34: sparc_hh22
    35: sparc_hm10
    36: sparc_lm22
    37: sparc_pc_hh22
    38: sparc_pc_hm10
    39: sparc_pc_lm22
    40: sparc_wdisp16
    41: sparc_wdisp19
    43: sparc_7
    44: sparc_5
    45: sparc_6
    48: sparc_hix22
    49: sparc_lox10
    50: sparc_44
    51: sparc_m44
    52: sparc_l44
    53: sparc_register
    55: sparc_ua16
    80: sparc_gotdata_hix22
    81: sparc_gotdata_lox10
    82: sparc_gotdata_op_hix22
    83: sparc_gotdata_op_lox10
    84: sparc_gotdata_op
    86: sparc_size_32
    88: sparc_sparc_wdisp10
  relocation_types_sparc_64:
    9: sparc_hi22
    20: sparc_glob_dat
    22: sparc_relative
    32: sparc_64
    33: sparc_olo10
    46: sparc_disp64
    47: sparc_plt64
    53: sparc_register
    54: sparc_ua64
    85: sparc_h34
    87: sparc_size64
  relocation_types_x86_32:
    0: x86_386_none
    1: x86_386_32
    2: x86_386_pc32
    3: x86_386_got32
    4: x86_386_plt32
    5: x86_386_copy
    6: x86_386_glob_dat
    7: x86_386_jmp_slot
    8: x86_386_relative
    9: x86_386_gotoff
    10: x86_386_gotpc
    11: x86_386_32plt
    20: x86_386_16
    21: x86_386_pc16
    22: x86_386_8
    23: x86_386_pc8
    38: x86_386_size32
  relocation_types_x86_64:
    0: amd64_none
    1: amd64_64
    2: amd64_pc32
    3: amd64_got32
    4: amd64_plt32
    5: amd64_copy
    6: amd64_glob_dat
    7: amd64_jump_slot
    8: amd64_relative
    9: amd64_gotpcrel
    10: amd64_32
    11: amd64_32s
    12: amd64_16
    13: amd64_pc16
    14: amd64_8
    15: amd64_pc8
    24: amd64_pc64
    25: amd64_gotoff64
    26: amd64_gotpc32
    32: amd64_size32
    33: amd64_size64
