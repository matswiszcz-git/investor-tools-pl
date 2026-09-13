import type {Currency,FxRate} from '../types';
export interface HttpClient {get(url:string):Promise<{rates:{mid:number;effectiveDate:string}[]}>}
export const previousCalendarDay=(iso:string)=>{const d=new Date(`${iso}T12:00:00Z`);d.setUTCDate(d.getUTCDate()-1);return d.toISOString().slice(0,10)};
export class NbpAdapter {constructor(private http:HttpClient,private base='https://api.nbp.pl/api/exchangerates/rates/a'){}
 async previousBusinessRate(currency:Currency,date:string):Promise<FxRate>{if(currency==='PLN')return{currency,rate:1,effectiveDate:previousCalendarDay(date)};let day=previousCalendarDay(date);for(let attempt=0;attempt<7;attempt++){try{const data=await this.http.get(`${this.base}/${currency.toLowerCase()}/${day}/?format=json`);const rate=data.rates[0];if(rate)return{currency,rate:rate.mid,effectiveDate:rate.effectiveDate}}catch(e){if(!(e instanceof Error)||!e.message.includes('404'))throw new Error('Nie udało się pobrać kursu NBP')}day=previousCalendarDay(day)}throw new Error('Brak tabeli NBP w wymaganym okresie')}
}
export const browserHttp:HttpClient={async get(url){const r=await fetch(url);if(!r.ok)throw new Error(String(r.status));return r.json() as Promise<{rates:{mid:number;effectiveDate:string}[]}>}};
