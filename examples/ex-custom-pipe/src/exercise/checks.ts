import { Check } from './check-kit';

export const exercise = 'ex-custom-pipe';

export const checks: Check[] = [
  {
    id: 'bytes',
    run: (t) => t.expectText('#size-0', /^512 B$/),
  },
  {
    id: 'kilobytes',
    run: (t) => {
      t.expectText('#size-1', /^1\.5 KB$/);
      t.expectText('#size-2', /^1 KB$/);
    },
  },
  {
    id: 'larger-units',
    run: (t) => {
      t.expectText('#size-3', /^1 MB$/);
      t.expectText('#size-4', /^1\.5 GB$/);
    },
  },
];
