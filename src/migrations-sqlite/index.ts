import * as migration_20260929_180712_initial from './20260929_180712_initial';

export const migrations = [
  {
    up: migration_20260929_180712_initial.up,
    down: migration_20260929_180712_initial.down,
    name: '20260929_180712_initial'
  },
];
