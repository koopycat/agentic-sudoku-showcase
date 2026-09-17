# Agentic Sudoku Lab

A playable Lit Sudoku used to demonstrate bounded, inspectable agentic engineering workflows:

1. A trusted collaborator labels a structured feature request for an advisory implementation plan.
2. Every pull request runs unprivileged Playwright checks.
3. Failed checks retain evidence and, for trusted same-repository branches, request an advisory diagnosis.

Agents comment; they do not commit, approve, or merge code.

## Setup

Requirements: Node.js 22+ and pnpm 10.17.1.

```bash
pnpm install --frozen-lockfile
pnpm test:e2e:install
pnpm dev
```

Copy `.env.example` only for local agent-adapter dry runs. Never commit `.env`.

## Canonical commands

```bash
pnpm format:check       # formatting
pnpm lint               # ESLint
pnpm typecheck          # TypeScript
pnpm test               # unit and component tests
pnpm build              # production build
pnpm test:e2e           # Chromium end-to-end tests
pnpm validate:workflows # parse and statically validate GitHub workflows
pnpm test:agent-dry-run # comment-only adapter harness
pnpm check              # all non-browser checks
```

## Repository structure

- `src/domain/` — immutable puzzle data and pure Sudoku rules
- `src/components/` — Lit web components and interaction state
- `tests/e2e/` — user-visible Playwright scenarios
- `scripts/agent/` — bounded prompts, trust checks, provider and GitHub adapters
- `.github/workflows/` — unprivileged PR testing and guarded comment-only agents
- `openspec/` — behavior contracts and tracked implementation plan

## Agent workflows

Create an `agent-plan` label. Applying it to an issue triggers planning only when the actor has `admin`, `maintain`, or `write` permission. Configure `AGENT_API_KEY`, `AGENT_API_URL`, and `AGENT_MODEL` as repository secrets/variables described in `.env.example`.

PR tests never receive model credentials. After a failed run, diagnosis is limited to trusted authors (`OWNER`, `MEMBER`, or `COLLABORATOR`) using branches in the same repository. Reports update one marked comment and cannot write repository contents.

Failure artifacts are retained for seven days. Download `playwright-report` and `test-results` from the failed Actions run for traces, screenshots, and videos.

## Security boundary

Issue bodies, PR text, code, and test logs are untrusted data. Prompts delimit and truncate them. The initial workflows are advisory and intentionally have no branch-write, approval, or merge capability.
