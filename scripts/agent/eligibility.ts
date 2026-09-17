export const TRUSTED_AUTHOR_ASSOCIATIONS = [
  "COLLABORATOR",
  "MEMBER",
  "OWNER",
] as const;

export type TrustedAuthorAssociation =
  (typeof TRUSTED_AUTHOR_ASSOCIATIONS)[number];

export interface PullRequestEligibilityInput {
  repositoryFullName?: unknown;
  baseRepositoryFullName?: unknown;
  headRepositoryFullName?: unknown;
  workflowHeadRepositoryFullName?: unknown;
  authorAssociation?: unknown;
  pullRequestNumber?: unknown;
  workflowHeadSha?: unknown;
  pullRequestHeadSha?: unknown;
}

export type PullRequestEligibility =
  | { eligible: true; pullRequestNumber: number }
  | { eligible: false; reason: string };

const TRUSTED_ASSOCIATIONS = new Set<string>(TRUSTED_AUTHOR_ASSOCIATIONS);
const REPOSITORY_NAME = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const COMMIT_SHA = /^[0-9a-f]{40}$/i;

function repositoryName(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const name = value.trim();
  return REPOSITORY_NAME.test(name) ? name.toLowerCase() : undefined;
}

/**
 * Evaluates all metadata needed before a secret-backed PR diagnosis.
 * Every trust signal is required; absent or malformed values fail closed.
 */
export function evaluatePullRequestEligibility(
  input: PullRequestEligibilityInput,
): PullRequestEligibility {
  const repository = repositoryName(input.repositoryFullName);
  const baseRepository = repositoryName(input.baseRepositoryFullName);
  const headRepository = repositoryName(input.headRepositoryFullName);
  const workflowHeadRepository = repositoryName(
    input.workflowHeadRepositoryFullName,
  );

  if (
    !repository ||
    !baseRepository ||
    !headRepository ||
    !workflowHeadRepository
  ) {
    return {
      eligible: false,
      reason: "Required repository metadata is missing or invalid.",
    };
  }
  if (
    repository !== baseRepository ||
    repository !== headRepository ||
    repository !== workflowHeadRepository
  ) {
    return {
      eligible: false,
      reason:
        "Diagnosis is restricted to pull requests whose head and base are in this repository.",
    };
  }

  const association =
    typeof input.authorAssociation === "string"
      ? input.authorAssociation.trim().toUpperCase()
      : "";
  if (!TRUSTED_ASSOCIATIONS.has(association)) {
    return {
      eligible: false,
      reason:
        "The pull request author does not have a trusted repository association.",
    };
  }

  if (
    typeof input.pullRequestNumber !== "number" ||
    !Number.isInteger(input.pullRequestNumber) ||
    input.pullRequestNumber <= 0
  ) {
    return {
      eligible: false,
      reason: "A valid pull request number is required.",
    };
  }

  if (
    typeof input.workflowHeadSha !== "string" ||
    typeof input.pullRequestHeadSha !== "string" ||
    !COMMIT_SHA.test(input.workflowHeadSha) ||
    !COMMIT_SHA.test(input.pullRequestHeadSha)
  ) {
    return {
      eligible: false,
      reason: "Valid workflow and pull request head SHAs are required.",
    };
  }
  if (
    input.workflowHeadSha.toLowerCase() !==
    input.pullRequestHeadSha.toLowerCase()
  ) {
    return {
      eligible: false,
      reason:
        "The failed workflow does not belong to the pull request current head commit.",
    };
  }

  return { eligible: true, pullRequestNumber: input.pullRequestNumber };
}

export function isPullRequestEligible(
  input: PullRequestEligibilityInput,
): boolean {
  return evaluatePullRequestEligibility(input).eligible;
}
