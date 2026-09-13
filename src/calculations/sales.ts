import type {MatchedLot,SaleResult,Trade} from '../types';
const money=(n:number)=>Math.round((n+Number.EPSILON)*100)/100;
export function calculateSales(trades:Trade[]):SaleResult{
 const sorted=[...trades].sort((a,b)=>a.date.localeCompare(b.date)); const lots=new Map<string,{trade:Trade;left:number}[]>(); const matches:MatchedLot[]=[];
 let revenue=0,cost=0;
 for(const t of sorted){if(t.quantity<=0||t.price<0||t.fee<0||t.fxRate<=0) throw new Error('Nieprawidłowa transakcja'); const key=t.instrument.trim().toUpperCase();
  if(t.type==='buy'){const a=lots.get(key)??[];a.push({trade:t,left:t.quantity});lots.set(key,a);continue}
  let remaining=t.quantity;const queue=lots.get(key)??[];const saleGross=t.quantity*t.price*t.fxRate;revenue+=saleGross-t.fee*t.fxRate;
  while(remaining>1e-10){const lot=queue.find(x=>x.left>1e-10);if(!lot) throw new Error(`Brak partii zakupu dla ${t.instrument}`);const qty=Math.min(remaining,lot.left);const unitCost=(lot.trade.quantity*lot.trade.price+lot.trade.fee)/lot.trade.quantity*lot.trade.fxRate;const matchedCost=qty*unitCost;const matchedProceeds=qty/t.quantity*(saleGross-t.fee*t.fxRate);cost+=matchedCost;matches.push({buyId:lot.trade.id,sellId:t.id,quantity:qty,costPln:money(matchedCost),proceedsPln:money(matchedProceeds)});lot.left-=qty;remaining-=qty}
 }
 revenue=money(revenue);cost=money(cost);const profit=money(revenue-cost);return{revenue,cost,profit,tax:money(Math.max(0,profit)*.19),matches};
}
