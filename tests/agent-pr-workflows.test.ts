import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { describe, expect, it } from "vitest";

function workflowPath(name: string): string {
  return resolve(process.cwd(), ".github", "workflows", name);
}

function readWorkflow(name: string): Record<string, unknown> {
  return parse(readFileSync(workflowPath(name), "utf8"));
}

function text(name: string): string {
  return readFileSync(workflowPath(name), "utf8");
}

describe("pull request E2E workflow", () => {
  it("is an unprivileged pull_request workflow with bounded execution", () => {
    const workflow = readWorkflow("pr-e2e.yml") as any;
    expect(workflow.on.pull_request).toBeDefined();
    expect(workflow.permissions).toEqual({ contents: "read" });
    expect(workflow.concurrency["cancel-in-progress"]).toBe(true);
    expect(workflow.jobs.e2e["timeout-minutes"]).toBeGreaterThan(0);
    expect(text("pr-e2e.yml")).not.toMatch(/AGENT_API_KEY|secrets\./);
  });

  it("uses locked pnpm, Chromium, build/test, and failure-only seven-day evidence", () => {
    const source = text("pr-e2e.yml");
    expect(source).toContain("pnpm@10.17.1");
    expect(source).toContain("pnpm install --frozen-lockfile");
    expect(source).toContain("playwright install --with-deps chromium");
    expect(source).toContain("pnpm build");
    expect(source).toContain("pnpm test:e2e");
    expect(source).toContain("if: failure()");
    expect(source).toContain("retention-days: 7");
    expect(source).toContain("playwright-report/");
    expect(source).toContain("test-results/");
  });
});

describe("post-failure diagnosis workflow", () => {
  it("uses workflow_run and minimal permissions", () => {
    const workflow = readWorkflow("pr-diagnosis.yml") as any;
    expect(workflow.on.workflow_run.workflows).toEqual(["Pull request E2E"]);
    expect(workflow.on.workflow_run.types).toEqual(["completed"]);
    expect(workflow.permissions).toEqual({
      contents: "read",
      issues: "write",
      actions: "read",
      "pull-requests": "read",
      checks: "read",
    });
    expect(workflow.jobs.diagnose["timeout-minutes"]).toBeGreaterThan(0);
  });

  it("guards failure, pull_request origin, same repository, and PR metadata", () => {
    const condition = (readWorkflow("pr-diagnosis.yml") as any).jobs.diagnose
      .if;
    expect(condition).toContain("conclusion == 'failure'");
    expect(condition).toContain("event == 'pull_request'");
    expect(condition).toContain(
      "head_repository.full_name == github.repository",
    );
    expect(condition).toContain("pull_requests[0].number != null");
  });

  it("never checks out or directly executes PR code", () => {
    const source = text("pr-diagnosis.yml");
    expect(source).not.toContain("actions/checkout");
    expect(source).not.toContain("pull_request_target");
    expect(source).not.toMatch(/pnpm (install|build|test)/);
    expect(source).not.toContain(
      "github.event.workflow_run.head_sha }}\n        with:",
    );
    expect(source).toContain("github.event.repository.default_branch");
    expect(source).toContain("/contents/$path");
    expect(source).toContain("secrets.AGENT_API_KEY");
  });
});
