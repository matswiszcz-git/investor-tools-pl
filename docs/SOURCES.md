# Oficjalne źródła — ruleset 2026

Weryfikację przeprowadzono 13.09.2026 wyłącznie na podstawie źródeł administracji publicznej.

## Ustawa o PIT

- [Tekst jednolity ustawy o podatku dochodowym od osób fizycznych — Dz.U. 2026 poz. 592](https://eli.gov.pl/eli/DU/2026/592/ogl), ogłoszony 30.04.2026, według metadanych ELI uwzględniający stan prawny na 1.04.2026. Podstawa reguł: art. 11a (przeliczanie walut), art. 23 ust. 1 pkt 38 (wydatki na nabycie), art. 24 ust. 10 wraz z art. 30b ust. 7 (FIFO przy braku identyfikacji, odrębnie dla rachunku), art. 30a ust. 1 pkt 4 i ust. 9 (dywidenda zagraniczna i limit odliczenia) oraz art. 30b (19% i sprzedaż papierów wartościowych).
- [Nowelizacja — Dz.U. 2026 poz. 779](https://eli.gov.pl/eli/DU/2026/779/ogl) zmienia art. 24a ustawy o PIT. Ustawa weszła w życie 1.07.2026, z wyjątkiem wskazanych w jej art. 5 przepisów obowiązujących od 16.06.2026. Nie zmienia art. 11a, art. 24 ust. 10, art. 30a ani art. 30b, na których oparto kalkulatory.
- [Nowelizacja — Dz.U. 2026 poz. 846](https://eli.gov.pl/eli/DU/2026/846/ogl) w części dotyczącej PIT zmienia art. 25b, art. 30f i art. 31d. Zmiany PIT wynikające z art. 4 tej nowelizacji wchodzą w życie 1.10.2026; na dzień weryfikacji 13.09.2026 nie obowiązywały. Nie zmieniają art. 11a, art. 24 ust. 10, art. 30a ani art. 30b.

Powyższa weryfikacja późniejszych zmian jest ograniczona do wpływu Dz.U. 2026 poz. 779 i 846 na artykuły stanowiące podstawę reguł V1. Nie stanowi ogólnego potwierdzenia braku innych zmian prawa po wskazanej dacie.

## Formularz i kursy

- [Formularze PIT — podatki.gov.pl](https://www.podatki.gov.pl/pit/formularze-do-druku-pit/): oficjalna publikacja formularzy, w tym PIT-38.
- [NBP Web API](https://api.nbp.pl/): oficjalny endpoint tabel średnich A. Aplikacja odpytuje konkretną datę poprzedzającą zdarzenie i cofa się po odpowiedzi 404, aby znaleźć ostatnią opublikowaną tabelę.

Maszynowo czytelny, wersjonowany rejestr (`id`, `taxYear`, `description`, `sourceTitle`, `sourceUrl`, `checkedAt`) znajduje się w `src/rules/taxRules.ts`.
