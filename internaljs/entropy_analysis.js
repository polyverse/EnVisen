// Entropy Quality Index is a function of a few things. Described
// in detail under docs.

function displayEntropyAnalysis(offsetCounts, reporter) {
  reporter.updateStatus("Computing Entropy Index now...");


  if (!("new" in offsetCounts)) {
    offsetCounts["new"] = 0;
  }
  if (!("dead" in offsetCounts)) {
    offsetCounts["dead"] = 0;
  }
  if (!("0" in offsetCounts)) {
    offsetCounts["0"] = 0;
  }

  const keys = Object.keys(offsetCounts);

  let totalGadgets = 0;
  for (let ki in keys) {
    totalGadgets += offsetCounts[keys[ki]];
  }

  const totalGadgetsPrev = totalGadgets - offsetCounts["new"];

  const percentDead = (offsetCounts["dead"] * 100.0)/totalGadgetsPrev;
  const percentSurvived = (offsetCounts[0] * 100.0)/totalGadgetsPrev;
  const totalMoved = totalGadgetsPrev - (offsetCounts[0] + offsetCounts["dead"]);
  const percentMoved = totalMoved * 100.0 / totalGadgets;
  reporter.updateStatus("==> Number of new gadgets: " + offsetCounts["new"]);
  reporter.updateStatus("==> Percentage of dead gadgets: " + percentDead);
  reporter.updateStatus("==> Percentage of surviving gadgets: " + percentSurvived);
  reporter.updateStatus("==> Percentage of moved gadgets: " + percentMoved);

  const movedKeys = [];
  let highestCount = 0;

  for(let ki in keys) {
    const key = keys[ki];
    if(key != "0" && key != "dead" && key != "new") {
      movedKeys.push(parseInt(key, 10));
      const count = offsetCounts[key];
      if (count > highestCount) {
        highestCount = count;
      }
    }
  }

  //subtract 2 for "dead" (dead gadgets) and "0" (surviving gadgets).
  reporter.updateStatus("==> Number of offsets gadgets moved to: " + movedKeys.length);

  const sd = standardDeviation(offsetCounts, movedKeys);
  const scaledSd = sd/highestCount;
  reporter.updateStatus("==> Scaled Standard Deviation of move bucket counts: " + scaledSd);

  const percentMovedEffectively =  ((movedKeys.length * 100.0) / totalMoved) * (1.0 - scaledSd);
  const eqi = percentDead + percentMovedEffectively;

  //subtract 2 for "dead" (dead gadgets) and "0" (surviving gadgets).
  reporter.updateStatus("Entropy Quality Index: " + eqi);
  reporter.updateStatus("Displaying analysis popover");

  movedKeys.sort(function(a, b) {return a-b;});
  const [histLabels, histData] = computeHistogram(offsetCounts, movedKeys, movedKeys[0], movedKeys[movedKeys.length-1], 20);

  picoModal({
      content: '<div id="entropyAnalysisContainer"/>',
      closeButton: false
  }).afterShow(function() {

    const analysisHtml = $("#entropyAnalysisContainer");
    analysisHtml.append('<center><span>Overall Entropy Quality Index: <b>' + eqi + '</b></span></center><br/>');
    const gadgetDistCanvas = $('<canvas class="chartCanvas" width="300" height="300"/>');
    analysisHtml.append(gadgetDistCanvas);
    const gadgetHistCanvas = $('<canvas class="chartCanvas" width="300" height="300"/>');
    analysisHtml.append(gadgetHistCanvas);
    const save = $('<br/><a href="#" class="save">Save offset counts as JSON</a><br/>');
    analysisHtml.append(save);

    save.click(function() {
        saveAs(new Blob([JSON.stringify(offsetCounts, null, 2)], {type: "application/json"})
      		, "offsetCounts.json");
    })

    const survivedColor = "#de2629",
          movedIneffectivelyColor = "#d8a24b",
          movedEffectivelyColor = "#e5d65c",
          deadColor = "#39c44d",
          newColor = "#3967c4";

    const survivedLabel = "Survived",
          movedIneffectivelyLabel = "Moved Ineffectively",
          movedEffectivelyLabel = "Moved Effectively",
          deadLabel = "Dead";

    var gadgetDistCanvasCtx = gadgetDistCanvas.get(0).getContext('2d');
    // Draw basic survival pie chart
    const gadgetDistChart = new Chart(gadgetDistCanvasCtx, {
      type: 'pie',
      options: {
        legend: { position: "bottom" },
        title: {
          display: true,
          text: 'Gadget Fate'
        },
        responsive: false,
        maintainAspectRatio: false,
      },
      data: {
        labels: [deadLabel, movedEffectivelyLabel, movedIneffectivelyLabel, survivedLabel],
        datasets: [{
          data: [percentDead, percentMovedEffectively, percentMoved - percentMovedEffectively, percentSurvived],
          backgroundColor: [deadColor, movedEffectivelyColor, movedIneffectivelyColor, survivedColor]
        }],
      }
    });

    var gadgetHistCanvasCtx = gadgetHistCanvas.get(0).getContext('2d');
    // Draw movement histogram bar chart
    const gadgetHistChart = new Chart(gadgetHistCanvasCtx, {
        type: 'bar',
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Distribution by move offsets'
          },
          responsive: false,
          maintainAspectRatio: false,
          scales: {
               xAxes: [{
                   ticks: {
                       display: false
                   }
               }]
           }
         },
         data: {
           labels: histLabels,
           datasets: [{
             fill: true,
             data: histData,
             backgroundColor:  movedEffectivelyColor,
             borderColor: movedIneffectivelyColor
           }]
         }
    });

  }).afterClose(function () {
    $("#entropyAnalysisContainer").remove();
  }).show();
}


