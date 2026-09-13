import{describe,it,expect}from'vitest';import{calculateSales}from'../calculations/sales';import{calculateDividend}from'../calculations/dividends';import{calculateSnowball,milestoneYear}from'../calculations/snowball';import type{Trade}from'../types';
const trade=(p:Partial<Trade>):Trade=>({id:'1',instrument:'X',type:'buy',date:'2026-01-01',quantity:10,price:10,currency:'PLN',fee:0,fxRate:1,...p});
describe('sprzedaż',()=>{it('profit i podatek',()=>expect(calculateSales([trade({}),trade({id:'s',type:'sell',date:'2026-02-01',price:20})])).toMatchObject({profit:100,tax:19}));it('loss',()=>expect(calculateSales([trade({}),trade({id:'s',type:'sell',date:'2026-02-01',price:5})]).tax).toBe(0));it('zero',()=>expect(calculateSales([trade({}),trade({id:'s',type:'sell',date:'2026-02-01'})]).profit).toBe(0));it('partial sale',()=>expect(calculateSales([trade({}),trade({id:'s',type:'sell',date:'2026-02-01',quantity:4,price:20})]).cost).toBe(40));it('multiple lots FIFO',()=>{const r=calculateSales([trade({id:'a',quantity:5}),trade({id:'b',date:'2026-01-02',quantity:5,price:20}),trade({id:'s',type:'sell',date:'2026-02-01',quantity:7,price:30})]);expect(r.matches.map(x=>[x.buyId,x.quantity])).toEqual([['a',5],['b',2]])});it('fees',()=>expect(calculateSales([trade({fee:10}),trade({id:'s',type:'sell',date:'2026-02-01',price:20,fee:10})]).profit).toBe(80));it('FX per transaction',()=>expect(calculateSales([trade({fxRate:4}),trade({id:'s',type:'sell',date:'2026-02-01',price:20,fxRate:3})]).profit).toBe(200));it('rejects missing lots',()=>expect(()=>calculateSales([trade({type:'sell'})])).toThrow())});
describe('dywidendy',()=>{const d=(foreignWithholding:number,creditableForeignTax=foreignWithholding)=>calculateDividend({country:'US',date:'2026-01-01',gross:100,currency:'PLN',foreignWithholding,creditableForeignTax,fxRate:1});it('foreign tax 0',()=>expect(d(0).due).toBe(19));it('lower',()=>expect(d(10).due).toBe(9));it('equal',()=>expect(d(19).due).toBe(0));it('higher than credit limit',()=>expect(d(30).credit).toBe(19))});
describe('snowball',()=>{const x={initial:1000,monthly:100,contributionGrowth:0,priceGrowth:.05,yield:.04,dividendGrowth:0,taxRate:.19,reinvest:true,inflation:.02,years:2};it('reinvest ON exceeds OFF',()=>expect(calculateSnowball(x).at(-1)!.portfolio).toBeGreaterThan(calculateSnowball({...x,reinvest:false}).at(-1)!.portfolio));it('zero dividend',()=>expect(calculateSnowball({...x,yield:0})[0].grossDividends).toBe(0));it('zero appreciation',()=>expect(calculateSnowball({...x,priceGrowth:0})[0].capitalGrowth).toBe(0));it('contribution growth',()=>expect(calculateSnowball({...x,contributionGrowth:.1})[1].contributions).toBeGreaterThan(3400));it('dividend growth',()=>expect(calculateSnowball({...x,dividendGrowth:.2})[1].grossDividends).toBeGreaterThan(calculateSnowball(x)[1].grossDividends));it('inflation lowers real value',()=>expect(calculateSnowball(x)[1].realPortfolio).toBeLessThan(calculateSnowball(x)[1].portfolio));it('scenario comparison and milestones',()=>{const a=calculateSnowball(x),b=calculateSnowball({...x,monthly:200});expect(b[1].portfolio).toBeGreaterThan(a[1].portfolio);expect(milestoneYear(a,1)).toBe(1)})});

describe('snowball — niezależność ceny i dywidendy na jednostkę', () => {
  const base = {
    initial: 1000,
    monthly: 0,
    contributionGrowth: 0,
    priceGrowth: 0,
    yield: 0.04,
    dividendGrowth: 0,
    taxRate: 0.19,
    reinvest: false,
    inflation: 0,
    years: 2,
  };

  it('A: sam wzrost ceny nie zwiększa dywidendy na jednostkę', () => {
    const rows = calculateSnowball({ ...base, priceGrowth: 0.1 });
    expect(rows[0].dividendPerUnit).toBeCloseTo(0.04);
    expect(rows[1].dividendPerUnit).toBeCloseTo(0.04);
  });

  it('B: wzrost dywidendy zwiększa dywidendę na jednostkę, ale nie cenę', () => {
    const rows = calculateSnowball({ ...base, dividendGrowth: 0.1 });
    expect(rows[1].dividendPerUnit).toBeCloseTo(0.044);
    expect(rows[1].unitPrice).toBeCloseTo(1);
  });

  it('C: jednoczesny wzrost ceny i dywidendy nie powoduje double counting', () => {
    const rows = calculateSnowball({ ...base, priceGrowth: 0.1, dividendGrowth: 0.1 });
    expect(rows[1].portfolio).toBeCloseTo(1210);
    expect(rows[1].grossDividends).toBeCloseTo(44);
    expect(rows[1].dividendPerUnit).toBeCloseTo(0.044);
  });

  it('D: reinwestowanie netto kupuje jednostki i zwiększa portfel', () => {
    const withoutReinvestment = calculateSnowball(base).at(-1)!;
    const withReinvestment = calculateSnowball({ ...base, reinvest: true }).at(-1)!;
    expect(withReinvestment.shares).toBeGreaterThan(withoutReinvestment.shares);
    expect(withReinvestment.portfolio).toBeGreaterThan(withoutReinvestment.portfolio);
    expect(withoutReinvestment.reinvested).toBe(0);
  });
});
