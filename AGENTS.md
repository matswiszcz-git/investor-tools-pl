# Repository agent guidance

GitHub Actions minutes are a limited resource. Use scope-proportional validation and validate locally before pushing. Do not use Actions as a debugging loop; batch related changes. A green check for an older SHA is never evidence for a newer SHA.

- Documentation-only: do not run the full suite or production build unless documentation tooling changed.
- UI-only: run relevant local UI checks and typecheck; do not run unrelated calculation-engine tests.
- Calculation, tax, or NBP: run affected tests, relevant regression tests, and typecheck.
- Dependency, build, or configuration: run `npm ci`, typecheck, tests, and build.
- Before a meaningful merge or release: run the full test suite, typecheck, and production build.

CI should use one compact pull-request gate, concurrency cancellation, npm cache, one supported Node version, no schedules or redundant matrix, and safe filters that skip full CI for documentation-only changes.
