# Metodologia (ruleset 2026)

## Sprzedaż
Przychód to wartość sprzedaży pomniejszona o prowizję sprzedaży. Koszt partii obejmuje cenę nabycia i proporcjonalną prowizję. Każdy składnik walutowy ma własny kurs: średni NBP z ostatniego dnia roboczego przed przychodem/kosztem (art. 11a). 19% naliczane jest od dodatniej sumy dochodu. Straty nie generują ujemnego podatku.

FIFO nie jest uniwersalnym wyborem użytkownika: ustawa nakazuje je, gdy nie można zidentyfikować papierów, odrębnie na każdym rachunku. V1 przyjmuje jeden rachunek i brak identyfikacji, jawnie prezentując partie. Użytkownik musi zweryfikować dokumentację brokera.

## Dywidenda
Brutto PLN × 19%, następnie credit będący minimum kwoty deklarowanej jako możliwa do odliczenia i polskiego podatku. Zagraniczne potrącenie jest osobnym polem. Brak treaty engine — właściwą umowę, rezydencję i możliwość odliczenia trzeba sprawdzić samodzielnie. Zaokrąglenia prezentacyjne są do groszy; zeznanie może wymagać ustawowych reguł zaokrągleń.

## Snowball
Model rozpoczyna od ceny jednostki równej 1 i rocznej dywidendy na jednostkę równej początkowemu dividend yield. Śledzi niezależnie cenę jednostki, liczbę jednostek oraz dywidendę na jednostkę. Wzrost ceny zmienia wyłącznie cenę; dividend growth zmienia wyłącznie dywidendę na jednostkę, dlatego yield może naturalnie zmieniać się w czasie.

Symulacja miesięczna kupuje jednostki za wpłaty po aktualnej cenie, nalicza dywidendę jako `liczba jednostek × dywidenda na jednostkę / 12` i pobiera podatek od dywidendy brutto. Gdy reinwestowanie jest włączone, wyłącznie dywidenda netto kupuje dodatkowe jednostki; dywidenda nie jest ponownie dodawana do portfela. Wartość portfela to `liczba jednostek × cena jednostki`, a wartość realna to wartość nominalna podzielona przez `(1 + inflacja)^rok`. To model, nie prognoza.
