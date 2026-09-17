## Why

This empty repository needs a small but credible product that demonstrates an agent-assisted development loop end to end. A playable Lit-based Sudoku app, structured feature requests, and pull-request browser checks provide a simple baseline that can be extended with more autonomous planning and test healing later.

## What Changes

- Add a browser-based Sudoku game built with Lit web components, including a fixed starter puzzle, cell entry, conflict feedback, completion feedback, and reset.
- Add a structured GitHub feature-request issue template suitable for later consumption by coding agents.
- Add an explicitly invoked issue workflow that asks an agent to analyze a trusted feature request and publish an implementation plan as an issue comment; it does not change code or open pull requests in this first iteration.
- Add Playwright end-to-end tests and run them for pull requests in GitHub Actions.
- Preserve Playwright traces, screenshots, videos, and reports when tests fail so a future healing agent has useful diagnostic input.
- Add a failure-analysis job that asks a Playwright-focused agent to diagnose failed E2E checks and comment a proposed remedy on the pull request; the first iteration must not commit changes or update tests automatically.
- Restrict issue planning to trusted collaborators and explicit label-based invocation; run PR failure analysis automatically only for trusted same-repository branches, avoiding write-capable execution of untrusted contributions.

## Capabilities

### New Capabilities
- `sudoku-game`: User-visible Sudoku board interaction, validation, completion, and reset behavior.
- `agentic-feature-request`: Structured feature requests and a guarded, plan-only agent workflow for issue-driven development.
- `pull-request-e2e`: Pull-request browser testing, failure artifacts, and guarded agent-assisted failure diagnosis.

### Modified Capabilities

None.

## Impact

- Introduces a Lit/TypeScript frontend and its build, lint, and test toolchain.
- Adds Playwright browser tests and browser installation requirements.
- Adds GitHub issue forms and GitHub Actions workflows with repository permission and secret requirements.
- Adds an agent integration whose exact provider is configurable through repository secrets; generated issue and pull-request comments are advisory in this initial scope.
