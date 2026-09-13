import type { SnowballInput, SnowballYear } from '../types';

export function calculateSnowball(input: SnowballInput): SnowballYear[] {
  if (input.years < 1 || input.years > 80) throw new Error('Lata poza zakresem');

  let unitPrice = 1;
  let shares = input.initial / unitPrice;
  let dividendPerUnit = input.yield * unitPrice;
  let monthlyContribution = input.monthly;
  let contributions = input.initial;
  const rows: SnowballYear[] = [];
  const monthlyPriceGrowth = (1 + input.priceGrowth) ** (1 / 12) - 1;

  for (let year = 1; year <= input.years; year += 1) {
    let grossDividends = 0;
    let tax = 0;
    let reinvested = 0;
    let capitalGrowth = 0;

    for (let month = 0; month < 12; month += 1) {
      shares += monthlyContribution / unitPrice;
      contributions += monthlyContribution;

      const previousPrice = unitPrice;
      unitPrice *= 1 + monthlyPriceGrowth;
      capitalGrowth += shares * (unitPrice - previousPrice);

      const grossDividend = shares * dividendPerUnit / 12;
      const dividendTax = grossDividend * input.taxRate;
      const netDividend = grossDividend - dividendTax;
      grossDividends += grossDividend;
      tax += dividendTax;

      if (input.reinvest) {
        shares += netDividend / unitPrice;
        reinvested += netDividend;
      }
    }

    const portfolio = shares * unitPrice;
    const netDividends = grossDividends - tax;
    rows.push({
      year,
      portfolio,
      contributions,
      capitalGrowth,
      grossDividends,
      netDividends,
      tax,
      reinvested,
      monthlyIncome: netDividends / 12,
      realPortfolio: portfolio / (1 + input.inflation) ** year,
      unitPrice,
      shares,
      dividendPerUnit,
    });

    monthlyContribution *= 1 + input.contributionGrowth;
    dividendPerUnit *= 1 + input.dividendGrowth;
  }

  return rows;
}

export const milestoneYear = (rows: SnowballYear[], amount: number) =>
  rows.find((row) => row.monthlyIncome >= amount)?.year;
