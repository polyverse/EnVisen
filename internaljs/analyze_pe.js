function analyzePe(dataArray, options, peElem, reporter) {

  const ks = new KaitaiStream(dataArray, 0)
  pe = new MicrosoftPe(ks)
  options = setPEDefaults(options, pe);

  reporter.updateStatus('Analysing PE data...');

  peElem.append(
  '<span><i>Machine Type</i>: <b>' + MicrosoftPe.CoffHeader.MachineType[pe.coffHdr.machine] +
  '</b>, <i>Characteristics</i>: <b>' + interpretFlags(pe.coffHdr.characteristics, MicrosoftPe.CoffHeader.Characteristics) +
  '</b>, <i>Subsystem</i>: <b>' + MicrosoftPe.OptionalHeaderWindows.SubsystemEnum[pe.optionalHdr.windows.subsystem] +
  '</b>, <i>Format</i>: <b>' + MicrosoftPe.PeFormat[pe.optionalHdr.std.format] +
  '</b>.</span><br/>');

  var expando = $('<a href="#">Show/Hide PE Details</a>')
  var expansionDiv = $('<div style="display: none"></div>');
  peElem.append(expando)
  peElem.append(expansionDiv)
  expando.click(function() {
    expansionDiv.toggle();
  });

  expansionDiv.append('<H5>Sections</H5>');
  var tableWrapper = $('<div class="clusterize-scroll"/>');
  expansionDiv.append(tableWrapper);

  //fill in expansionDiv with section and program headers
  var sectionsTable = $('<table/>');
  tableWrapper.append(sectionsTable);

  sectionsTable.append('<thead><tr>' +
  '<th>Name</th>' +
  '<th>Characteristics</th>' +
  '<th># of LineNumbers</th>' +
  '<th># of Relocations</th>' +
  '<th>Size of Raw Data</th>' +
  '<th>VAddr</th>' +
  '<th>VSize</th>' +
  +'</tr></thead>');

  var tbody = $('<tbody class="clusterize-content"/>');
  sectionsTable.append(tbody);

  var rows = [];
  for (let si in pe.sections) {
    const s = pe.sections[si];
    const lcstr = '<tr>' +
    '<td>' + s.name + '</td>' +
    '<td>' + s.characteristics + '</td>' +
    '<td>' + s.numberOfLinenumbers + '</td>' +
    '<td>' + s.numberOfRelocations + '</td>' +
    '<td>' + s.sizeOfRawData + '</td>' +
    '<td>' + s.virtualAddress + '</td>' +
    '<td>' + s.virtualSize + '</td>' +
    '</tr>';
    rows.push(lcstr);
  }
  var clusterize = new Clusterize({
    scrollElem: tableWrapper.get(0),
    contentElem: tbody.get(0),
    rows: rows
  });

  reporter.updateStatus("Converting MachO program segments " +
    "into struct for ROP finder to work in a Worker process..<br/>");

  let imageBase = 0;
  if (options.bits == 32) {
    imageBase = pe.optionalHdr.windows.imageBase32
  } else if (options.bits == 64) {
    imageBase = pe.optionalHdr.windows.imageBase64
  } else {
    reporter.updateStatus("Unable to determine image base (defaulting to zero) because bit length of this executable was not resolved: " + options.bits);
  }

  var sections = [];
  for (let si in pe.sections) {
    const s = pe.sections[si];
    if (s.characteristics & 0x20000000) {
        try {
          const bodyContents = s.body;
          var section = {
            name: s.name,
            offset: s.pointerToRawData,
            size: s.sizeOfRawData,
            vaddr: s.virtualAddress + imageBase,
            opcodes: bodyContents,
          };
          sections.push(section);
        } catch (e) {
            reporter.updateStatus("Skipping section " + secti + " due to exception: " + e);
        }
      } //end: if - characteristics
  } //end: for - sections

  return [sections, [], options];
}


function setPEDefaults(options, pe) {
  if (options.arch == "auto detect") {
    options.arch = peToArch(pe);
  }

  if (options.bits == "auto detect") {
    options.bits = peToBits(pe);
  }

  if (options.endian == "auto detect") {
    options.endian = peToEndian(pe);
  }

  return options;
}


function peToArch(pe) {
  switch (pe.coffHdr.machine) {
    case MicrosoftPe.CoffHeader.MachineType["I386"]:
    case MicrosoftPe.CoffHeader.MachineType["AMD64"]:
      return "x86";
    case MicrosoftPe.CoffHeader.MachineType["ARM"]:
    case MicrosoftPe.CoffHeader.MachineType["ARMNT"]:
      return "arm";
    default:
      return "unknown";
  }
}

function peToBits(pe) {
  switch (pe.optionalHdr.std.format) {
    case MicrosoftPe.PeFormat["PE32"]:
      return 32;
    case MicrosoftPe.PeFormat["PE32_PLUS"]:
      return 64;
    default:
      return "unknown";
  }
}

// Apparently nobody on the internet has ever seen a big-endian PE file so far.
function peToEndian(pe) {
  return "little";
}
