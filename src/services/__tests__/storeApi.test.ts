import { generateMockStores } from '@/data/mockStores';
import { ApiError, createHttpStoreApi, createMockStoreApi, toUserMessage } from '@/services/api';
import { makeStore } from '@/test/fixtures';

describe('mock store API', () => {
  const data = generateMockStores(40);

  it('paginates', async () => {
    const api = createMockStoreApi({ data });
    const first = await api.fetchStores({ search: '', page: 1, pageSize: 15 });
    const last = await api.fetchStores({ search: '', page: 3, pageSize: 15 });
    expect(first).toMatchObject({ total: 40, hasMore: true });
    expect(first.items).toHaveLength(15);
    expect(last.items).toHaveLength(10);
    expect(last.hasMore).toBe(false);
  });

  it('filters by name, ignoring case and accents', async () => {
    const api = createMockStoreApi({
      data: [makeStore({ id: '1', name: 'Épicerie du Port' }), makeStore({ id: '2', name: 'Tech Hub' })],
    });
    const result = await api.fetchStores({ search: 'EPICE', page: 1, pageSize: 10 });
    expect(result.items.map((s) => s.id)).toEqual(['1']);
  });

  it('throws not_found for an unknown id', async () => {
    const api = createMockStoreApi({ data });
    await expect(api.fetchStoreById('nope')).rejects.toMatchObject({ kind: 'not_found' });
  });

  it('can simulate network failures', async () => {
    const api = createMockStoreApi({ data, failureRate: 1, random: () => 0 });
    await expect(api.fetchStores({ search: '', page: 1, pageSize: 5 })).rejects.toBeInstanceOf(ApiError);
  });

  it('honours AbortSignal', async () => {
    const api = createMockStoreApi({ data, latencyMs: 1000 });
    const controller = new AbortController();
    const promise = api.fetchStores({ search: '', page: 1, pageSize: 5 }, controller.signal);
    controller.abort();
    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });
});

describe('HTTP store API', () => {
  const okResponse = (body: unknown, status = 200) =>
    ({ ok: status < 400, status, json: async () => body }) as Response;

  it('builds the query string and validates the response', async () => {
    const store = makeStore();
    const fetchMock = jest.fn(async () =>
      okResponse({ items: [store], page: 2, pageSize: 10, total: 11, hasMore: false }),
    );
    const api = createHttpStoreApi('https://api.test', fetchMock as unknown as typeof fetch);

    const result = await api.fetchStores({ search: 'lib', page: 2, pageSize: 10 });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/stores?search=lib&page=2&pageSize=10',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    );
    expect(result.items).toEqual([store]);
  });

  it.each([
    ['network', async () => Promise.reject(new TypeError('Network request failed'))],
    ['not_found', async () => okResponse({}, 404)],
    ['server', async () => okResponse({}, 500)],
    ['invalid_response', async () => okResponse({ nope: true })],
  ])('maps failures to ApiError(%s)', async (kind, impl) => {
    const api = createHttpStoreApi('https://api.test', jest.fn(impl) as unknown as typeof fetch);
    await expect(api.fetchStoreById('x')).rejects.toMatchObject({ kind });
  });

  it('provides user-facing French messages', () => {
    expect(toUserMessage(new ApiError('network'))).toMatch(/connexion/);
    expect(toUserMessage(new Error('boom'))).toBe('Une erreur inattendue est survenue.');
  });
});
