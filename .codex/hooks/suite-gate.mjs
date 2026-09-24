#!/usr/bin/env node
// Trava mecanica: suite vermelha bloqueia avanco, inclusive urgencia.
// Referencia: docs/05-travas-e-quality-gates.md, secao 5. CLAUDE.md, regra 3.
//
// Convencao: apos cada execucao, o subagente test-runner escreve o status em
// .claude/hooks/.suite-status.json no formato { "status": "green" | "red", "timestamp": "..." }.
// Este hook confere esse arquivo antes de permitir git commit ou git push.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

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

  const isGate = /\bgit\s+(commit|push)\b/.test(command);
  if (!isGate) process.exit(0);

  const cwd = payload?.cwd || process.cwd();
  const statusPath = join(cwd, ".claude", "hooks", ".suite-status.json");

  if (!existsSync(statusPath)) {
    // Sem execucao registrada ainda: nao bloqueia projeto novo sem codigo,
    // mas orienta a rodar test-runner antes de commitar mudanca real.
    process.exit(0);
  }

  let status;
  try {
    status = JSON.parse(readFileSync(statusPath, "utf8"));
  } catch {
    process.exit(0);
  }

  if (status?.status === "red") {
    process.stderr.write(
      "Bloqueado: suite de testes esta vermelha (ultima execucao: " +
        (status.timestamp || "desconhecida") +
        ").\n" +
        "Resolva a falha antes de commitar ou dar push. Sem excecao por urgencia.\n" +
        "Ver docs/05-travas-e-quality-gates.md, secao 5.\n"
    );
    process.exit(2);
  }

  process.exit(0);
});
