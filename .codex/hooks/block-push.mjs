#!/usr/bin/env node
// Trava mecanica: git push nunca roda sem parada humana.
// Referencia: docs/05-travas-e-quality-gates.md, secao 3. CLAUDE.md, regra 2.

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

  const isPush = /\bgit\s+push\b/.test(command);
  if (!isPush) process.exit(0);

  const authorized = process.env.CLAUDE_ALLOW_PUSH === "1";
  if (authorized) process.exit(0);

  process.stderr.write(
    "git push bloqueado: ponto de parada humana obrigatorio.\n" +
      "Rode /ship, apresente o relatorio ao owner e obtenha autorizacao explicita antes de liberar o push.\n" +
      "Ver docs/05-travas-e-quality-gates.md, secao 3.\n"
  );
  process.exit(2);
});
