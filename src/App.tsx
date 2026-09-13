import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { calculateDividend } from './calculations/dividends';
import { calculateSales } from './calculations/sales';
import { calculateSnowball, milestoneYear } from './calculations/snowball';
import { FxRateControl } from './components/FxRateControl';
import { taxRules } from './rules/taxRules';
import type { Currency, DividendInput, SnowballInput, SnowballYear, Trade } from './types';

const currencies: Currency[] = ['PLN', 'EUR', 'USD', 'GBP'];
const githubUrl = 'https://github.com/matswiszcz-git/investor-tools-pl';
const pln = (value: number) => value.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 2 });
const shortPln = (value: number) => `${Math.round(value).toLocaleString('pl-PL')} zł`;

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
}

function NumberField({ label, value, onChange, step = '0.01' }: NumberFieldProps) {
  return <label>{label}<input type="number" step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function PercentField({ label, value, onChange }: NumberFieldProps) {
  return <label>{label}<span className="percent-input"><input type="number" step="0.1" value={Number((value * 100).toFixed(6))} onChange={(event) => onChange(Number(event.target.value) / 100)} /><span aria-hidden="true">%</span></span></label>;
}

function Sources() {
  return <details className="disclosure"><summary>Źródła oficjalne <span>{taxRules.length} pozycji</span></summary><div className="sources">{taxRules.map((rule) => <a key={rule.id} href={rule.sourceUrl} target="_blank" rel="noreferrer"><strong>{rule.sourceTitle}</strong><span>{rule.description}</span><small>Rok {rule.taxYear} · sprawdzono {rule.checkedAt}</small></a>)}</div></details>;
}

function Methodology({ children }: { children: React.ReactNode }) {
  return <details className="disclosure"><summary>Jak to policzyliśmy?</summary><div className="methodology">{children}</div></details>;
}

function ToolPage({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <main><header className="tool-heading"><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></header>{children}<Sources /></main>;
}

const exampleTrades: Trade[] = [
  { id: 'B1', instrument: 'ETF', type: 'buy', date: '2026-01-05', quantity: 10, price: 100, currency: 'USD', fee: 2, fxRate: 0 },
  { id: 'S1', instrument: 'ETF', type: 'sell', date: '2026-06-05', quantity: 5, price: 120, currency: 'USD', fee: 2, fxRate: 0 },
];

function Sales() {
  const [trades, setTrades] = useState<Trade[]>(exampleTrades);
  const ratesReady = trades.length > 0 && trades.every((trade) => trade.fxRate > 0);
  const result = useMemo(() => {
    if (!ratesReady) return null;
    try { return calculateSales(trades); } catch { return null; }
  }, [ratesReady, trades]);
  const update = (index: number, key: keyof Trade, value: string | number) => setTrades((current) => current.map((trade, position) => position === index ? { ...trade, [key]: value } : trade));
  const addTrade = () => setTrades((current) => [...current, { id: crypto.randomUUID(), instrument: '', type: 'buy', date: '', quantity: 1, price: 0, currency: 'PLN', fee: 0, fxRate: 1 }]);

  return <ToolPage eyebrow="Rozliczenie PIT-38" title="Sprzedaż akcji i ETF" description="Oblicz orientacyjny wynik sprzedaży z kosztami, prowizjami, kursami NBP i dopasowaniem FIFO.">
    <section className="section-block"><div className="section-heading"><div><span>Krok 1</span><h2>Dane transakcji</h2></div><div className="toolbar"><button type="button" className="button-quiet" onClick={() => setTrades(exampleTrades.map((trade) => ({ ...trade })))}>Załaduj przykład</button><button type="button" className="button-quiet" onClick={() => setTrades([])}>Wyczyść</button></div></div>
      <div className="trade-list">{trades.map((trade, index) => <div className="trade-row" key={trade.id}><div className="trade-fields">
        <label>Typ<select value={trade.type} onChange={(event) => update(index, 'type', event.target.value)}><option value="buy">Kupno</option><option value="sell">Sprzedaż</option></select></label>
        <label className="field-instrument">Instrument<input value={trade.instrument} placeholder="np. VWCE" onChange={(event) => update(index, 'instrument', event.target.value)} /></label>
        <label>Data<input type="date" value={trade.date} onChange={(event) => update(index, 'date', event.target.value)} /></label>
        <NumberField label="Ilość" value={trade.quantity} onChange={(value) => update(index, 'quantity', value)} />
        <NumberField label="Cena" value={trade.price} onChange={(value) => update(index, 'price', value)} />
        <label>Waluta<select value={trade.currency} onChange={(event) => update(index, 'currency', event.target.value as Currency)}>{currencies.map((currency) => <option key={currency}>{currency}</option>)}</select></label>
        <NumberField label="Prowizja" value={trade.fee} onChange={(value) => update(index, 'fee', value)} />
        <button type="button" className="remove-button" aria-label={`Usuń transakcję ${index + 1}`} onClick={() => setTrades((current) => current.filter((_, position) => position !== index))}>Usuń</button>
      </div><FxRateControl currency={trade.currency} date={trade.date} rate={trade.fxRate} onRateChange={(rate, details) => setTrades((current) => current.map((item, position) => position === index ? { ...item, fxRate: rate, fxEffectiveDate: details.effectiveDate, fxManual: details.manual } : item))} /></div>)}</div>
      {trades.length === 0 && <p className="empty-state">Dodaj pierwszą transakcję albo załaduj przykład.</p>}
      <button type="button" className="button-primary" onClick={addTrade}>+ Dodaj transakcję</button>
    </section>
    <section className={`result-panel ${result && result.profit < 0 ? 'result-panel--loss' : ''}`}><div className="result-heading"><span>Krok 2</span><h2>Wynik</h2><p>Wynik orientacyjny dla wprowadzonych transakcji.</p></div>{result ? <><div className="result-grid"><Result label="Przychód" value={pln(result.revenue)} /><Result label="Koszt" value={pln(result.cost)} /><Result label="Zysk / strata" value={pln(result.profit)} emphasis /><Result label="Szacowany podatek 19%" value={pln(result.tax)} emphasis /></div></> : <p className="result-pending">{ratesReady ? 'Sprawdź, czy sprzedaż ma wystarczające partie zakupu.' : 'Wynik pojawi się po uzupełnieniu transakcji i kursów NBP.'}</p>}</section>
    <Methodology><p>Każda sprzedaż pomniejsza najstarszą możliwą do zidentyfikowania partię instrumentu (FIFO). Koszt zakupu obejmuje proporcjonalną prowizję i historyczny kurs z dnia kosztu; przychód pomniejsza prowizja sprzedaży według kursu dla sprzedaży.</p>{result?.matches.map((match, index) => <p className="match" key={index}>Partia {match.buyId} → {match.sellId}: {match.quantity} szt. · koszt {pln(match.costPln)} · przychód {pln(match.proceedsPln)}</p>)}</Methodology>
  </ToolPage>;
}

function Dividends() {
  const [input, setInput] = useState<DividendInput>({ country: 'USA', date: '2026-05-15', gross: 100, currency: 'USD', foreignWithholding: 15, creditableForeignTax: 15, fxRate: 0 });
  const result = input.fxRate > 0 ? calculateDividend(input) : null;
  return <ToolPage eyebrow="Dochody zagraniczne" title="Zagraniczna dywidenda" description="Przelicz dywidendę po kursie NBP i oszacuj polski podatek z limitem odliczenia.">
    <section className="section-block"><div className="section-heading"><div><span>Krok 1</span><h2>Dane dywidendy</h2></div></div><div className="dividend-form">
      <label>Kraj<input value={input.country} onChange={(event) => setInput({ ...input, country: event.target.value })} /></label>
      <label>Data<input type="date" value={input.date} onChange={(event) => setInput({ ...input, date: event.target.value })} /></label>
      <NumberField label="Kwota brutto" value={input.gross} onChange={(gross) => setInput({ ...input, gross })} />
      <label>Waluta<select value={input.currency} onChange={(event) => setInput({ ...input, currency: event.target.value as Currency })}>{currencies.map((currency) => <option key={currency}>{currency}</option>)}</select></label>
      <NumberField label="Podatek pobrany za granicą" value={input.foreignWithholding} onChange={(foreignWithholding) => setInput({ ...input, foreignWithholding })} />
      <NumberField label="Kwota kwalifikowana do odliczenia" value={input.creditableForeignTax ?? 0} onChange={(creditableForeignTax) => setInput({ ...input, creditableForeignTax })} />
    </div><FxRateControl currency={input.currency} date={input.date} rate={input.fxRate} onRateChange={(rate, details) => setInput((current) => ({ ...current, fxRate: rate, fxEffectiveDate: details.effectiveDate, fxManual: details.manual }))} /><p className="notice">Kalkulator nie stosuje automatycznie umów podatkowych. Zweryfikuj właściwą umowę o unikaniu podwójnego opodatkowania i dopuszczalny limit odliczenia.</p></section>
    <section className="result-panel"><div className="result-heading"><span>Krok 2</span><h2>Wynik</h2><p>Wynik orientacyjny dla wprowadzonej dywidendy.</p></div>{result ? <div className="result-grid result-grid--five"><Result label="Brutto w PLN" value={pln(result.grossPln)} /><Result label="Polski podatek 19%" value={pln(result.polishTax)} /><Result label="Odliczenie" value={pln(result.credit)} /><Result label="Dopłata w Polsce" value={pln(result.due)} emphasis /><Result label="Efektywne opodatkowanie" value={`${(result.effectiveRate * 100).toFixed(2)}%`} /></div> : <p className="result-pending">Wynik pojawi się po ustaleniu kursu.</p>}</section>
    <Methodology><p>Kwotę brutto mnożymy przez historyczny kurs NBP, a następnie przez 19%. Od polskiego podatku odejmujemy zadeklarowaną kwotę kwalifikowaną do odliczenia, nie więcej niż wysokość polskiego podatku.</p></Methodology>
  </ToolPage>;
}

const initialScenario: SnowballInput = { initial: 100000, monthly: 2000, contributionGrowth: .03, priceGrowth: .05, yield: .04, dividendGrowth: .03, taxRate: .19, reinvest: true, inflation: .025, years: 20 };

function Scenario({ name, value, onChange }: { name: string; value: SnowballInput; onChange: (value: SnowballInput) => void }) {
  const set = (key: keyof SnowballInput, next: number | boolean) => onChange({ ...value, [key]: next });
  return <section className="scenario"><div className="scenario-title"><span>Scenariusz</span><h3>{name}</h3></div>
    <fieldset><legend>Kapitał</legend><div className="scenario-fields"><NumberField label="Kapitał początkowy" value={value.initial} onChange={(next) => set('initial', next)} /><NumberField label="Wpłata miesięczna" value={value.monthly} onChange={(next) => set('monthly', next)} /><PercentField label="Wzrost wpłat" value={value.contributionGrowth} onChange={(next) => set('contributionGrowth', next)} /></div></fieldset>
    <fieldset><legend>Rynek</legend><div className="scenario-fields"><PercentField label="Wzrost ceny" value={value.priceGrowth} onChange={(next) => set('priceGrowth', next)} /><PercentField label="Stopa dywidendy" value={value.yield} onChange={(next) => set('yield', next)} /><PercentField label="Wzrost dywidendy" value={value.dividendGrowth} onChange={(next) => set('dividendGrowth', next)} /></div></fieldset>
    <fieldset><legend>Założenia</legend><div className="scenario-fields"><PercentField label="Podatek" value={value.taxRate} onChange={(next) => set('taxRate', next)} /><PercentField label="Inflacja" value={value.inflation} onChange={(next) => set('inflation', next)} /><NumberField label="Liczba lat" value={value.years} step="1" onChange={(next) => set('years', next)} /><label className="toggle"><input type="checkbox" checked={value.reinvest} onChange={(event) => set('reinvest', event.target.checked)} /><span>Reinwestowanie dywidend</span></label></div></fieldset>
  </section>;
}

function SnowballSummary({ name, row }: { name: string; row: SnowballYear }) {
  return <div className="scenario-result"><span>Scenariusz {name}</span><strong>{pln(row.portfolio)}</strong><dl><div><dt>Suma wpłat</dt><dd>{pln(row.contributions)}</dd></div><div><dt>Dywidenda netto / mies.</dt><dd>{pln(row.monthlyIncome)}</dd></div><div><dt>Realnie po inflacji</dt><dd>{pln(row.realPortfolio)}</dd></div></dl></div>;
}

function Snowball() {
  const [scenarioA, setScenarioA] = useState(initialScenario);
  const [scenarioB, setScenarioB] = useState({ ...initialScenario, monthly: 3000 });
  const rowsA = calculateSnowball(scenarioA);
  const rowsB = calculateSnowball(scenarioB);
  const finalA = rowsA.at(-1)!;
  const finalB = rowsB.at(-1)!;
  const chartData = rowsA.map((row, index) => ({ year: row.year, A: row.portfolio, B: rowsB[index]?.portfolio }));
  return <ToolPage eyebrow="Symulacja długoterminowa" title="Dividend Snowball" description="Porównaj dwa scenariusze budowania portfela i dochodu z dywidend w wartościach nominalnych i realnych.">
    <section className="section-block"><div className="section-heading"><div><span>Krok 1</span><h2>Założenia</h2></div></div><div className="scenarios"><Scenario name="A" value={scenarioA} onChange={setScenarioA} /><Scenario name="B" value={scenarioB} onChange={setScenarioB} /></div></section>
    <section className="result-panel"><div className="result-heading"><span>Krok 2</span><h2>Porównanie wyników</h2><p>Wartości na koniec wybranego okresu.</p></div><div className="scenario-results"><SnowballSummary name="A" row={finalA} /><SnowballSummary name="B" row={finalB} /></div>
      <div className="chart"><ResponsiveContainer><LineChart data={chartData} margin={{ top: 12, right: 16, left: 12, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="year" tickLine={false} /><YAxis width={84} tickFormatter={shortPln} tickLine={false} /><Tooltip formatter={(value: number) => pln(value)} labelFormatter={(year) => `Rok ${year}`} /><Legend /><Line name="Scenariusz A" dataKey="A" stroke="#176b55" strokeWidth={2.5} dot={false} isAnimationActive={false} /><Line name="Scenariusz B" dataKey="B" stroke="#9a6b2f" strokeWidth={2.5} dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></div>
      <div className="milestones"><h3>Dochód netto miesięcznie — milestones</h3><div>{[500, 1000, 3000, 5000].map((amount) => <article key={amount}><span>{pln(amount)}</span><strong>{milestoneYear(rowsA, amount) ? `rok ${milestoneYear(rowsA, amount)}` : 'poza horyzontem'}</strong></article>)}</div></div>
    </section>
    <Methodology><p>Model miesięczny śledzi osobno cenę jednostki, liczbę jednostek i dywidendę na jednostkę. Wpłaty oraz wyłącznie dywidenda netto kupują jednostki po bieżącej cenie, więc nie występuje podwójne liczenie. Wartość realna jest dyskontowana inflacją.</p></Methodology>
    <details className="disclosure yearly-table"><summary>Pokaż tabelę roczną <span>{rowsA.length} lat · scenariusz A</span></summary><div className="table-scroll"><table><thead><tr><th>Rok</th><th>Portfel</th><th>Wpłaty</th><th>Wzrost</th><th>Dywidendy brutto / netto</th><th>Podatek</th><th>Reinwestycje</th><th>Dochód / mies.</th><th>Realnie</th></tr></thead><tbody>{rowsA.map((row) => <tr key={row.year}><td>{row.year}</td><td>{pln(row.portfolio)}</td><td>{pln(row.contributions)}</td><td>{pln(row.capitalGrowth)}</td><td>{pln(row.grossDividends)} / {pln(row.netDividends)}</td><td>{pln(row.tax)}</td><td>{pln(row.reinvested)}</td><td>{pln(row.monthlyIncome)}</td><td>{pln(row.realPortfolio)}</td></tr>)}</tbody></table></div></details>
  </ToolPage>;
}

function Result({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className={emphasis ? 'result-item result-item--emphasis' : 'result-item'}><span>{label}</span><strong>{value}</strong></div>;
}

export function App() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { full: 'Sprzedaż akcji i ETF', short: 'Sprzedaż' },
    { full: 'Zagraniczna dywidenda', short: 'Dywidenda' },
    { full: 'Dividend Snowball', short: 'Snowball' },
  ];
  return <div className="app-shell"><header className="topbar"><div className="topbar-inner"><a className="brand" href="/">Investor Tools <strong>PL</strong></a><div className="trust-note">Dane finansowe pozostają w tej przeglądarce</div></div></header><nav className="tabs" aria-label="Narzędzia"><div>{tabs.map((tab, index) => <button type="button" className={activeTab === index ? 'active' : ''} aria-label={tab.full} aria-current={activeTab === index ? 'page' : undefined} onClick={() => setActiveTab(index)} key={tab.full}><span className="tab-full">{tab.full}</span><span className="tab-short">{tab.short}</span></button>)}</div></nav>{activeTab === 0 ? <Sales /> : activeTab === 1 ? <Dividends /> : <Snowball />}<footer><div><span>Open Source · Apache-2.0</span><a href={githubUrl} target="_blank" rel="noreferrer">Zobacz kod na GitHubie</a></div><p>Narzędzie informacyjne — nie jest poradą podatkową ani inwestycyjną.</p></footer></div>;
}
