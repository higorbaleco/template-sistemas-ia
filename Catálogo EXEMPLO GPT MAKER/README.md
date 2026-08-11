# Catálogo Lab

Shell interno em `Next.js 14 + TypeScript` para expor catálogos demo em interface humana e endpoints JSON espelhados para agentes de IA.

## Stack e premissas

- `Next.js 14` com App Router
- seeds locais em TypeScript
- sem banco de dados e sem CRUD administrativo no MVP
- URLs humanas e URLs de API compartilham a mesma lógica de filtros
- deploy preparado para Netlify com runtime oficial de Next.js

## Rotas principais

- Dashboard: `/catalogos`
- Segmentos:
  - `/catalogos/imoveis`
  - `/catalogos/veiculos`
  - `/catalogos/ecommerce`
  - `/catalogos/food`
- Catálogos por empresa:
  - `/catalogos/empresa/imobiliaria-horizonte/imoveis`
  - `/catalogos/empresa/prime-motors/veiculos`
  - `/catalogos/empresa/urban-store/ecommerce`
  - `/catalogos/empresa/pizza-bella/food`
- Detalhe de item:
  - `/catalogos/imoveis/residencial-aurora`
  - `/catalogos/empresa/pizza-bella/food/pizza-margherita`

## Endpoints para IA

- Listagem por segmento: `/api/catalogos/imoveis`
- Listagem por empresa: `/api/catalogos/empresa/prime-motors/veiculos`
- Detalhe por item: `/api/catalogos/veiculos/corolla-xei-2024`

Exemplos com filtros:

- `/api/catalogos/imoveis?cidade=maringa&quartos_min=3&preco_max=700000`
- `/api/catalogos/veiculos?carroceria=suv&cambio=automatico`
- `/api/catalogos/food?sem=cebola&serve_min=4`

## Como rodar localmente

```bash
npm install
npm run dev
```

Preview de produção:

```bash
npm run build
npm run preview
```

## Deploy no Netlify

O projeto já inclui `netlify.toml` com:

- build command: `npm run build`
- Node: `20`
- plugin: `@netlify/plugin-nextjs`

Premissa de deploy:

- usar o runtime oficial do Netlify para Next.js
- não depender de banco, Redis, filas ou serviços customizados no MVP

## Onde editar os dados

- empresas e segmentos: `lib/catalog-data.ts`
- tipos compartilhados: `lib/catalog-types.ts`
- índices e consultas: `lib/catalog-index.ts`
- regras de filtros e payloads: `lib/catalog-utils.ts`

## Como adicionar mais itens

1. Adicione a empresa ou item seed em `lib/catalog-data.ts`.
2. Respeite o `segment`, `slug` estável e os campos universais do item.
3. Preencha os detalhes específicos do segmento no bloco correto.
4. Rode `npm run build` para validar rotas, payloads e tipagem.

## Observações de UX e performance

- interface mobile-first com cards Bento e alvos de toque amplos
- foco visível, campos rotulados e suporte a `prefers-reduced-motion`
- endpoints JSON espelham a mesma base mostrada nas listagens humanas
