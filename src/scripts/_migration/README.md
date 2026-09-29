# Neon → Turso data migration

One-off tooling used to move all Payload data from the legacy Neon Postgres
database to Turso (libSQL). The app now uses `@payloadcms/db-sqlite` and reads
`TURSO_DATABASE_URL` / `TURSO_ACCESS_TOKEN` (see `src/payload.config.ts`).

`src/payload.config.ts` exports `buildPayloadConfig(db)` so these scripts can
reuse the exact same collections/plugins/settings with a different adapter.

## How the data was migrated

Row-by-row writes straight to Turso are limited by Turso's single-writer
latency (~6 docs/s), so the data is staged in a local SQLite file first:

1. `payload migrate` against a local `file:` database creates the schema.
2. `import.ts` loads the exported JSON into that local file (fast).
3. `sync.ts` reads the local file and pushes batched `INSERT`s to Turso,
   parent tables first so foreign keys are satisfied.

Primary keys are preserved (`allowIDOnCreate: true`), so relationships and
stored media URLs keep working. Auth `hash`/`salt` are copied verbatim, so
existing logins keep working. `payload_migrations` is never copied.

## Re-running

The scripts read from `.env.local`. `TURSO_DATABASE_URL` can be overridden in
the shell to point the adapter at the local staging file.

```powershell
# 0. Export a fresh snapshot from Neon -> src/scripts/_migration/data
node --env-file=.env.local --import tsx/esm src/scripts/_migration/export.ts

# 1. Create the schema in the local staging database
Remove-Item "src/scripts/_migration/.local.db*" -Force -ErrorAction SilentlyContinue
$env:TURSO_DATABASE_URL="file:$PWD/src/scripts/_migration/.local.db"
node --env-file=.env.local --import tsx/esm ./node_modules/payload/bin.js migrate

# 2. Load the snapshot into the local staging database
node --env-file=.env.local --import tsx/esm src/scripts/_migration/import.ts

# 3. Push the local data to Turso (clears the target tables first)
Remove-Item Env:\TURSO_DATABASE_URL
node --env-file=.env.local --import tsx/esm src/scripts/_migration/sync.ts

# 4. Verify counts, credentials, relationships and upload URLs
node --env-file=.env.local --import tsx/esm src/scripts/_migration/verify.ts
```

`export.ts` and `import.ts` also accept `--only=<slug>`, `--limit=<n>` and
`--fresh` for targeted runs.

## Keeping Turso up to date

While the live site is still running on Neon, changes written there after the
snapshot are not in Turso. Two helpers handle that without a full re-import:

```powershell
# Count drift for every collection (Neon vs Turso)
node --env-file=.env.local --import tsx/esm src/scripts/_migration/drift.ts

# List missing/updated orders
node --env-file=.env.local --import tsx/esm src/scripts/_migration/orders-diff.ts

# Copy any orders missing from Turso (preserves ids, skips existing)
node --env-file=.env.local --import tsx/esm src/scripts/_migration/sync-orders.ts

# ...or force a specific set of ids
node --env-file=.env.local --import tsx/esm src/scripts/_migration/sync-orders.ts --ids=1949,1950
```

`sync-orders.ts` opens Neon and Turso as two Payload instances in one process
(distinct `getPayload` cache keys). It only inserts missing orders and never
clears tables; all referenced customers/products/schoolPhotos must already
exist in Turso.

## Notes

- `data/` and `.local.db*` are gitignored (they contain a full copy of the
  database, including password hashes).
- Upload `url` fields are derived from `filename` + `serverURL` at read time.
  The exporter rewrites the resolved absolute URLs back to their relative
  stored form so a staging `serverURL` (e.g. `localhost`) can never leak into
  production.
- `sync.ts` deletes every target table before loading. Do not run it against a
  database that is already serving traffic.
- Any rows written to Neon after `export.ts` ran are not included. Re-run the
  whole flow (or `export` + `import --fresh` + `sync`) if that matters.
