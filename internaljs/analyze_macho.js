function analyzeMachO(dataArray, options,  machoElem, reporter) {
    var ks = new KaitaiStream(dataArray, 0)
    macho = new MachO(ks)

    reporter.updateStatus('Analysing MachO data...');
    reporter.updateStatus('MachO analysis not yet supported! Giving up!');

    return sections;
}
