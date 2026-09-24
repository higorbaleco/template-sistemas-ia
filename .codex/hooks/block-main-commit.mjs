#!/usr/bin/env node
// Trava mecanica: nenhum commit direto na branch main.
// Referencia: docs/05-travas-e-quality-gates.md, secao 2. CLAUDE.md, regra 1.

import { execSync } from "node:child_process";

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let payload;
  try {
    payload = JSON.parse(input);
  } catch {
    process.exit(0);
  }

  const command = payload?.tool_input?.command;
  if (typeof command !== "string") process.exit(0);

  const isCommit = /\bgit\s+commit\b/.test(command);
  if (!isCommit) process.exit(0);

  let branch = "";
  try {
    branch = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd: payload?.cwd || process.cwd(),
    })
      .toString()
      .trim();
  } catch {
    process.exit(0);
  }

  const protectedBranches = new Set(["main", "master"]);
  if (!protectedBranches.has(branch)) process.exit(0);

  process.stderr.write(
    `Commit bloqueado: branch atual e '${branch}'.\n` +
      "Nenhum commit direto na branch principal. Crie branch feat/, fix/, chore/ ou refactor/ antes de commitar.\n" +
      "Ver docs/05-travas-e-quality-gates.md, secao 2.\n"
  );
  process.exit(2);
});
