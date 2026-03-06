export interface BillOfMaterialsPriceItem {
  id: string;
  itemName: string;
  todaysRate: number;
  previousRate: number;
  difference: number;
  percentChange: number;
}

export const billOfMaterialsPriceItem1: BillOfMaterialsPriceItem[] = [
  {
    id: "1",
    itemName: "AXEL GEAR CT85",
    todaysRate: 15250,
    previousRate: 14500,
    difference: 750,
    percentChange: 5.17,
  },
  {
    id: "2",
    itemName: "FLY WHEEL",
    todaysRate: 8450,
    previousRate: 8800,
    difference: -350,
    percentChange: -3.98,
  },
  {
    id: "3",
    itemName: "Final Drive Gear",
    todaysRate: 3275,
    previousRate: 3150,
    difference: 125,
    percentChange: 3.97,
  },
  {
    id: "4",
    itemName: "GEAR CASE",
    todaysRate: 4380,
    previousRate: 4650,
    difference: -270,
    percentChange: -5.81,
  },
  {
    id: "5",
    itemName: "Shaft Final",
    todaysRate: 6925,
    previousRate: 6700,
    difference: 225,
    percentChange: 3.36,
  },
];

export const billOfMaterialsPriceItem2: BillOfMaterialsPriceItem[] = [
  {
    id: "1",
    itemName: "AXEL GEAR CT85",
    todaysRate: 2475,
    previousRate: 2450,
    difference: 25,
    percentChange: 1.02,
  },
  {
    id: "2",
    itemName: "FLY WHEEL",
    todaysRate: 11850,
    previousRate: 12200,
    difference: -350,
    percentChange: -2.87,
  },
  {
    id: "3",
    itemName: "Final Drive Gear",
    todaysRate: 1825,
    previousRate: 1750,
    difference: 75,
    percentChange: 4.29,
  },
  {
    id: "4",
    itemName: "GEAR CASE",
    todaysRate: 9680,
    previousRate: 9300,
    difference: 380,
    percentChange: 4.09,
  },
  {
    id: "5",
    itemName: "Shaft Final",
    todaysRate: 835,
    previousRate: 870,
    difference: -35,
    percentChange: -4.02,
  },
];

// Weekly price data for graphs
export interface PriceHistoryData {
  date: string;
  axelGear: number;
  flyWheel: number;
  finalDriveGear: number;
  gearCase: number;
  shaftFinal: number;
}

export const weeklyPriceData: PriceHistoryData[] = [
  {
    date: "Feb 17",
    axelGear: 14500,
    flyWheel: 8800,
    finalDriveGear: 3150,
    gearCase: 4650,
    shaftFinal: 6700,
  },
  {
    date: "Feb 18",
    axelGear: 14580,
    flyWheel: 8720,
    finalDriveGear: 3175,
    gearCase: 4610,
    shaftFinal: 6750,
  },
  {
    date: "Feb 19",
    axelGear: 14720,
    flyWheel: 8650,
    finalDriveGear: 3195,
    gearCase: 4560,
    shaftFinal: 6805,
  },
  {
    date: "Feb 20",
    axelGear: 14850,
    flyWheel: 8580,
    finalDriveGear: 3215,
    gearCase: 4515,
    shaftFinal: 6840,
  },
  {
    date: "Feb 21",
    axelGear: 14980,
    flyWheel: 8520,
    finalDriveGear: 3235,
    gearCase: 4470,
    shaftFinal: 6875,
  },
  {
    date: "Feb 22",
    axelGear: 15090,
    flyWheel: 8485,
    finalDriveGear: 3250,
    gearCase: 4425,
    shaftFinal: 6895,
  },
  {
    date: "Feb 23",
    axelGear: 15170,
    flyWheel: 8465,
    finalDriveGear: 3265,
    gearCase: 4395,
    shaftFinal: 6910,
  },
  {
    date: "Feb 24",
    axelGear: 15250,
    flyWheel: 8450,
    finalDriveGear: 3275,
    gearCase: 4380,
    shaftFinal: 6925,
  },
];

