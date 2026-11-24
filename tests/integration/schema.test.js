import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { before, describe, it } from 'node:test';

const schema = readFileSync(new URL('../../db/schema.sql', import.meta.url), 'utf8');
const runId = '00000000-0000-4000-8000-000000000001';
const insertRun = `INSERT INTO experiment_runs
  (run_id, experiment_name, package_version, runtime_version, seed, parameters_json, result_json,
   status, started_at, finished_at)
  VALUES (?, 'uniformity', '2.0.0', 'v24', ?, '{}', ?, ?, '2026-01-01 00:00:00', ?)`;

describe('optional results schema', () => {
  let database;

  before(() => {
    database = new DatabaseSync(':memory:');
    database.exec('PRAGMA foreign_keys = ON');
    database.exec(schema);
    database.exec(schema);
    database.exec("INSERT INTO experiments VALUES ('uniformity', 'Uniformity check')");
  });

  it('stores a successful run and cascades metrics', () => {
    database.prepare(insertRun).run(runId, 42, '{}', 'succeeded', '2026-01-01 00:00:01');
    database.prepare('INSERT INTO run_metrics VALUES (?, ?, ?)').run(runId, 'p_value', 0.34);
    database.prepare('DELETE FROM experiment_runs WHERE run_id = ?').run(runId);
    const { total } = database.prepare('SELECT COUNT(*) AS total FROM run_metrics').get();
    assert.equal(total, 0);
  });

  it('enforces domain constraints', () => {
    const id = '00000000-0000-4000-8000-000000000002';
    const statement = database.prepare(insertRun);
    assert.throws(() => statement.run(id, -1, '{}', 'succeeded', '2026-01-01 00:00:01'));
    assert.throws(() => statement.run(id, 1, '{}', 'unknown', '2026-01-01 00:00:01'));
    assert.throws(() => statement.run(id, 1, null, 'succeeded', '2026-01-01 00:00:01'));
    assert.throws(() => statement.run(id, 1, '{}', 'succeeded', '2025-01-01 00:00:00'));
  });

  it('enforces the experiment foreign key', () => {
    assert.throws(() =>
      database
        .prepare(
          `INSERT INTO experiment_runs
           (run_id, experiment_name, package_version, runtime_version, parameters_json, status,
            started_at)
           VALUES ('x', 'missing', '2.0.0', 'v24', '{}', 'running', '2026-01-01 00:00:00')`,
        )
        .run(),
    );
  });
});
