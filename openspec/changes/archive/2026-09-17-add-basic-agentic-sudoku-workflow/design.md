## Context

The repository currently contains only OpenSpec configuration, so there are no application conventions or compatibility constraints to preserve. The change spans a browser application, E2E automation, and two GitHub-based agent loops. See `proposal.md` and the three capability specs for scope and observable behavior.

The initial automation must be useful while remaining intentionally low-autonomy: agents can analyze and comment, but cannot modify repository code. User-authored issue and pull-request content is untrusted, and secret-backed agent calls require a stronger trust boundary than ordinary CI tests.

## Goals / Non-Goals

**Goals:**

- Establish a minimal, maintainable Lit application with deterministic browser behavior.
- Make the product behavior and CI workflows testable locally where practical.
- Separate unprivileged PR testing from trusted, secret-backed agent analysis.
- Leave clear extension points for plan approval, implementation agents, and automated repair in later changes.

**Non-Goals:**

- Generating Sudoku puzzles, selecting difficulty, persistence, hints, notes, accounts, or multiplayer.
- Letting an agent create branches, commit fixes, open pull requests, approve changes, or merge code.
- Running secret-backed agent jobs for forks or untrusted contributors.
- Attempting to silently rewrite brittle E2E tests until CI becomes green.

## Decisions

### Use a Vite-powered Lit and TypeScript single-page application

Create a small component hierarchy with an application shell, Sudoku board, cell, and number controls. Keep puzzle state and validation in pure TypeScript modules, while Lit components own rendering and interaction. Vite provides a conventional local server and production build with little custom configuration.

Alternatives considered: a framework-heavy SPA would obscure the web-component focus; a no-build JavaScript app would reduce tooling but weaken type safety and make test/build parity less representative.

### Ship one deterministic puzzle and solution

Store a fixed puzzle as immutable data and derive conflict/completion state from the current board. This keeps the first showcase focused, makes E2E tests deterministic, and avoids adding puzzle-generation correctness as a separate concern. UI code must not use the stored solution merely to flag a non-conflicting but incorrect partial entry; completion is based on Sudoku validity.

Alternatives considered: generated puzzles add product value but materially increase scope and testing complexity; an API would add infrastructure unrelated to the showcase.

### Make accessibility and stable semantics part of the UI structure

Represent the board with grid semantics and accessible labels that include row, column, editability, value, and invalid state. Support physical keyboard entry alongside visible number and erase controls, maintain a clear focus indicator, and expose completion feedback through a live status region. E2E tests should prefer roles, labels, and visible behavior over CSS selectors.

Alternatives considered: a canvas can simplify drawing but makes accessible interaction and resilient browser testing harder.

### Separate pull-request testing from failure analysis

Use an unprivileged PR workflow to install locked dependencies, install the required Playwright browser, build, serve, and test the app. Upload failure evidence from that run. A separate diagnosis path runs only after the test result is known and only after checking that the pull request is from the same repository and has a trusted author association. It receives narrowly selected test output and repository context, not arbitrary shell authority.

The workflow should use pinned action versions, minimal job permissions, concurrency cancellation for superseded commits, dependency caching, timeouts, and bounded artifact retention.

Alternatives considered: putting the agent secret directly in the PR test job is simpler but exposes a dangerous trust boundary; `pull_request_target` checking out and executing PR code is rejected because it can expose repository secrets to attacker-controlled code.

### Use comment-only agent adapters with explicit prompts and markers

Provide small scripts that build bounded prompts, call a configurable model endpoint through environment-provided credentials, validate non-empty textual output, and create or update comments through GitHub's API. A hidden marker identifies bot comments for idempotent updates. Prompts explicitly delimit untrusted issue/PR text and forbid following embedded instructions.

The issue planner is triggered by a designated label event and verifies the triggering actor's repository permission before calling the model. The PR diagnosis path verifies same-repository origin and trusted author association. Both jobs receive only read access plus the issue-comment permission needed for their output.

Alternatives considered: coupling to a marketplace agent action is quicker but hides prompt, permission, and provider behavior; building a full provider abstraction is unnecessary, so the first implementation uses one documented endpoint contract isolated behind scripts for later replacement.

### Keep healing diagnostic rather than mutating

The first “healing” loop classifies failures, cites artifacts/log excerpts, recommends a minimal patch and rerun plan, and updates one PR comment. It never pushes a patch. This creates observable data about diagnosis quality before granting write authority.

Alternatives considered: direct commits demonstrate more autonomy but risk masking product regressions, weakening tests, and changing contributor branches without review.

## Risks / Trade-offs

- **[Model output can be wrong or manipulated]** → Clearly label output as advisory, delimit untrusted content, minimize supplied context, and require human review.
- **[Trust checks can be implemented incorrectly]** → Centralize eligibility logic, cover it with tests, use both same-repository and author/actor permission checks, and fail closed when metadata is missing.
- **[Comments can leak logs or secrets]** → Send only bounded, scrubbed excerpts and artifact metadata; never print model credentials or complete environment dumps.
- **[A fixed puzzle limits the product demo]** → Keep puzzle data behind a narrow model boundary so generation or puzzle selection can be added later.
- **[Browser CI adds runtime and maintenance]** → Test one supported browser initially, cache dependencies, and retain rich diagnostics only on failure.
- **[Provider configuration may be absent in forks or initial setup]** → Document required secrets, keep ordinary E2E independent, and fail agent jobs with a clear configuration message.

## Migration Plan

1. Introduce the frontend and local quality commands first, verifying unit and Playwright tests locally.
2. Add the feature-request form and read-only/comment-only agent scripts with automated tests for trust and prompt boundaries.
3. Add pull-request E2E CI, initially validating workflow syntax and artifact production on a test PR.
4. Configure the model credential and enable label-triggered issue planning and trusted failure diagnosis.
5. If agent behavior is unsafe or noisy, disable the agent jobs or remove the invocation label while retaining the application and unprivileged E2E checks.