export const monthlyPriceData: PriceHistoryData[] = [
  {
    date: "Week 1",
    axelGear: 14200,
    flyWheel: 9100,
    finalDriveGear: 3080,
    gearCase: 4820,
    shaftFinal: 6580,
  },
  {
    date: "Week 2",
    axelGear: 14350,
    flyWheel: 8950,
    finalDriveGear: 3110,
    gearCase: 4750,
    shaftFinal: 6620,
  },
  {
    date: "Week 3",
    axelGear: 14600,
    flyWheel: 8720,
    finalDriveGear: 3140,
    gearCase: 4680,
    shaftFinal: 6710,
  },
  {
    date: "Week 4",
    axelGear: 14750,
    flyWheel: 8650,
    finalDriveGear: 3175,
    gearCase: 4620,
    shaftFinal: 6760,
  },
  {
    date: "Week 5",
    axelGear: 14880,
    flyWheel: 8580,
    finalDriveGear: 3205,
    gearCase: 4560,
    shaftFinal: 6810,
  },
  {
    date: "Week 6",
    axelGear: 15020,
    flyWheel: 8520,
    finalDriveGear: 3235,
    gearCase: 4495,
    shaftFinal: 6850,
  },
  {
    date: "Week 7",
    axelGear: 15140,
    flyWheel: 8480,
    finalDriveGear: 3255,
    gearCase: 4435,
    shaftFinal: 6885,
  },
  {
    date: "Week 8",
    axelGear: 15250,
    flyWheel: 8450,
    finalDriveGear: 3275,
    gearCase: 4380,
    shaftFinal: 6925,
  },
];

export const yearlyPriceData: PriceHistoryData[] = [
  {
    date: "Jan '25",
    axelGear: 13200,
    flyWheel: 9450,
    finalDriveGear: 2950,
    gearCase: 5050,
    shaftFinal: 6350,
  },
  {
    date: "Feb '25",
    axelGear: 13150,
    flyWheel: 9520,
    finalDriveGear: 2920,
    gearCase: 5100,
    shaftFinal: 6320,
  },
  {
    date: "Mar '25",
    axelGear: 13350,
    flyWheel: 9380,
    finalDriveGear: 2970,
    gearCase: 4980,
    shaftFinal: 6380,
  },
  {
    date: "Apr '25",
    axelGear: 13550,
    flyWheel: 9250,
    finalDriveGear: 3010,
    gearCase: 4890,
    shaftFinal: 6450,
  },
  {
    date: "May '25",
    axelGear: 13680,
    flyWheel: 9150,
    finalDriveGear: 3040,
    gearCase: 4820,
    shaftFinal: 6510,
  },
  {
    date: "Jun '25",
    axelGear: 13850,
    flyWheel: 9080,
    finalDriveGear: 3060,
    gearCase: 4780,
    shaftFinal: 6550,
  },
  {
    date: "Jul '25",
    axelGear: 13920,
    flyWheel: 9020,
    finalDriveGear: 3075,
    gearCase: 4750,
    shaftFinal: 6580,
  },
  {
    date: "Aug '25",
    axelGear: 14100,
    flyWheel: 8950,
    finalDriveGear: 3090,
    gearCase: 4720,
    shaftFinal: 6610,
  },
  {
    date: "Sep '25",
    axelGear: 14250,
    flyWheel: 8880,
    finalDriveGear: 3110,
    gearCase: 4680,
    shaftFinal: 6650,
  },
  {
    date: "Oct '25",
    axelGear: 14550,
    flyWheel: 8720,
    finalDriveGear: 3145,
    gearCase: 4590,
    shaftFinal: 6720,
  },
  {
    date: "Nov '25",
    axelGear: 14820,
    flyWheel: 8620,
    finalDriveGear: 3195,
    gearCase: 4510,
    shaftFinal: 6810,
  },
  {
    date: "Dec '25",
    axelGear: 15050,
    flyWheel: 8540,
    finalDriveGear: 3235,
    gearCase: 4445,
    shaftFinal: 6870,
  },
  {
    date: "Jan '26",
    axelGear: 15180,
    flyWheel: 8485,
    finalDriveGear: 3260,
    gearCase: 4405,
    shaftFinal: 6900,
  },
  {
    date: "Feb '26",
    axelGear: 15250,
    flyWheel: 8450,
    finalDriveGear: 3275,
    gearCase: 4380,
    shaftFinal: 6925,
  },
];
export const billOfMaterialsPriceItem3: BillOfMaterialsPriceItem[] = [...billOfMaterialsPriceItem1];
export const billOfMaterialsPriceItem4: BillOfMaterialsPriceItem[] = [...billOfMaterialsPriceItem2];
export const billOfMaterialsPriceItem5: BillOfMaterialsPriceItem[] = [...billOfMaterialsPriceItem1];
