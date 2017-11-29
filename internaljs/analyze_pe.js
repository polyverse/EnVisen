function analyzePe(dataArray, options, peElem, reporter) {

  var ks = new KaitaiStream(dataArray, 0)
  pe = new MicrosoftPe(ks)

  reporter.updateStatus('Analysing PE data...');
  reporter.updateStatus('PE analysis not yet supported! Giving up!');

  return sections;
}
