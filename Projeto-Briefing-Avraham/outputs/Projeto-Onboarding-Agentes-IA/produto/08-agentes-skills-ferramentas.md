# Agentes, Skills e Ferramentas Necessarias

## Objetivo deste documento

Mapear tudo que precisamos para construir o `Avraham Agent Studio` em partes, sem baguncar o site atual e sem perder a inteligencia comercial ja documentada.

## Agentes necessarios

### 1. Estrategista de Produto

Responsavel por transformar o processo comercial em produto.

Entregas:

- escopo do MVP;
- priorizacao;
- criterios de sucesso;
- roadmap;
- definicao de pronto.

### 2. UX Designer de Produto

Responsavel por fluxos, telas, estados e usabilidade.

Entregas:

- mapa de jornadas;
- wireframes;
- prototipo navegavel;
- regras de formulario;
- estados vazios, loading e erro.

### 3. UI Designer / Design System

Responsavel pela camada visual.

Entregas:

- tokens;
- componentes;
- padroes de layout;
- direcao visual;
- telas de alta fidelidade.

### 4. Frontend Engineer

Responsavel pela implementacao da interface.

Entregas:

- app web;
- componentes reutilizaveis;
- formulários;
- dashboards;
- calculadora;
- integracao com backend.

### 5. Backend / Data Engineer

Responsavel por banco, API, seguranca e persistencia.

Entregas:

- modelo de dados;
- banco Supabase;
- regras de acesso;
- endpoints;
- armazenamento de arquivos;
- auditoria basica.

### 6. AI Workflow Engineer

Responsavel por transformar respostas em saidas inteligentes.

Entregas:

- prompts de proposta;
- prompts de plano de onboarding;
- prompts de relatorio mensal;
- avaliacao de fit;
- resumo de oportunidade;
- guardrails de geracao.

### 7. Especialista Comercial

Responsavel por garantir que o sistema ajude a vender melhor.

Entregas:

- roteiro de discovery;
- criterios de fit;
- criterios de desqualificacao;
- narrativa de proposta;
- regras de precificacao.

### 8. Especialista de Implementacao / CS

Responsavel por garantir que o onboarding gere execucao real.

Entregas:

- checklist de implementacao;
- plano do cliente;
- entregaveis mensais;
- metricas de sucesso;
- riscos operacionais.

### 9. QA / Validador

Responsavel por testar fluxos e evitar quebra.

Entregas:

- cenarios de teste;
- teste de calculos;
- teste de formularios;
- teste responsivo;
- validacao de build.

### 10. DevOps / Deploy

Responsavel por publicar com seguranca.

Entregas:

- ambiente local;
- ambiente de preview;
- variaveis de ambiente;
- deploy;
- dominio/subdominio;
- rollback.

## Skills internas necessarias

### Discovery comercial

Capacidade de conduzir perguntas que revelam:

- dor;
- urgencia;
- impacto financeiro;
- volume;
- decisores;
- bloqueios;
- fit.

### Diagnostico e fit score

Capacidade de transformar respostas em:

- pontuacao;
- classificacao;
- bloqueios;
- recomendacao.

### Precificacao

Capacidade de calcular:

- horas;
- custo interno;
- margem;
- setup;
- mensalidade;
- tokens;
- ROI.

### Geracao de proposta

Capacidade de criar uma proposta com:

- dor do cliente;
- impacto;
- solucao;
- escopo;
- investimento;
- ROI;
- proximos passos.

### Onboarding operacional

Capacidade de transformar briefing em:

- agentes;
- fluxos;
- regras;
- pendencias;
- cronograma;
- responsaveis.

### ROI e relatorio mensal

Capacidade de provar valor usando:

- receita atribuida;
- horas economizadas;
- perdas evitadas;
- leads qualificados;
- vendas influenciadas;
- custo mensal.

## Ferramentas recomendadas

### Produto e documentacao

- Markdown para documentacao viva.
- Mermaid para fluxos.
- Google Sheets para validacao inicial dos calculos.
- Figma ou arquivo visual local para prototipagem, se necessario.

### App

Opcoes:

- React + Vite para MVP rapido.
- Next.js se quisermos app separado com rotas e backend mais integrado.
- TanStack Start se quisermos manter mais proximidade com o site atual.

Recomendacao:

```text
Comecar separado com React/Vite ou TanStack Start, sem mexer no site principal.
```

### UI

- Tailwind.
- Radix/shadcn se o app for novo.
- Lucide icons para alinhar com o site atual.
- Recharts para graficos de ROI.

### Banco e auth

- Supabase.

Motivos:

- banco Postgres;
- auth;
- storage;
- RLS;
- boa velocidade para MVP.

### IA

- OpenAI API para geracao e resumo.

Usos:

- resumo da discovery;
- proposta;
- plano de onboarding;
- relatorio mensal;
- sugestao de agentes;
- sugestao de riscos.

### Automacao

- n8n, Make ou Zapier.

Usos:

- criar lead;
- avisar time;
- salvar arquivos;
- atualizar planilha;
- enviar follow-up;
- conectar CRM.

### Integracoes futuras

- Google Sheets.
- Google Drive.
- Google Calendar.
- CRM usado pela Avraham.
- WhatsApp/Z-API ou stack usada nos clientes.
- Ferramenta de assinatura/proposta, se existir.

## Artefatos que ainda precisamos criar

### Documentacao

- Design system do Studio.
- Arquitetura tecnica.
- Especificacao das rotas.
- Especificacao dos prompts.
- Especificacao dos calculos.
- Plano de seguranca.
- Plano de deploy.

### Produto

- Wireframes.
- Prototipo navegavel.
- Biblioteca de componentes.
- Estados das telas.
- Textos principais.

### Engenharia

- app base;
- banco;
- autenticacao;
- seed de parametros;
- calculadora;
- gerador de proposta;
- gerador de plano;
- modulo de ROI.

## Ordem recomendada

1. Fechar documentacao de produto e design.
2. Criar arquitetura tecnica.
3. Criar prototipo visual.
4. Criar app separado.
5. Implementar dashboard + oportunidades.
6. Implementar discovery + fit.
7. Implementar calculadora.
8. Implementar proposta.
9. Implementar onboarding.
10. Implementar ROI.
11. Criar calculadora publica no site.

