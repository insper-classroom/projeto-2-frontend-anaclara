export const MOCK_RESULTS = [
  { symbol:"PETR4.SA", name:"Petrobras PN", exchange:"SAO" },
  { symbol:"VALE3.SA", name:"Vale ON", exchange:"SAO" },
  { symbol:"AAPL", name:"Apple Inc.", exchange:"NASDAQ" },
  { symbol:"MSFT", name:"Microsoft Corp.", exchange:"NASDAQ" }
];

export const META = {
  "PETR4.SA": { name:"Petrobras PN", mcap: 498_000_000_000 },
  "AAPL":     { name:"Apple Inc.",    mcap: 2_950_000_000_000 },
  "MSFT":     { name:"Microsoft",     mcap: 3_100_000_000_000 },
  "VALE3.SA": { name:"Vale ON",       mcap: 330_000_000_000 }
};

export function mockSeries(days=30, start=38, vol=3){
  const data=[]; let p=start;
  for(let i=0;i<days;i++){ p=Math.max(1, p+(Math.random()-0.5)*vol); data.push(Number(p.toFixed(2))); }
  return data;
}
