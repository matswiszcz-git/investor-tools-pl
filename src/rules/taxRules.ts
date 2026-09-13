export interface TaxRule {id:string;taxYear:number;description:string;sourceTitle:string;sourceUrl:string;checkedAt:string}
const checkedAt='2026-09-13';
export const taxRules:TaxRule[]=[
{id:'capital-gains-rate',taxYear:2026,description:'Dochód z odpłatnego zbycia papierów wartościowych podlega stawce 19% i rozliczeniu w PIT-38.',sourceTitle:'Ustawa o PIT, art. 30b; PIT-38',sourceUrl:'https://eli.gov.pl/eli/DU/1991/350/ogl',checkedAt},
{id:'acquisition-costs',taxYear:2026,description:'Dochód to przychód pomniejszony o udokumentowane koszty nabycia; prowizje bezpośrednio związane z transakcją uwzględnia się odpowiednio w wartości sprzedaży lub koszcie.',sourceTitle:'Ustawa o PIT, art. 23 ust. 1 pkt 38 i art. 30b',sourceUrl:'https://eli.gov.pl/eli/DU/1991/350/ogl',checkedAt},
{id:'fx-translation',taxYear:2026,description:'Kwoty w walutach przelicza się po średnim kursie NBP z ostatniego dnia roboczego poprzedzającego dzień uzyskania przychodu albo poniesienia kosztu.',sourceTitle:'Ustawa o PIT, art. 11a',sourceUrl:'https://eli.gov.pl/eli/DU/1991/350/ogl',checkedAt},
{id:'fifo-identification',taxYear:2026,description:'FIFO stosuje się, gdy nie jest możliwa identyfikacja zbywanych papierów; zasadę stosuje się odrębnie dla każdego rachunku papierów wartościowych.',sourceTitle:'Ustawa o PIT, art. 30b ust. 7 w zw. z art. 24 ust. 10',sourceUrl:'https://eli.gov.pl/eli/DU/1991/350/ogl',checkedAt},
{id:'foreign-dividend',taxYear:2026,description:'Dywidendy podlegają 19% podatkowi; podatek zapłacony za granicą można odliczyć nie wyżej niż do wysokości polskiego podatku od tego przychodu.',sourceTitle:'Ustawa o PIT, art. 30a ust. 1 pkt 4 i ust. 9',sourceUrl:'https://eli.gov.pl/eli/DU/1991/350/ogl',checkedAt},
{id:'nbp-table-a',taxYear:2026,description:'Kurs średni waluty pobierany jest z tabeli A NBP dla właściwego poprzedniego dnia roboczego.',sourceTitle:'NBP Web API — kursy walut',sourceUrl:'https://api.nbp.pl/',checkedAt}
];
