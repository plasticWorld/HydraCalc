// вычисляет коэффициент безопасности взамисимости от типа судна
function CalcSafety(vesselVolume) {
  let deadWeight = +(vesselVolume / 1000).toFixed(3);

  let coefficientOfSafety = 1;
  if (!document.getElementById("safetyToggle").checked) {
    let x = [];
    let y = [];
    if (document.getElementById("vesselType").value == "cargo") {
      x.push(20);
      x.push(150);
      y.push(1.75);
      y.push(1.25);
      coefficientOfSafety = LinearInterpolation(deadWeight, x, y);
    } else if (document.getElementById("vesselType").value == "container") {
      x.push(50);
      x.push(150);
      y.push(2);
      y.push(1.5);
      coefficientOfSafety = LinearInterpolation(deadWeight, x, y);
    } else { coefficientOfSafety = 2; }
  }

  return coefficientOfSafety;
}
// вычисляет кинетическую энергию с которой судно бьется о сооружение
function KineticEnergy(coefficientOfSafety, vesselVolume, velocity, globalCoefficient) {

  document.getElementById("sf").innerHTML = coefficientOfSafety;
  let e = coefficientOfSafety * globalCoefficient * ((vesselVolume * velocity * velocity) / 2);
  return +e.toFixed(3);
}
// вычисляет коэффициент эксцентриситета
function Eccentricity(velocityAngle, vesselVolume) {
  let vesselLength = document.getElementById("vesselLength").value;
  let vesselWidth = document.getElementById("vesselWidth").value;
  let centerOfMass = document.getElementById("centerOfMassDistance").value;
  let waterDensity = document.getElementById("waterDensity").value;
  let draught = document.getElementById("vesselDraught").value;

  let coefDelta = vesselVolume /
    (waterDensity * vesselLength * vesselWidth * draught);

  let radiusCircleMovment = (0.19 * coefDelta + 0.11) * vesselLength;

  let centerDistance = Math.sqrt(centerOfMass * centerOfMass +
    Math.pow((vesselWidth / 2), 2));

  let coef = (Math.pow(radiusCircleMovment, 2) +
    Math.pow(centerDistance, 2) * ((Math.cos(velocityAngle *
      (Math.PI / 180))) * (Math.cos(velocityAngle * (Math.PI / 180))))) / (Math.pow(radiusCircleMovment, 2) + Math.pow(centerDistance, 2));

  return +(coef).toFixed(4);
}
// вычисляет коэффициет добавленной массы
function AddedMass(isSideApproach) {
  let coefAddedMass = 1.1;
  if (isSideApproach) {
    let waterDepth = document.getElementById("waterDepth").value;
    let draught = document.getElementById("vesselDraught").value;
    let highRange = 1.5;
    let lowRange = 1.1;
    if (waterDepth / draught > lowRange && waterDepth / draught < highRange) {
      coefAddedMass = 2.625 - 0.75 * (waterDepth / draught);
    } else { coefAddedMass = waterDepth / draught <= lowRange ? 1.8 : 1.5; }
  }
  return +coefAddedMass.toFixed(3);
}
// вычисляет скорость судна при подходе - зависит от условий акватории и водоизмещения
function CalcVelocity(deadWeight) {
  deadWeight = +(deadWeight / 1000).toFixed(3);
  let xRange = [1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 100, 200, 300, 400];
  let yOpenHard = [0.87, 0.73, 0.65, 0.6, 0.56, 0.45, 0.36, 0.31, 0.28, 0.26, 0.2, 0.16, 0.14, 0.12];
  let yOpenAverage = [0.67, 0.58, 0.52, 0.49, 0.46, 0.38, 0.3, 0.26, 0.24, 0.22, 0.17, 0.13, 0.11, 0.1];
  let yOpenEasy = [0.52, 0.45, 0.4, 0.37, 0.35, 0.29, 0.23, 0.2, 0.18, 0.16, 0.13, 0.1, 0.08, 0.08];
  let yCloseAverage = [0.34, 0.3, 0.27, 0.25, 0.24, 0.19, 0.15, 0.13, 0.12, 0.11, 0.08, 0.08, 0.08, 0.08];
  let yCloseEasy = [0.18, 0.15, 0.14, 0.13, 0.12, 0.09, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08];

  let isGateEntrance = document.getElementById("gateEntrance").checked;
  let speed = 0;
  if (isGateEntrance) {
    let vesselVelocity = parseInt(document.getElementById("vesselVelocity").value);
    let mooringAngle = parseInt(document.getElementById("mooringAngle").value);
    speed = vesselVelocity * Math.sin(mooringAngle * (Math.PI / 180));

  } else {
    let isWaterAreaClose = document.getElementById("waterAreaClose").checked;
    let isMooringAverage = document.getElementById("mooringAverage").checked;
    let isMooringEasy = document.getElementById("mooringEasy").checked;

    let yRange = [];

    if (isWaterAreaClose) {
      if (isMooringAverage) { yRange = yCloseAverage; }
      else { yRange = yCloseEasy; }
    } else {
      let isMooringHard = document.getElementById("mooringDifficult").checked;
      if (isMooringAverage) { yRange = yOpenAverage; }
      else if (isMooringEasy) { yRange = yOpenEasy; }
      else { yRange = yOpenHard; }
    }
    speed = LinearInterpolation(deadWeight, xRange, yRange);
  }
  return +speed.toFixed(2);
}
// для линейной интерполяции табличных значений
function LinearInterpolation(x, xValues, yValues) {
  let y = 0;
  if (x > xValues[xValues.length - 1] || x < xValues[0]) {
    y = (x > xValues[xValues.length - 1]) ? yValues[xValues.length - 1] : yValues[0];
  } else {
    for (let i = 0; i < xValues.length; i++) {
      if (x >= xValues[i] && x < xValues[i + 1]) {
        y = yValues[i] + (x - xValues[i]) * ((yValues[i + 1] - yValues[i]) / (xValues[i + 1] - xValues[i]));
      }
    }
  }
  return y;
}

