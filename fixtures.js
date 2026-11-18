// Add the published Ljiljan squad to a fixture as squad: [player names].
const fixtures = [
  {
    "id": "141423",
    "date": "2027-01-30T13:00",
    "opponent": "Suså IF",
    "home": false,
    "competition": "VinterBOLD"
  },
  {
    "id": "141397",
    "date": "2027-02-06T13:00",
    "opponent": "IF Frem Bjæverskov",
    "home": false,
    "competition": "VinterBOLD"
  },
  {
    "id": "141401",
    "date": "2027-02-13T13:00",
    "opponent": "Førslev IF",
    "home": true,
    "competition": "VinterBOLD"
  },
  {
    "id": "141407",
    "date": "2027-02-27T14:00",
    "opponent": "FC Storebælt",
    "home": false,
    "competition": "VinterBOLD"
  },
  {
    "id": "141409",
    "date": "2027-03-06T13:00",
    "opponent": "Bårse IF",
    "home": true,
    "competition": "VinterBOLD"
  },
  {
    "id": "141414",
    "date": "2027-03-13T13:00",
    "opponent": "Sct. Jørgens IF",
    "home": true,
    "competition": "VinterBOLD"
  }
];
const pastFixtures = [
  {
    "id": "178033",
    "day": "01.11.2026",
    "home": "Østmøn SGI",
    "score": "Hjemmehold taberdømt",
    "away": "F.K. Ljiljan",
    "competition": "Serie 5"
  },
  {
    "id": "178178",
    "day": "25.10.2026",
    "home": "Rønnede IF",
    "score": "1-3",
    "away": "F.K. Ljiljan",
    "competition": "Serie 5"
  },
  {
    "id": "146594",
    "day": "23.10.2026",
    "home": "Herlufsholm GF",
    "score": "4-1",
    "away": "F.K. Ljiljan",
    "competition": "Serie 3"
  },
  {
    "id": "178172",
    "day": "18.10.2026",
    "home": "F.K. Ljiljan",
    "score": "Hjemmehold taberdømt",
    "away": "Næstved FC 77",
    "competition": "Serie 5"
  },
  {
    "id": "146585",
    "day": "17.10.2026",
    "home": "F.K. Ljiljan",
    "score": "2-3",
    "away": "Haslev FC",
    "competition": "Serie 3"
  },
  {
    "id": "178170",
    "day": "11.10.2026",
    "home": "Faxe Ladeplads IF",
    "score": "3-2",
    "away": "F.K. Ljiljan",
    "competition": "Serie 5"
  },
  {
    "id": "146577",
    "day": "06.10.2026",
    "home": "Karise IK",
    "score": "5-1",
    "away": "F.K. Ljiljan",
    "competition": "Serie 3"
  },
  {
    "id": "178161",
    "day": "04.10.2026",
    "home": "F.K. Ljiljan",
    "score": "1-5",
    "away": "Ørslev GIF (V)",
    "competition": "Serie 5"
  },
  {
    "id": "146134",
    "day": "03.10.2026",
    "home": "F.K. Ljiljan",
    "score": "4-2",
    "away": "Store Heddinge BK",
    "competition": "Serie 3"
  },
  {
    "id": "146128",
    "day": "27.09.2026",
    "home": "Ny Anadolu",
    "score": "2-4",
    "away": "F.K. Ljiljan",
    "competition": "Serie 3"
  },
  {
    "id": "178154",
    "day": "25.09.2026",
    "home": "Mern UIF",
    "score": "3-6",
    "away": "F.K. Ljiljan",
    "competition": "Serie 5"
  },
  {
    "id": "178149",
    "day": "20.09.2026",
    "home": "F.K. Ljiljan",
    "score": "2-4",
    "away": "Lynge-Broby IF",
    "competition": "Serie 5"
  },
  {
    "id": "146122",
    "day": "19.09.2026",
    "home": "F.K. Ljiljan",
    "score": "2-1",
    "away": "Toksværd Olstrup Fodbold",
    "competition": "Serie 3"
  },
  {
    "id": "146114",
    "day": "12.09.2026",
    "home": "Hårlev BK",
    "score": "4-2",
    "away": "F.K. Ljiljan",
    "competition": "Serie 3"
  },
  {
    "id": "178147",
    "day": "08.09.2026",
    "home": "Holmegaard GB",
    "score": "2-2",
    "away": "F.K. Ljiljan",
    "competition": "Serie 5"
  },
  {
    "id": "178041",
    "day": "06.09.2026",
    "home": "F.K. Ljiljan",
    "score": "0-3",
    "away": "Toksværd Olstrup Fodbold",
    "competition": "Serie 5"
  },
  {
    "id": "146107",
    "day": "05.09.2026",
    "home": "Vordingborg IF",
    "score": "4-1",
    "away": "F.K. Ljiljan",
    "competition": "Serie 3"
  },
  {
    "id": "146105",
    "day": "29.08.2026",
    "home": "F.K. Ljiljan",
    "score": "4-3",
    "away": "Næstved FC 77",
    "competition": "Serie 3"
  },
  {
    "id": "178035",
    "day": "27.08.2026",
    "home": "Langebæk Alliancen",
    "score": "1-2",
    "away": "F.K. Ljiljan",
    "competition": "Serie 5"
  },
  {
    "id": "146093",
    "day": "25.08.2026",
    "home": "F.K. Ljiljan",
    "score": "0-4",
    "away": "Førslev IF",
    "competition": "Serie 3"
  },
  {
    "id": "146098",
    "day": "22.08.2026",
    "home": "IF Svend Gønge",
    "score": "0-5",
    "away": "F.K. Ljiljan",
    "competition": "Serie 3"
  },
  {
    "id": "178022",
    "day": "12.08.2026",
    "home": "F.K. Ljiljan",
    "score": "2-3",
    "away": "Herlufsholm GF",
    "competition": "Serie 5"
  },
  {
    "id": "677720",
    "day": "14.06.2026",
    "home": "F.K. Ljiljan",
    "score": "2-1",
    "away": "Næstved FC 77",
    "competition": "Serie 3"
  },
  {
    "id": "312846",
    "day": "11.06.2026",
    "home": "F.K. Ljiljan",
    "score": "5-0",
    "away": "Bårse IF",
    "competition": "motionsrækken"
  },
  {
    "id": "677719",
    "day": "06.06.2026",
    "home": "Store Heddinge BK",
    "score": "3-2",
    "away": "F.K. Ljiljan",
    "competition": "Serie 3"
  },
  {
    "id": "312842",
    "day": "03.06.2026",
    "home": "FST",
    "score": "9-1",
    "away": "F.K. Ljiljan",
    "competition": "motionsrækken"
  },
  {
    "id": "626904",
    "day": "02.06.2026",
    "home": "F.K. Ljiljan",
    "score": "2-5",
    "away": "Såby Fodbold (DS)",
    "competition": "Oddset Pokalen"
  },
  {
    "id": "677708",
    "day": "31.05.2026",
    "home": "F.K. Ljiljan",
    "score": "6-2",
    "away": "Toksværd Olstrup Fodbold",
    "competition": "Serie 3"
  },
  {
    "id": "312836",
    "day": "28.05.2026",
    "home": "F.K. Ljiljan",
    "score": "4-3",
    "away": "Næstved FC 77",
    "competition": "motionsrækken"
  },
  {
    "id": "677702",
    "day": "24.05.2026",
    "home": "F.K. Ljiljan",
    "score": "2-4",
    "away": "Førslev IF",
    "competition": "Serie 3"
  },
  {
    "id": "301324",
    "day": "20.05.2026",
    "home": "F.K. Ljiljan",
    "score": "4-2",
    "away": "Tølløse BK (S3)",
    "competition": "Oddset Pokalen"
  },
  {
    "id": "312806",
    "day": "18.05.2026",
    "home": "Rønnede IF",
    "score": "4-2",
    "away": "F.K. Ljiljan",
    "competition": "motionsrækken"
  },
  {
    "id": "677701",
    "day": "13.05.2026",
    "home": "Haslev FC",
    "score": "2-3",
    "away": "F.K. Ljiljan",
    "competition": "Serie 3"
  },
  {
    "id": "312761",
    "day": "13.05.2026",
    "home": "F.K. Ljiljan",
    "score": "Hjemmehold taberdømt",
    "away": "Faxe BK",
    "competition": "motionsrækken"
  },
  {
    "id": "677675",
    "day": "10.05.2026",
    "home": "F.K. Ljiljan",
    "score": "1-3",
    "away": "Hastrup FC",
    "competition": "Serie 3"
  },
  {
    "id": "312757",
    "day": "07.05.2026",
    "home": "Roholte BK",
    "score": "1-5",
    "away": "F.K. Ljiljan",
    "competition": "motionsrækken"
  },
  {
    "id": "829739",
    "day": "06.05.2026",
    "home": "F.K. Ljiljan",
    "score": "Udehold taberdømt",
    "away": "Høng GF (S1)",
    "competition": "Oddset Pokalen"
  },
  {
    "id": "677619",
    "day": "05.05.2026",
    "home": "Holmegaard GB",
    "score": "2-2",
    "away": "F.K. Ljiljan",
    "competition": "Serie 3"
  },
  {
    "id": "312751",
    "day": "30.04.2026",
    "home": "F.K. Ljiljan",
    "score": "1-1",
    "away": "Sct. Jørgens IF",
    "competition": "motionsrækken"
  },
  {
    "id": "312746",
    "day": "23.04.2026",
    "home": "F.K. Ljiljan",
    "score": "0-8",
    "away": "FK Sydsjælland 05",
    "competition": "motionsrækken"
  },
  {
    "id": "582635",
    "day": "21.04.2026",
    "home": "F.K. Ljiljan",
    "score": "5-3",
    "away": "Ejby IF Fodbold (S2)",
    "competition": "Oddset Pokalen"
  },
  {
    "id": "677559",
    "day": "18.04.2026",
    "home": "Karise IK",
    "score": "4-4",
    "away": "F.K. Ljiljan",
    "competition": "Serie 3"
  },
  {
    "id": "312744",
    "day": "14.04.2026",
    "home": "Suså IF",
    "score": "Udehold taberdømt",
    "away": "F.K. Ljiljan",
    "competition": "motionsrækken"
  },
  {
    "id": "677550",
    "day": "12.04.2026",
    "home": "F.K. Ljiljan",
    "score": "0-3",
    "away": "Dalby GI (H)",
    "competition": "Serie 3"
  },
  {
    "id": "627880",
    "day": "08.04.2026",
    "home": "Dalmose FC (S4)",
    "score": "6-7",
    "away": "F.K. Ljiljan",
    "competition": "Oddset Pokalen"
  },
  {
    "id": "677420",
    "day": "03.04.2026",
    "home": "Suså IF",
    "score": "5-0",
    "away": "F.K. Ljiljan",
    "competition": "Serie 3"
  },
  {
    "id": "596015",
    "day": "25.10.2025",
    "home": "Møns FK",
    "score": "2-5",
    "away": "F.K. Ljiljan",
    "competition": "Serie 4"
  },
  {
    "id": "595951",
    "day": "22.10.2025",
    "home": "F.K. Ljiljan",
    "score": "4-3",
    "away": "Ny Anadolu",
    "competition": "Serie 4"
  },
  {
    "id": "596008",
    "day": "19.10.2025",
    "home": "F.K. Ljiljan",
    "score": "4-4",
    "away": "Herlufsholm GF",
    "competition": "Serie 4"
  },
  {
    "id": "596003",
    "day": "12.10.2025",
    "home": "F.K. Ljiljan",
    "score": "3-2",
    "away": "Nyråd/Langebæk Alliancen",
    "competition": "Serie 4"
  },
  {
    "id": "671908",
    "day": "09.10.2025",
    "home": "F.K. Ljiljan",
    "score": "2-1",
    "away": "Sierslev FC",
    "competition": "motionsrækken"
  },
  {
    "id": "595995",
    "day": "04.10.2025",
    "home": "Toksværd Olstrup Fodbold",
    "score": "Hjemmehold taberdømt",
    "away": "F.K. Ljiljan",
    "competition": "Serie 4"
  },
  {
    "id": "671900",
    "day": "29.09.2025",
    "home": "Rønnede IF",
    "score": "1-4",
    "away": "F.K. Ljiljan",
    "competition": "motionsrækken"
  },
  {
    "id": "595986",
    "day": "28.09.2025",
    "home": "F.K. Ljiljan",
    "score": "5-3",
    "away": "Faxe BK (1)",
    "competition": "Serie 4"
  },
  {
    "id": "671898",
    "day": "25.09.2025",
    "home": "F.K. Ljiljan",
    "score": "0-0",
    "away": "Sct. Jørgens IF",
    "competition": "motionsrækken"
  },
  {
    "id": "595981",
    "day": "20.09.2025",
    "home": "Karrebæk IF",
    "score": "1-7",
    "away": "F.K. Ljiljan",
    "competition": "Serie 4"
  },
  {
    "id": "671892",
    "day": "16.09.2025",
    "home": "Rødvig G&I",
    "score": "3-5",
    "away": "F.K. Ljiljan",
    "competition": "motionsrækken"
  },
  {
    "id": "595974",
    "day": "14.09.2025",
    "home": "F.K. Ljiljan",
    "score": "5-2",
    "away": "IF Svend Gønge",
    "competition": "Serie 4"
  },
  {
    "id": "671705",
    "day": "11.09.2025",
    "home": "F.K. Ljiljan",
    "score": "3-4",
    "away": "Bårse IF",
    "competition": "motionsrækken"
  },
  {
    "id": "595969",
    "day": "05.09.2025",
    "home": "Holmegaard GB",
    "score": "4-2",
    "away": "F.K. Ljiljan",
    "competition": "Serie 4"
  },
  {
    "id": "671700",
    "day": "02.09.2025",
    "home": "Suså IF",
    "score": "0-1",
    "away": "F.K. Ljiljan",
    "competition": "motionsrækken"
  },
  {
    "id": "595962",
    "day": "31.08.2025",
    "home": "F.K. Ljiljan",
    "score": "11-1",
    "away": "Næstved FC 77",
    "competition": "Serie 4"
  },
  {
    "id": "595956",
    "day": "22.08.2025",
    "home": "Sct. Jørgens IF",
    "score": "4-5",
    "away": "F.K. Ljiljan",
    "competition": "Serie 4"
  },
  {
    "id": "671688",
    "day": "21.08.2025",
    "home": "Hellested IF",
    "score": "2-2",
    "away": "F.K. Ljiljan",
    "competition": "motionsrækken"
  },
  {
    "id": "671685",
    "day": "14.08.2025",
    "home": "F.K. Ljiljan",
    "score": "9-2",
    "away": "Roholte BK",
    "competition": "motionsrækken"
  },
  {
    "id": "753964",
    "day": "22.06.2025",
    "home": "F.K. Ljiljan",
    "score": "1-8",
    "away": "Ishøj IF",
    "competition": "SM Serie 5"
  },
  {
    "id": "753936",
    "day": "19.06.2025",
    "home": "IF Frem Bjæverskov",
    "score": "2-3",
    "away": "F.K. Ljiljan",
    "competition": "SM Serie 5"
  },
  {
    "id": "590629",
    "day": "12.06.2025",
    "home": "F.K. Ljiljan",
    "score": "6-1",
    "away": "Østmøn SGI",
    "competition": "Serie 5"
  },
  {
    "id": "590611",
    "day": "25.05.2025",
    "home": "F.K. Ljiljan",
    "score": "13-1",
    "away": "Ørslev GIF (V)",
    "competition": "Serie 5"
  },
  {
    "id": "590599",
    "day": "11.05.2025",
    "home": "F.K. Ljiljan",
    "score": "4-1",
    "away": "Bårse IF",
    "competition": "Serie 5"
  },
  {
    "id": "590595",
    "day": "30.04.2025",
    "home": "FC4733",
    "score": "0-6",
    "away": "F.K. Ljiljan",
    "competition": "Serie 5"
  },
  {
    "id": "590587",
    "day": "27.04.2025",
    "home": "F.K. Ljiljan",
    "score": "2-0",
    "away": "Mern UIF",
    "competition": "Serie 5"
  },
  {
    "id": "590584",
    "day": "15.04.2025",
    "home": "Suså IF",
    "score": "1-3",
    "away": "F.K. Ljiljan",
    "competition": "Serie 5"
  },
  {
    "id": "590564",
    "day": "13.04.2025",
    "home": "F.K. Ljiljan",
    "score": "2-1",
    "away": "Sct. Jørgens IF",
    "competition": "Serie 5"
  },
  {
    "id": "588650",
    "day": "09.04.2025",
    "home": "F.K. Ljiljan",
    "score": "2-7",
    "away": "Østmøn SGI (S4A)",
    "competition": "Oddset Pokalen"
  },
  {
    "id": "590563",
    "day": "06.04.2025",
    "home": "Næstved FC 77",
    "score": "0-1",
    "away": "F.K. Ljiljan",
    "competition": "Serie 5"
  }
];
