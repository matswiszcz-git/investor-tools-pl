import { useEffect, useRef, useState } from 'react';
import { browserHttp, NbpAdapter } from '../nbp/adapter';
import type { Currency, FxRate } from '../types';

export const nbpSourceUrl = 'https://api.nbp.pl/';
export const defaultNbpAdapter = new NbpAdapter(browserHttp);
type Status = 'idle' | 'loading' | 'success' | 'error' | 'manual';

interface FxRateControlProps {
  currency: Currency;
  date: string;
  rate: number;
  onRateChange: (rate: number, details: { effectiveDate?: string; manual: boolean }) => void;
  adapter?: NbpAdapter;
}

export function FxRateControl({ currency, date, rate, onRateChange, adapter = defaultNbpAdapter }: FxRateControlProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [effectiveDate, setEffectiveDate] = useState<string>();
  const [message, setMessage] = useState('');
  const requestId = useRef(0);
  const onRateChangeRef = useRef(onRateChange);
  onRateChangeRef.current = onRateChange;

  useEffect(() => {
    const id = ++requestId.current;
    setMessage('');
    setEffectiveDate(undefined);
    if (!date) { setStatus('idle'); return; }
    if (currency === 'PLN') { setStatus('success'); onRateChangeRef.current(1, { manual: false }); return; }

    setStatus('loading');
    onRateChangeRef.current(0, { manual: false });
    adapter.previousBusinessRate(currency, date).then(
      (result: FxRate) => {
        if (id !== requestId.current) return;
        setEffectiveDate(result.effectiveDate);
        setStatus('success');
        onRateChangeRef.current(result.rate, { effectiveDate: result.effectiveDate, manual: false });
      },
      () => {
        if (id !== requestId.current) return;
        setStatus('error');
        setMessage('Nie udało się pobrać kursu z NBP. Nie używamy kursu zastępczego.');
      },
    );
  }, [adapter, currency, date]);

  const enableManual = () => {
    ++requestId.current;
    setStatus('manual');
    setEffectiveDate(undefined);
    setMessage('Kurs ręczny — wartość podana przez użytkownika. Zweryfikuj ją z tabelą NBP.');
  };

  return (
    <div className={`fx-rate fx-rate--${status}`} aria-live="polite">
      {status === 'idle' && <span>Wybierz datę, aby pobrać kurs.</span>}
      {status === 'loading' && <span className="fx-loading">Pobieramy właściwy kurs NBP…</span>}
      {status === 'success' && currency === 'PLN' && <span>PLN: kurs 1,0000 — bez zapytania do NBP.</span>}
      {status === 'success' && currency !== 'PLN' && <span>Kurs NBP: <strong>{rate.toFixed(4)}</strong> · tabela z dnia <strong>{effectiveDate}</strong></span>}
      {status === 'error' && <span role="alert">{message}</span>}
      {status === 'manual' && <label>Ręczny kurs PLN<input aria-label="Ręczny kurs PLN" min="0.0001" step="0.0001" type="number" value={rate || ''} onChange={(event) => onRateChangeRef.current(Number(event.target.value), { manual: true })}/><small>{message}</small></label>}
      {date && currency !== 'PLN' && status !== 'loading' && status !== 'manual' && <button className="link-button" type="button" onClick={enableManual}>{status === 'error' ? 'Podaj kurs ręcznie' : 'Zastąp kursem ręcznym'}</button>}
      {status !== 'idle' && status !== 'manual' && currency !== 'PLN' && <a href={nbpSourceUrl} target="_blank" rel="noreferrer">Źródło: Narodowy Bank Polski, tabela A</a>}
    </div>
  );
}
