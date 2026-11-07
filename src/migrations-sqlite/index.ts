import * as migration_20260929_180712_initial from './20260929_180712_initial';
import * as migration_20261107_124309_photo_deletion_requests from './20261107_124309_photo_deletion_requests';

export const migrations = [
  {
    up: migration_20260929_180712_initial.up,
    down: migration_20260929_180712_initial.down,
    name: '20260929_180712_initial',
  },
  {
    up: migration_20261107_124309_photo_deletion_requests.up,
    down: migration_20261107_124309_photo_deletion_requests.down,
    name: '20261107_124309_photo_deletion_requests'
  },
];
