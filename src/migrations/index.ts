import * as migration_20260602_201808 from './20260602_201808';
import * as migration_20260605_000000 from './20260605_000000';

export const migrations = [
  {
    up: migration_20260602_201808.up,
    down: migration_20260602_201808.down,
    name: '20260602_201808'
  },
  {
    up: migration_20260605_000000.up,
    down: migration_20260605_000000.down,
    name: '20260605_000000'
  },
];