function standardDeviation(data, keys) {
  var mean = 0, variance = 0, deviation = 0;
  const t = keys.length;
  for(var m, s = 0, l = t; l--; s += data[keys[l]]);
  for(m = mean = s / t, l = t, s = 0; l--; s += Math.pow(data[keys[l]] - m, 2));
  const stdDeviation = Math.sqrt(s / t);
  return stdDeviation;
}

function computeHistogram(data, sortedKeys, minKey, maxKey, numBuckets) {
  const keysInRange = filterKeysInRange(sortedKeys, minKey, maxKey);
  const histLabels = [];
  const histData = [];

  if (maxKey - minKey <= numBuckets) {
    numBuckets = maxKey - minKey + 1;
  }

  const rangePerBucket = (maxKey - minKey) / numBuckets;


  for (let i = 0; i < numBuckets; i++) {
    const bucketMin = minKey + (i * rangePerBucket);
    const bucketMax = (i == numBuckets-1)?
                      maxKey:
                      minKey + ((i+1) * rangePerBucket);

    const [bucketLabel, bucketData] = computeBucket(data, keysInRange, bucketMin, bucketMax);
    histLabels.push(bucketLabel);
    histData.push(bucketData);
  }

  return [histLabels, histData];
}

function computeBucket(data, sortedKeys, bucketMin, bucketMax) {
  const keysInRange = filterKeysInRange(sortedKeys, bucketMin, bucketMax);
  let collector = 0;
  for (let li in keysInRange) {
    collector += data[keysInRange[li]];
  }
  let bucketLabel = Math.round(bucketMin);
  if (Math.round(bucketMin) != Math.round(bucketMax)) {
    bucketLabel += " to " + Math.round(bucketMax);
  }

  return [bucketLabel, collector];
}

function filterKeysInRange(keys, min, max) {
  const keysInRange = [];
  for (let ki in keys) {
    const key = keys[ki];
    if (key >= min && key <= max) {
      keysInRange.push(key);
    }

    if (key > max) {
      break; //No need to loop after we've crossed the range
    }
  }

  return keysInRange;
}


// Run from browser console to exercise code paths in this.
function testAnalysis() {
  const offsetCountsHighRange = {
    "new": 20,
    "dead": 20,
    "0": 10,
    "1": 5,
    "2": 3,
    "6": 10,
    "8": 9,
    "15": 15,
    "22": 3,
    "24": 2,
    "25": 1,
    "31": 0,
    "32": 9,
    "33": 75,
    "45": 10,
    "-2": 4,
    "-4": 17,
    "-20": 6
  };

  const offsetCountsLowRange = {
    "-10": 5,
    "2": 20,
    "30": 3
  };

  const reporter = {
    updateStatus: function() {}
  };

  displayEntropyAnalysis(offsetCountsLowRange, reporter);
}
