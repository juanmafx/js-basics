CREATE TABLE IF NOT EXISTS experiments (
  name VARCHAR(64) PRIMARY KEY,
  description VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS experiment_runs (
  run_id CHAR(36) PRIMARY KEY,
  experiment_name VARCHAR(64) NOT NULL REFERENCES experiments (name) ON DELETE RESTRICT,
  package_version VARCHAR(32) NOT NULL,
  runtime_version VARCHAR(32) NOT NULL,
  seed BIGINT CHECK (seed IS NULL OR seed BETWEEN 0 AND 4294967295),
  parameters_json TEXT NOT NULL,
  result_json TEXT,
  status VARCHAR(16) NOT NULL CHECK (status IN ('running', 'succeeded', 'failed')),
  started_at TIMESTAMP NOT NULL,
  finished_at TIMESTAMP,
  CHECK (finished_at IS NULL OR finished_at >= started_at),
  CHECK (status <> 'succeeded' OR (result_json IS NOT NULL AND finished_at IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS run_metrics (
  run_id CHAR(36) NOT NULL REFERENCES experiment_runs (run_id) ON DELETE CASCADE,
  metric_name VARCHAR(64) NOT NULL,
  metric_value DOUBLE PRECISION NOT NULL,
  PRIMARY KEY (run_id, metric_name)
);

CREATE INDEX IF NOT EXISTS idx_experiment_runs_experiment_started
  ON experiment_runs (experiment_name, started_at);

CREATE INDEX IF NOT EXISTS idx_experiment_runs_status ON experiment_runs (status);

CREATE INDEX IF NOT EXISTS idx_run_metrics_name_value ON run_metrics (metric_name, metric_value);
