import * as migration_20260602_201808 from './20260602_201808';

export const migrations = [
  {
    up: migration_20260602_201808.up,
    down: migration_20260602_201808.down,
    name: '20260602_201808'
  },
];
