function analyzeRaw(dataArray, options, peElem, reporter) {
  reporter.updateStatus('Analysing RAW data...');

  if (options.arch == "auto detect" || options.bits == "auto detect" || options.endian == "auto detect") {
    reporter.updateStatus("RAW analysis requires you to set Architecture, Bits and Endian values, since they cannot be autodetected. Aborting analysis.")
  }

  const uint8array = new Uint8Array(dataArray);

  const section = {
    offset: 0,
    size: uint8array.length,
    vaddr: 0,
    opcodes: uint8array,
  };


  reporter.updateStatus('RAW analysis not yet supported! Giving up!');
  return [[section], [], options];
}
