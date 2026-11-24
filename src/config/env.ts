const parseNumber = (raw: string | undefined, fallback: number, min: number, max: number): number => {
  if (raw === undefined || raw.trim() === '') return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
};

const parseUrl = (raw: string | undefined): string | null => {
  const value = raw?.trim();
  if (!value) return null;
  return value.replace(/\/+$/, '');
};

export interface AppEnv {
  readonly apiUrl: string | null;
  readonly pageSize: number;
  readonly mockLatencyMs: number;
  readonly mockFailureRate: number;
}

export const env: AppEnv = {
  apiUrl: parseUrl(process.env.EXPO_PUBLIC_API_URL),
  pageSize: Math.round(parseNumber(process.env.EXPO_PUBLIC_PAGE_SIZE, 15, 5, 100)),
  mockLatencyMs: parseNumber(process.env.EXPO_PUBLIC_MOCK_LATENCY_MS, 600, 0, 10_000),
  mockFailureRate: parseNumber(process.env.EXPO_PUBLIC_MOCK_FAILURE_RATE, 0, 0, 1),
};

export const __testing = { parseNumber, parseUrl };
