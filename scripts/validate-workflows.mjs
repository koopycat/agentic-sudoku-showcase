import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";
import { parse } from "yaml";

const workflows = [];
for await (const file of glob(".github/workflows/*.{yml,yaml}"))
  workflows.push(file);
if (workflows.length === 0) throw new Error("No GitHub workflows found.");

for (const file of workflows) {
  const text = await readFile(file, "utf8");
  const document = parse(text);
  if (!document || typeof document !== "object" || !document.jobs)
    throw new Error(`${file}: workflow must define jobs`);
  if (!document.permissions || typeof document.permissions !== "object")
    throw new Error(`${file}: top-level permissions are required`);
  if (/pull_request_target/.test(text))
    throw new Error(`${file}: pull_request_target is forbidden`);
  if (/uses:\s+[^\s]+@(main|master|v\d+)\b/.test(text))
    throw new Error(`${file}: actions must be pinned to immutable revisions`);
  if (file.endsWith("pr-e2e.yml") && /AGENT_API_KEY|secrets\./.test(text))
    throw new Error(`${file}: PR test code must not receive secrets`);
  if (file.endsWith("pr-diagnosis.yml") && /actions\/checkout/.test(text))
    throw new Error(`${file}: diagnosis must not checkout PR code`);
  console.log(`validated ${file}`);
}
