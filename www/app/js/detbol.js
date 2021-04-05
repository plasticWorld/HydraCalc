export function findAreaAndDiam(area, gammalc, stressinanchor, right) {
  let left = gammalc * (stressinanchor / area);
  if (left <= right) {
    let temp = findD(area * 1000000);
    return Math.ceil(temp);
  }
  area += 0.000001;
  return findAreaAndDiam(area, gammalc, stressinanchor, right);
}

export function StressInAnchor(angle, stress, step, chain) {
  // растягивающее усилие в анкерной тяге
  let k = 1;
  if (chain) { k = 1.5; }
  let e = (k * stress * step) / (Math.cos(angle));
  return +e.toFixed(3);
}

export function Resistance(yieldPoint) {
  // translate into kPa from N/mm2
  return +((parseFloat(yieldPoint) / 1.025) * 1000).toFixed(1);
}

export function findD(area) {
  let d = 2 * Math.sqrt(area / Math.PI);
  return d;
}

export function mooringStress(flyoverValue, bollardArrayLength, h, s) {
  let ms = (s / bollardArrayLength) * (1 + (h / flyoverValue));
  return +ms.toFixed(3);
}

export function HeightDifference(territoryLevel, thrustFaceLevel) {
  return +(territoryLevel - thrustFaceLevel).toFixed(3);
}

export function MooringLoad(Qtot, bolladrsNumber) {
  return +(Qtot / bolladrsNumber).toFixed(3);
}

export function MAnchor(stress, step) {
  let m = 0.085 * stress * step * step;
  return +m.toFixed(2);
}

export function QAnchor(stress, step) {
  let q = 0.5 * stress * step;
  return +q.toFixed(2);
}



export function findSweller(gamman, resistanceBelt, leftBelt) {
  let Sweller = [
    { number: "18П", moment: 121 },
    { number: "20П", moment: 153 },
    { number: "22П", moment: 193 },
    { number: "24П", moment: 243 },
    { number: "27П", moment: 310 },
    { number: "30П", moment: 389 },
    { number: "33П", moment: 486 },
    { number: "36П", moment: 603 },
    { number: "40П", moment: 763 },
  ];
  for (let item in Sweller) {
    let rightBelt = (1.15 / gamman) * (resistanceBelt * Sweller[item].moment * 0.000001);
    if (leftBelt < rightBelt) {
      return Sweller[item].number;
    }
    item += 1;
  }
  return "Невозможно подобрать";
}