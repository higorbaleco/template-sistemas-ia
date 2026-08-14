# Onda 1 - Limpeza Segura

Atualizado em `2026-07-22`.

## Objetivo
- Liberar espaço sem tocar em código-fonte.
- Evitar qualquer ação destrutiva em projetos protegidos ou com risco Git não resolvido.

## Ganho Estimado
- Onda 1 sem tocar nos projetos protegidos: `~5.75 GB`
- Onda 1 máxima nesta pasta, incluindo protegidos após snapshot: `~8.38 GB`

## Ordem Recomendada

### Grupo A - Não protegidos com grande ganho
1. `SOCIAL-MEDIA-OLLEG`
   - limpar `app/node_modules`
   - limpar `app/.next`
   - ganho estimado: `~0.84 GB`
2. `OUTBOUND | OLLEG`
   - limpar `.venv`
   - limpar `dashboard/node_modules`
   - ganho estimado: `~0.66 GB`
3. `Calculadora-custos-ia`
   - limpar `node_modules`
   - ganho estimado: `~0.49 GB`
4. `Avraham New CRM/avraham-hub`
   - limpar `node_modules`
   - ganho estimado: `~0.40 GB`
5. `GitHub/avraham-reach`
   - limpar `node_modules`
   - ganho estimado: `~0.39 GB`
6. `Gerador de Briefing/avraham-briefing-hub`
   - limpar `node_modules`
   - ganho estimado: `~0.35 GB`
7. `smart-finance-central`
   - limpar `node_modules`
   - ganho estimado: `~0.34 GB`
8. `Decide Aí Food`
   - limpar `node_modules`
   - limpar `.next`
   - ganho estimado: `~0.36 GB`
9. `CRM Avraham ANTIGO FLOW`
   - limpar `node_modules`
   - ganho estimado: `~0.25 GB`
10. `Criador de Agentes GPT Maker`
   - limpar `dashboard/node_modules`
   - ganho estimado: `~0.21 GB`
11. `Proposta avraham automatica`
   - limpar `node_modules`
   - ganho estimado: `~0.19 GB`
12. `Higir - Dash Campanha Disparo`
   - limpar `avraham-site/node_modules`
   - ganho estimado: `~0.07 GB`

### Grupo B - Locais sem remoto, só depois de snapshot
1. `App da Bíblia`
2. `CALCULO MARGEM DISPAROS TOPSEND`
3. `my-project`
4. `Painel Feira`
5. `Gerador de Cardápio Semanal`
6. `Berteli Automotive`

Regra: nesses, primeiro proteger o estado local; depois limpar artefatos.

### Grupo C - Protegidos, só depois de sincronizar
1. `Gerador de Propostas | Avraham`
2. `Painel SVP Disparos WhatsApp`
3. `SITE AVRAHAM 2026`
4. `Catalogo Car Systema`
5. `Cardápio Online | Pizza do Gordo`

## Backups e Arquivos Frios
- Tirar da pasta principal:
  - `Kaique | LP Avraham.zip`
  - `Ferramenta Consulta .zip`
  - `Agentes | ClaudeCode xquads.zip`
  - `avrahamcrm-main.zip`
  - `catalogo-whatsapp-google-sheets.zip`
  - `dash-central-contingencia-sheets.zip`
- Ganho pequeno aqui, mas melhora a organização visual e reduz duplicidade.

## Critérios De Bloqueio
- Não limpar nada em repo `dirty` sem olhar o que mudou.
- Não limpar projeto local-only sem estratégia de versionamento.
- Não limpar projeto protegido antes de snapshot e checagem do guia.
