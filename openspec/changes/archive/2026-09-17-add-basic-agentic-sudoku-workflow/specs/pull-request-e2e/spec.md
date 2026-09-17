## Purpose

Defines reliable browser validation for pull requests and a bounded diagnosis loop that demonstrates agent assistance without allowing autonomous code changes.

## ADDED Requirements

### Requirement: Pull-request browser checks
The repository SHALL build the application and run its Playwright end-to-end suite for every pull request without exposing write-capable secrets to test code.

#### Scenario: End-to-end checks pass
- **WHEN** all browser scenarios pass for a pull request
- **THEN** the pull-request E2E check succeeds

#### Scenario: End-to-end check fails
- **WHEN** any browser scenario fails for a pull request
- **THEN** the pull-request E2E check fails and identifies the failed run

### Requirement: Failure evidence
The system SHALL upload the Playwright HTML report and available traces, screenshots, and videos when end-to-end checks fail, using bounded artifact retention.

#### Scenario: Browser test failure produces evidence
- **WHEN** Playwright records diagnostic files for a failed pull-request run
- **THEN** maintainers can download those files from the workflow run

### Requirement: Trusted failure diagnosis
The system SHALL automatically request agent diagnosis after an E2E failure only for a pull request whose source branch belongs to the same repository and whose author has a trusted repository association.

#### Scenario: Trusted same-repository pull request fails
- **WHEN** E2E checks fail for an eligible same-repository pull request
- **THEN** the failure-analysis workflow invokes the diagnosis agent with test output and relevant repository context

#### Scenario: Fork or untrusted pull request fails
- **WHEN** E2E checks fail for a forked pull request or an untrusted author
- **THEN** failure artifacts remain available but no secret-backed diagnosis agent is invoked

### Requirement: Advisory healing report
The diagnosis agent SHALL publish or update one clearly identified pull-request comment that classifies the likely product, test, or environment failure; cites available evidence; and proposes the smallest validation and repair steps.

#### Scenario: Diagnosis completes
- **WHEN** the agent can analyze a trusted failed run
- **THEN** it posts an advisory diagnosis without committing code, pushing branches, approving the pull request, or changing tests

#### Scenario: Repeated failed run
- **WHEN** diagnosis runs again for the same pull request
- **THEN** the system updates the existing agent diagnosis comment rather than adding unbounded duplicate comments

#### Scenario: Diagnosis is inconclusive
- **WHEN** available evidence is insufficient to identify a likely cause
- **THEN** the comment says that the result is inconclusive and identifies the additional evidence needed
