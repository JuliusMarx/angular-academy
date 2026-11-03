import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';

// Runs against the real generated index (npm test builds the content first).
describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    service = TestBed.inject(SearchService);
  });

  const marked = (hit: { snippet: { text: string; hit: boolean }[] }) =>
    hit.snippet.filter((p) => p.hit).map((p) => p.text);

  it('finds the section that matches, with an anchor to jump to', async () => {
    const [first] = await service.search('en', 'linkedSignal');
    expect(first.doc.lesson).toBe('signals/linked-signal');
    expect(first.doc.anchor).not.toBe('');
  });

  it('finds camelCase parts exactly ("cleanup" → onCleanup) without fuzzy neighbours', async () => {
    const hits = await service.search('en', 'cleanup');
    expect(hits[0].doc.id).toBe('signals/effect#cleaning-up-with-oncleanup');
    expect(hits.every((h) => !marked(h).some((m) => m.toLowerCase() === 'clear'))).toBe(true);
  });

  it('prefers exact matches over fuzzy ones', async () => {
    const hits = await service.search('de', 'asReadonly');
    expect(hits).toHaveLength(1);
    expect(marked(hits[0])).toEqual(['asReadonly']);
  });

  it('tolerates typos when nothing matches exactly', async () => {
    const [first] = await service.search('en', 'singal');
    expect(first.doc.lesson).toBe('signals/signals-and-computed');
  });

  it('returns nothing for very short or unknown queries', async () => {
    expect(await service.search('en', 's')).toEqual([]);
    expect(await service.search('en', 'xyzzy')).toEqual([]);
  });
});
