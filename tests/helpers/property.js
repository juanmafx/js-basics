import fc from 'fast-check';

fc.configureGlobal({ seed: 2026, numRuns: 300 });

export { fc };
