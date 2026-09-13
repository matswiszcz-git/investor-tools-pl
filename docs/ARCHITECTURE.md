# Architektura

React renderuje trzy zakładki. Czyste silniki w `src/calculations` nie znają DOM ani sieci. `src/nbp/adapter.ts` izoluje API NBP za interfejsem `HttpClient`; testy wstrzykują syntetyczne mocki i nigdy nie wywołują live API. Reguły i metadane źródeł są w `src/rules`. Brak serwera, bazy, analytics i sekretów.

## Integracja NBP

Formularze przekazują do adaptera wyłącznie kod waluty i datę zdarzenia. Adapter rozpoczyna wyszukiwanie od poprzedniego dnia kalendarzowego i cofa się po odpowiedziach 404, dzięki czemu obsługuje weekendy oraz dni bez tabeli. Odpowiedź obejmuje kurs i datę tabeli. Dla PLN nie jest wykonywane zapytanie sieciowe. Błąd API blokuje wynik do czasu ponownego pobrania albo jawnego wprowadzenia przez użytkownika ręcznego kursu oznaczonego jako override.
