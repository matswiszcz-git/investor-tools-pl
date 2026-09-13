# Investor Tools PL

Prywatny, działający wyłącznie w przeglądarce zestaw trzech narzędzi dla polskiego inwestora: podatek od sprzedaży akcji/ETF, zagraniczna dywidenda i Dividend Snowball.

## Start

Wymagany Node.js 20+.

```bash
npm ci
npm run dev
```

Kontrole: `npm run typecheck`, `npm test`, `npm run build`. Dane formularzy nie są wysyłane do backendu ani utrwalane poza lokalną sesją aplikacji. Projekt nie oferuje logowania, importu brokerskiego ani porady podatkowej.

Metodologia i ograniczenia: [docs/METHODOLOGY.md](docs/METHODOLOGY.md). Źródła: [docs/SOURCES.md](docs/SOURCES.md). Architektura: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

Kursy EUR, USD i GBP są automatycznie pobierane z publicznego API NBP dla ostatniego dnia roboczego poprzedzającego zdarzenie. Do NBP trafiają wyłącznie kod waluty i data; kwoty ani informacje o instrumencie nie opuszczają przeglądarki. Gdy API jest niedostępne, aplikacja nie zgaduje kursu i udostępnia wyraźnie oznaczony ręczny fallback.
