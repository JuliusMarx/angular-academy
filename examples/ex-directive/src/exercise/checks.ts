import { Check } from './check-kit';

export const exercise = 'ex-directive';

const externals = (t: Parameters<Check['run']>[0]) => [t.$('#docs'), t.$('#mdn')];

export const checks: Check[] = [
  {
    id: 'sets-target',
    run: (t) => {
      for (const a of externals(t)) {
        t.expect(a.getAttribute('target') === '_blank', `#${a.id} has target="${a.getAttribute('target') ?? ''}"`);
      }
    },
  },
  {
    id: 'sets-rel',
    run: (t) => {
      for (const a of externals(t)) {
        const rel = a.getAttribute('rel') ?? '';
        t.expect(rel.includes('noopener') && rel.includes('noreferrer'), `#${a.id} has rel="${rel}"`);
      }
    },
  },
  {
    id: 'adds-class',
    run: (t) => {
      for (const a of externals(t)) t.expect(a.classList.contains('external'), `#${a.id} has no class "external"`);
    },
  },
  {
    id: 'internal-untouched',
    run: (t) => {
      const home = t.$('#home');
      t.expect(!home.hasAttribute('target') && !home.classList.contains('external'), 'The internal link should stay unchanged');
    },
  },
];
