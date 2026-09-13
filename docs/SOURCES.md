# Oficjalne źródła — weryfikacja 13.09.2026

Wyłącznie źródła administracji publicznej:

- [Ustawa o podatku dochodowym od osób fizycznych (ELI)](https://eli.gov.pl/eli/DU/1991/350/ogl): art. 11a (waluty), art. 23 ust. 1 pkt 38 (wydatki na nabycie), art. 24 ust. 10 wraz z art. 30b ust. 7 (FIFO przy braku identyfikacji, osobno dla rachunku), art. 30a ust. 1 pkt 4 i ust. 9 (zagraniczna dywidenda i limit odliczenia), art. 30b (19% i sprzedaż papierów).
- [PIT-38 — podatki.gov.pl](https://www.podatki.gov.pl/pit/formularze-do-druku-pit/): właściwy formularz rozliczenia dochodów kapitałowych.
- [NBP Web API](https://api.nbp.pl/): oficjalny endpoint tabel średnich A; aplikacja odpytuje konkretną datę i cofa się po odpowiedzi 404, aby znaleźć ostatnią opublikowaną tabelę sprzed zdarzenia.

Maszynowo czytelny, wersjonowany rejestr (`id`, `taxYear`, `description`, `sourceTitle`, `sourceUrl`, `checkedAt`) znajduje się w `src/rules/taxRules.ts`.