// храним полученные значения энергии от подхода
// для более удобного импорта
export let finalEnergy = {
  Min: 0,
  Max: 0
};


export function CalcStart() {
  // получаем значения из формы
  let vesselVolume = document.getElementById("vesselVolume").value;

  let velocity = CalcVelocity(vesselVolume);

  let isSideApproach = document.getElementById("sideApproach").checked;

  let coefficientOfAddedMass = AddedMass(isSideApproach);

  let coefficientOfThrough = 1;
  let isTowing = document.getElementById("towing").checked;
  let isSolid = document.getElementById("solidStructure").checked;
  let mooringAngle = parseInt(document.getElementById("mooringAngle").value);
  if (isTowing && isSolid) {
    coefficientOfThrough = 0.9;
  } else {

    if (isSolid && mooringAngle < 5) { coefficientOfThrough = 0.9; }
  }

  let isAproximate = document.getElementById("aproximateToggle").checked;
  let coefficientOfEccentricity = [];
  if (isAproximate) {
    if (document.getElementById("thirdMooring").checked) {
      coefficientOfEccentricity.push(0.6);
      coefficientOfEccentricity.push(0.8);
    } else if (document.getElementById("quarterMooring").checked) {
      coefficientOfEccentricity.push(0.4);
      coefficientOfEccentricity.push(0.6);
    } else { coefficientOfEccentricity.push(1); }
  } else {
    let velocityAngle = parseInt(document.getElementById("velocityAngle").value);

    if (velocityAngle >= 10) {
      let temp = Eccentricity(velocityAngle, vesselVolume);
      coefficientOfEccentricity.push(temp);
    } else { coefficientOfEccentricity.push(1); }
  }

  let coefficientOfHardness = 0.9;
  if (document.getElementById("materialsHardnessToggle").checked) {
    coefficientOfHardness = 1;
  }

  //start calculating
  let globalCoefficient = [];

  let coefficientOfSafety = 1;
  for (let val of coefficientOfEccentricity) {
    let temp = +(coefficientOfHardness * coefficientOfThrough * coefficientOfAddedMass * val).toFixed(3);
    globalCoefficient.push(temp);
  }

  let safety = 0;

  safety = CalcSafety(vesselVolume);
  finalEnergy.Min = KineticEnergy(safety, vesselVolume, velocity, globalCoefficient[0]);
  if (globalCoefficient.length != 1) {
    finalEnergy.Max = KineticEnergy(safety, vesselVolume, velocity, globalCoefficient[1]);
  }

  //передаем результаты в таблицу 
  document.getElementById("vv").innerHTML = (+vesselVolume / 1000);
  document.getElementById("ma").innerHTML = mooringAngle;
  document.getElementById("vn").innerHTML = velocity;
  document.getElementById("am").innerHTML = coefficientOfAddedMass;
  document.getElementById("th").innerHTML = coefficientOfThrough;
  document.getElementById("cs").innerHTML = coefficientOfHardness;
  document.getElementById("sf").innerHTML = safety.toFixed(2);
  if (coefficientOfEccentricity.length > 1) {
    document.getElementById("ecc-min").innerHTML = coefficientOfEccentricity[0];
    document.getElementById("ecc-max").innerHTML = coefficientOfEccentricity[1];
    document.getElementById("gb-min").innerHTML = globalCoefficient[0];
    document.getElementById("gb-max").innerHTML = globalCoefficient[1];
    document.getElementById("resultEn-min").innerHTML = finalEnergy.Min;
    document.getElementById("resultEn-max").innerHTML = finalEnergy.Max;
  } else {
    document.getElementById("ecc").innerHTML = coefficientOfEccentricity;
    document.getElementById("gb").innerHTML = globalCoefficient;
    document.getElementById("resultEn").innerHTML = finalEnergy.Min;
  }

}
