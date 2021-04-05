export function findAreaAndDiam(area, gammalc, stressinanchor, right) {
  let left = gammalc * (stressinanchor / area);
  if (left <= right) {
    let temp = findD(area);
    return temp;
  } else if (area > 0.00784) {
    return "Выход за границы";
  }
  area += 0.0001;
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
  // translate into N/m2
  return +(1000 * (parseFloat(yieldPoint) / 1.025)).toFixed(1);
}

let norm = [
  { anchor: 50, shpilka: 65, nut: 85 },
  { anchor: 60, shpilka: 75, nut: 105 },
  { anchor: 65, shpilka: 75, nut: 105 },
  { anchor: 70, shpilka: 80, nut: 115 },
  { anchor: 75, shpilka: 90, nut: 130 },
  { anchor: 80, shpilka: 90, nut: 130 },
  { anchor: 85, shpilka: 100, nut: 145 },
  { anchor: 90, shpilka: 100, nut: 145 },
  { anchor: 95, shpilka: 105, nut: 155 },
  { anchor: 100, shpilka: 100, nut: 155 }
];

let Sweller = [
  { number: "18П", moment: 121, thickness: 5.1, height: 180 },
  { number: "20П", moment: 153, thickness: 5.2, height: 200 },
  { number: "22П", moment: 193, thickness: 5.4, height: 220 },
  { number: "24П", moment: 243, thickness: 5.6, height: 240 },
  { number: "27П", moment: 310, thickness: 6.0, height: 270 },
  { number: "30П", moment: 389, thickness: 6.5, height: 300 },
  { number: "33П", moment: 486, thickness: 7.0, height: 330 },
  { number: "36П", moment: 603, thickness: 7.5, height: 360 },
  { number: "40П", moment: 763, thickness: 8.0, height: 400 },
];

export function SwellerDistance(angle, diamAnchor, sweller, shag, usilie, gammac, gamman, resistanceBelt) {

  let el = 0;
  for (el in norm) {
    if (norm[el].anchor < diamAnchor) { el += 1; }
    else { break; }
  }
  let il = 0;
  for (il in Sweller) {
    if (Sweller[il].number == sweller) { break; }
    else { il += 1; }
  }

  let rout = 0.5 * 0.95 * norm[el].nut; //millimetrs

  let rsmall = 0.5 * (2 + norm[el].shpilka); //millimetrs

  let a = +(1 + 2 * Math.tan(angle) * Sweller[il].height).toFixed(2);
  if (a < 20) {
    a = norm[el].shpilka + 20;
  }

  let l = a + Sweller[il].thickness;

  let alfa = Math.acos(rsmall / rout);

  let areaSegment = 0.5 * rout * rout * (alfa - Math.sin(alfa));  //millimetrs 2
  let areanut = Math.PI * (rout * rout - rsmall * rsmall); //millimetrs 2
  let usilieForNuts = 1.5 * shag * usilie; // кН
  let shoulderForce = (4 * rout * Math.sin(alfa / 2) * Math.sin(alfa / 2) * Math.sin(alfa / 2)) / (3 * (alfa - Math.sin(alfa))); //millimetr
  let forceArea = usilieForNuts * (areaSegment / areanut); // кН
  let forceRing = 0.5 * (usilieForNuts - 2 * forceArea); // кН
  let liningMoment = 0.25 * usilieForNuts * l * 0.001 - forceArea * shoulderForce * 0.001 - 0.5 * forceRing * rsmall * 0.001; // кН*м
  //                             kN          mm               kN           mm                          kN         mm
  //передать в таблицу
  // подобрать по унифицированным размерам
  let liningLength = (10 * Math.ceil((l + 100) / 10));
  let liningWidth = (10 * Math.ceil((0.95 * norm[el].nut + 40) / 10));

  let mI = gammac * gamman * liningMoment; // кН*м

  let liningMomentResist = mI / resistanceBelt; // м3
  
  let liningDealta = Math.ceil(Math.sqrt((6 * liningMomentResist) / (liningWidth - (2 + norm[el].shpilka)))); //millimetrs

  document.getElementById("anchorShpilka").innerHTML = norm[el].shpilka;
  document.getElementById("linlength").innerHTML = liningLength;
  document.getElementById("linwidth").innerHTML = liningWidth;
  document.getElementById("lindelta").innerHTML = liningDealta;

}


function findD(area) {
  let d = Math.ceil(2 * Math.sqrt((area * 1000000) / Math.PI));
  for (let el of norm) {
    if (d <= el.anchor) { return el.anchor; }
  }
  return "Выход за границы";
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
  for (let item in Sweller) {
    let rightBelt = (1.15 / gamman) * (resistanceBelt * Sweller[item].moment * 0.000001);
    if (leftBelt < rightBelt) {
      return Sweller[item].number;
    }
    item += 1;
  }
  return "Выход за границы";
}