import type {SnowballInput,SnowballYear} from '../types';
export function calculateSnowball(i:SnowballInput):SnowballYear[]{if(i.years<1||i.years>80)throw new Error('Lata poza zakresem');let portfolio=i.initial,contributions=i.initial,monthly=i.monthly,currentYield=i.yield;const rows:SnowballYear[]=[];
 for(let y=1;y<=i.years;y++){let gross=0,tax=0,reinvested=0,growth=0,annualContrib=0;for(let m=0;m<12;m++){const contribution=monthly;portfolio+=contribution;contributions+=contribution;annualContrib+=contribution;const g=portfolio*((1+i.priceGrowth)**(1/12)-1);portfolio+=g;growth+=g;const d=portfolio*currentYield/12;gross+=d;const dt=d*i.taxRate;tax+=dt;if(i.reinvest){portfolio+=d-dt;reinvested+=d-dt}}
 const net=gross-tax;rows.push({year:y,portfolio,contributions,capitalGrowth:growth,grossDividends:gross,netDividends:net,tax,reinvested,monthlyIncome:net/12,realPortfolio:portfolio/(1+i.inflation)**y});monthly*=1+i.contributionGrowth;currentYield*=1+i.dividendGrowth}
 return rows;
}
export const milestoneYear=(rows:SnowballYear[],amount:number)=>rows.find(r=>r.monthlyIncome>=amount)?.year;
