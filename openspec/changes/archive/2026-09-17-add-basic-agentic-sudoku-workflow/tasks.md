## 1. Project Foundation

- [x] 1.1 Initialize a pnpm-managed Vite, Lit, and TypeScript application with pinned runtime/development dependencies and verify `pnpm install --frozen-lockfile` and the production build succeed.
- [x] 1.2 Add canonical format, lint, type-check, unit-test, build, and E2E scripts plus concise repository setup documentation, and verify each non-browser quality command runs locally.
- [x] 1.3 Add an `AGENTS.md` describing project commands, architecture boundaries, and workflow security invariants, and verify it matches the implemented scripts and repository layout.

## 2. Sudoku Domain and Components

- [x] 2.1 Implement immutable starter-puzzle data and pure board operations for editable cells, entry, clearing, conflict detection, validity, completion, and reset; verify unit tests cover rows, columns, boxes, full invalid boards, and solved boards.
- [x] 2.2 Implement the Lit application shell and 9-by-9 board with separated board, cell, and controls components; verify component tests show 81 cells and distinguish immutable givens from editable cells.
- [x] 2.3 Implement pointer, keyboard, number-pad, erase, selection, and reset-confirmation interactions; verify component tests cover accepted digits, ignored edits to givens, clear, confirmed reset, and cancelled reset.
- [x] 2.4 Add conflict and completion presentation with grid semantics, descriptive labels, focus styling, responsive layout, and an assistive-technology status region; verify automated accessibility checks and component tests cover invalid and completed states.

## 3. Playwright Coverage

- [x] 3.1 Configure Playwright for the built/previewed application with one Chromium project, CI retries, traces, screenshots, videos, and an HTML report; verify a local smoke invocation starts the app and opens the game.
- [x] 3.2 Add role- and label-based E2E scenarios for loading the puzzle, protecting givens, entering and clearing values, conflict correction, reset confirmation/cancellation, and successful completion; verify the complete Playwright suite passes locally.

## 4. Feature-Request Planning Flow

- [x] 4.1 Add a GitHub feature-request issue form covering problem, desired behavior, acceptance criteria, and context; verify the YAML is valid and exposes all required fields.
- [x] 4.2 Implement bounded prompt construction, provider invocation, output validation, and idempotent marker-based issue comment updates for advisory plans; verify unit tests cover untrusted prompt content, missing configuration, empty responses, and existing-comment updates.
- [x] 4.3 Add a label-triggered issue workflow that verifies the triggering actor's repository permission, uses minimal permissions, and never modifies code; verify workflow/static tests cover eligible and fail-closed ineligible events.

## 5. Pull-Request CI and Diagnosis

- [x] 5.1 Add an unprivileged pull-request workflow with locked pnpm installation, Chromium setup, build and E2E execution, concurrency cancellation, timeouts, and failure-only artifact upload with bounded retention; verify workflow linting and a representative pull-request run produce the expected check and artifacts.
- [x] 5.2 Implement centralized eligibility checks for trusted same-repository pull requests; verify unit tests reject forked, untrusted, and incomplete event metadata while accepting documented trusted associations.
- [x] 5.3 Implement scrubbed and bounded failure-context collection plus provider-backed diagnostic prompt generation and marker-based PR comment updates; verify tests cover product/test/environment classifications, inconclusive output, prompt-injection text, redaction, size limits, and repeat updates.
- [x] 5.4 Add the post-failure diagnosis workflow with minimal read/comment permissions and no branch-write capability; verify workflow/static tests prove model credentials are unavailable to PR test code and diagnosis is skipped for ineligible pull requests.

## 6. Integrated Verification

- [x] 6.1 Run formatting, linting, type checking, unit/component tests, production build, Playwright E2E tests, workflow validation, and OpenSpec strict validation; resolve every warning or failure and record the canonical commands in the README.
- [x] 6.2 Exercise the trusted issue-planning and failed-PR diagnosis flows in a test repository or dry-run harness, verifying each creates or updates one advisory comment and neither flow modifies a branch.
