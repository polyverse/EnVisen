// Entropy Quality Index is a function of a few things. Described
// in detail under docs.

function displayEntropyIndex(histogram, reporter) {
  reporter.updateStatus("Computing Entropy Index now...");

  let totalGadgets = 0;
  for (let key in histogram) {
    totalGadgets += histogram[key];
  }

  if (!("dead" in histogram)) {
    histogram["dead"] = 0;
  }
  if (!("0" in histogram)) {
    histogram["0"] = 0;
  }

  const percentDead = (histogram["dead"] * 100.0)/totalGadgets;
  const percentSurvived = (histogram[0] * 100.0)/totalGadgets;
  const totalMoved = totalGadgets - (histogram[0] + histogram["dead"]);
  const percentMoved = totalMoved * 100.0 / totalGadgets;
  reporter.updateStatus("==> Percentage of dead gadgets: " + percentDead);
  reporter.updateStatus("==> Percentage of surviving gadgets: " + percentSurvived);
  reporter.updateStatus("==> Percentage of moved gadgets: " + percentMoved);

  let moveCounts = [];
  let highestCount = 0;

  for(let key in histogram) {
    if(histogram.hasOwnProperty(key) && key != "0" && key != "dead") {
      const count = histogram[key];
      moveCounts.push(count);
      if (count > highestCount) {
        highestCount = count;
      }
    }
  }

  //subtract 2 for "dead" (dead gadgets) and "0" (surviving gadgets).
  reporter.updateStatus("==> Number of offsets gadgets moved to: " + moveCounts.length);

  const sd = standardDeviation(moveCounts);
  const scaledSd = sd/highestCount;
  reporter.updateStatus("==> Normalized Standard Deviation of move bucket counts: " + scaledSd);

  const eqi = percentDead + ((moveCounts.length * 100.0) / totalMoved) * (1.0 - scaledSd);

  //subtract 2 for "dead" (dead gadgets) and "0" (surviving gadgets).
  reporter.updateStatus("Entropy Quality Index: " + eqi);
}


function standardDeviation(arr) {
  var mean = 0, variance = 0, deviation = 0;
  const t = arr.length;
  for(var m, s = 0, l = t; l--; s += arr[l]);
  for(m = mean = s / t, l = t, s = 0; l--; s += Math.pow(arr[l] - m, 2));
  const stdDeviation = Math.sqrt(s / t);
  return stdDeviation;
}
