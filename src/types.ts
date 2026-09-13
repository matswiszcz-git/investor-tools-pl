export type Currency='PLN'|'EUR'|'USD'|'GBP';
export interface FxRate { currency:Currency; rate:number; effectiveDate:string }
export interface Trade {id:string;instrument:string;type:'buy'|'sell';date:string;quantity:number;price:number;currency:Currency;fee:number;fxRate:number;fxEffectiveDate?:string;fxManual?:boolean}
export interface MatchedLot {buyId:string;sellId:string;quantity:number;costPln:number;proceedsPln:number}
export interface SaleResult {revenue:number;cost:number;profit:number;tax:number;matches:MatchedLot[]}
export interface DividendInput {country:string;date:string;gross:number;currency:Currency;foreignWithholding:number;creditableForeignTax?:number;fxRate:number;fxEffectiveDate?:string;fxManual?:boolean}
export interface DividendResult {grossPln:number;polishTax:number;credit:number;due:number;effectiveRate:number}
export interface SnowballInput {initial:number;monthly:number;contributionGrowth:number;priceGrowth:number;yield:number;dividendGrowth:number;taxRate:number;reinvest:boolean;inflation:number;years:number}
export interface SnowballYear {year:number;portfolio:number;contributions:number;capitalGrowth:number;grossDividends:number;netDividends:number;tax:number;reinvested:number;monthlyIncome:number;realPortfolio:number}
