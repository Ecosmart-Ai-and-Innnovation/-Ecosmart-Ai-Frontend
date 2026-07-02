import { useState } from 'react';
import { wasteApi } from '@/lib/api';
import { WasteClassificationResult, WasteScanInput } from '@/types';

export function useWasteScan() {
  const [result, setResult] = useState<WasteClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function scan(input: WasteScanInput) {
    setLoading(true);
    setError(null);
    try {
      const data = await wasteApi.scan(input) as WasteClassificationResult;
      setResult(data);
    } catch (e) {
      setError('Failed to classify waste. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
  }

  return { result, loading, error, scan, reset };
}
