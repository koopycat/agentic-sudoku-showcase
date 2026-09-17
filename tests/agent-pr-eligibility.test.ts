import { describe, expect, it } from "vitest";

import {
  evaluatePullRequestEligibility,
  isPullRequestEligible,
} from "../scripts/agent/eligibility.ts";

const sha = "0123456789abcdef0123456789abcdef01234567";

function eligibleInput() {
  return {
    repositoryFullName: "octo/sudoku",
    baseRepositoryFullName: "octo/sudoku",
    headRepositoryFullName: "octo/sudoku",
    workflowHeadRepositoryFullName: "octo/sudoku",
    authorAssociation: "MEMBER",
    pullRequestNumber: 42,
    workflowHeadSha: sha,
    pullRequestHeadSha: sha,
  };
}

describe("pull request diagnosis eligibility", () => {
  it.each(["OWNER", "MEMBER", "COLLABORATOR"])(
    "accepts trusted same-repository association %s",
    (authorAssociation) => {
      expect(
        isPullRequestEligible({ ...eligibleInput(), authorAssociation }),
      ).toBe(true);
    },
  );

  it.each(["CONTRIBUTOR", "FIRST_TIME_CONTRIBUTOR", "FIRST_TIMER", "NONE", ""])(
    "rejects untrusted association %s",
    (authorAssociation) => {
      expect(
        evaluatePullRequestEligibility({
          ...eligibleInput(),
          authorAssociation,
        }).eligible,
      ).toBe(false);
    },
  );

  it("rejects forked pull requests", () => {
    const result = evaluatePullRequestEligibility({
      ...eligibleInput(),
      headRepositoryFullName: "attacker/sudoku",
    });
    expect(result).toEqual({
      eligible: false,
      reason:
        "Diagnosis is restricted to pull requests whose head and base are in this repository.",
    });
  });

  it("rejects a workflow head repository that does not match", () => {
    expect(
      isPullRequestEligible({
        ...eligibleInput(),
        workflowHeadRepositoryFullName: "attacker/sudoku",
      }),
    ).toBe(false);
  });

  it("rejects stale or unrelated workflow SHAs", () => {
    expect(
      isPullRequestEligible({
        ...eligibleInput(),
        pullRequestHeadSha: "f".repeat(40),
      }),
    ).toBe(false);
  });

  it.each([
    "repositoryFullName",
    "baseRepositoryFullName",
    "headRepositoryFullName",
    "workflowHeadRepositoryFullName",
    "authorAssociation",
    "pullRequestNumber",
    "workflowHeadSha",
    "pullRequestHeadSha",
  ] as const)("fails closed when %s is missing", (key) => {
    const input: Record<string, unknown> = eligibleInput();
    delete input[key];
    expect(isPullRequestEligible(input)).toBe(false);
  });
});
