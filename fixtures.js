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
    "score": "Aflyst",
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
    "score": "Aflyst",
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
  }
];
