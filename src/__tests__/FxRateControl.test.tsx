import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FxRateControl } from '../components/FxRateControl';
import { NbpAdapter } from '../nbp/adapter';

const adapterWith = (get: ReturnType<typeof vi.fn>) => new NbpAdapter({ get });

describe('FxRateControl', () => {
  it('shows loading and then the NBP rate and table date', async () => {
    let resolve!: (value: { rates: { mid: number; effectiveDate: string }[] }) => void;
    const get = vi.fn(() => new Promise<{ rates: { mid: number; effectiveDate: string }[] }>((done) => { resolve = done; }));
    const onRateChange = vi.fn();
    const adapter = adapterWith(get);
    function Harness() {
      const [rate, setRate] = useState(0);
      return <FxRateControl currency="EUR" date="2024-06-10" rate={rate} adapter={adapter} onRateChange={(next, details) => { setRate(next); onRateChange(next, details); }} />;
    }
    render(<Harness />);
    expect(screen.getByText(/Pobieramy właściwy kurs/)).toBeTruthy();
    resolve({ rates: [{ mid: 4.321, effectiveDate: '2024-06-07' }] });
    expect((await screen.findByText(/tabela z dnia/)).textContent).toContain('4.3210');
    expect(screen.getByText(/tabela z dnia/).textContent).toContain('2024-06-07');
    expect(onRateChange).toHaveBeenLastCalledWith(4.321, { effectiveDate: '2024-06-07', manual: false });
  });

  it('shows an error and permits an explicitly labelled manual fallback', async () => {
    const onRateChange = vi.fn();
    render(<FxRateControl currency="USD" date="2024-06-10" rate={0} onRateChange={onRateChange} adapter={adapterWith(vi.fn().mockRejectedValue(new Error('offline')))} />);
    expect((await screen.findByRole('alert')).textContent).toContain('Nie używamy kursu zastępczego');
    fireEvent.click(screen.getByRole('button', { name: 'Podaj kurs ręcznie' }));
    fireEvent.change(screen.getByLabelText('Ręczny kurs PLN'), { target: { value: '4.1234' } });
    expect(screen.getByText(/wartość podana przez użytkownika/)).toBeTruthy();
    expect(onRateChange).toHaveBeenLastCalledWith(4.1234, { manual: true });
  });

  it('does not query NBP for PLN', async () => {
    const get = vi.fn();
    const onRateChange = vi.fn();
    render(<FxRateControl currency="PLN" date="2024-06-10" rate={0} onRateChange={onRateChange} adapter={adapterWith(get)} />);
    await waitFor(() => expect(onRateChange).toHaveBeenCalledWith(1, { manual: false }));
    expect(get).not.toHaveBeenCalled();
    expect(screen.getByText(/bez zapytania do NBP/)).toBeTruthy();
  });
});
