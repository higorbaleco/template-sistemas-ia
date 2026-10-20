# Protocolo: Validação de Dados Antes de Usar

**Checklist: antes de compilar em JSON ou usar em ligação, validar**

---

## Validação: 5 Passos

### 1. SITE/URL
```
[ ] URL é válida? (começa com http://)
[ ] Site carrega? (não está down)
[ ] É realmente da empresa? (logo, nome, contato confere)
[ ] Tem contato público? (telefone, email, WhatsApp)

Resultado:
  ✅ VALIDADO: site ativo, contato confirmado
  ⚠️ DUVIDOSO: site lento ou informações conflitantes
  ❌ REJEITADO: site não existe ou é de terceiro
```

### 2. GOOGLE MAPS + GOOGLE MEU NEGÓCIO
```
[ ] Link do Google Maps abre?
[ ] Endereço bate com o que você tem?
[ ] Telefone aparece? Qual?
[ ] WhatsApp público aparece?
[ ] Horários estão preenchidos?
[ ] Avaliações fazem sentido? (não é spam)

Resultado:
  ✅ VALIDADO: dados completos, recentes
  ⚠️ DUVIDOSO: algumas infos desatualizadas (2024)
  ❌ REJEITADO: endereço não existe ou é fake
```

### 3. INSTAGRAM
```
[ ] Handle existe? (@[nome_empresa])
[ ] É verificado? (✓ azul?)
[ ] Tem postagens recentes? (últimos 30 dias)
[ ] Seguidores fazem sentido? (não é bot)
[ ] Descrição menciona o negócio?

Resultado:
  ✅ VALIDADO: conta ativa, seguida por clientes reais
  ⚠️ DUVIDOSO: baixa atividade mas existe
  ❌ REJEITADO: não existe ou é fake (clones)
```

### 4. TELEFONE / WHATSAPP
```
[ ] Número tem 11 dígitos (Brasil) ou formato correto (outro país)?
[ ] DDD existe? (44 = Maringá, ok; 99 = não é DDD)
[ ] WhatsApp: você chamou ou testou? (ligar/testar)
[ ] Telefone fixo: você ligou?

Resultado:
  ✅ VALIDADO: testado, responde
  ⚠️ DUVIDOSO: número parece correto mas não testou
  ❌ REJEITADO: número inválido ou não existe
```

### 5. CNPJ (Brasil) / EIN (USA) / NIF (Portugal)
```
[ ] Número formatado corretamente? (XX.XXX.XXX/XXXX-XX)
[ ] Dígitos verificadores batem? (usar validador online)
[ ] Razão social bate com nome commercial?
[ ] Status é "ATIVA"?
[ ] Não é MEI (não precisa de CNPJ)?

Resultado:
  ✅ VALIDADO: CNPJ ativo, razão social confere
  ⚠️ DUVIDOSO: CNPJ válido mas não achei match de nome
  ❌ REJEITADO: CNPJ inválido ou empresa inativa
```

---

## Checklist Visual

Antes de usar em ligação, preencher:

```
Empresa: [NOME]
Data validação: [DATA]

VALIDAÇÃO:

[ ] Site
    ✅ Ativo     ⚠️ Duvidoso     ❌ Rejeitado

[ ] Google Maps
    ✅ Completo     ⚠️ Parcial     ❌ Incompleto

[ ] Instagram
    ✅ Ativo     ⚠️ Baixa atividade     ❌ Não existe

[ ] Telefone/WhatsApp
    ✅ Testado     ⚠️ Parecido correto     ❌ Inválido

[ ] CNPJ (se Brasil)
    ✅ Válido     ⚠️ Sem match nome     ❌ Inválido

RESULTADO FINAL:
  [ ] PRONTO PARA USAR (todos ✅)
  [ ] USAR COM CAUTELA (1-2 ⚠️)
  [ ] DESCARTAR (1+ ❌)
```

---

## Ferramenta Online de Validação

**CNPJ Brasil**:
- https://www.validador.com.br (requer VPN se fora do Brasil)
- Alternativa: buscar direto no site da Receita Federal

**EIN USA**:
- https://www.irs.gov/ein-public-search (público)

**NIF Portugal**:
- https://seuportugal.gov.pt/

**Telefone**:
- Ligar ou enviar WhatsApp de teste

---

## Matriz de Decisão

```
                Dados Completos?
                    SIM         NÃO
          ┌──────────────────────────┐
   Testado│ ✅ USAR      | ⚠️ USAR   │
   SIM    │              | COM       │
          │              | CAUTELA   │
   ─────────────────────────────────┤
   NÃO    │ ⚠️ USAR      | ❌ NÃO    │
   TESTADO│ COM CAUTELA  | USAR      │
          └──────────────────────────┘
```

---

## Exemplo de Validação: Don Boturi

```
Empresa: Don Boturi Pizzaria
Data validação: 19/10/2026

[ ✅ ] Site: nao encontrado (ok, pizzaria pequena)
[ ✅ ] Google Maps: av. mandacaru 3000, endereco confere
       Telefone: 44 3222-5555 (listado)
       WhatsApp: 44 99999-1234 (confirmado em Google Meu Negócio)
       Horarios: seg-dom 18h-24h (ok)
       Avaliacoes: 4.7 stars, 320 avaliacoes (legitimas)

[ ⚠️  ] Instagram: @donboturipizzaria nao verificado (mas ativo, 1.2k followers, posts recentes)

[ ✅ ] Telefone/WhatsApp: ligamos, josé atendeu, confirmou que eh da pizzaria

[ ❌ ] CNPJ: nao achamos (pizzaria pode ser MEI, pode ser inativa na receita)

RESULTADO: PRONTO PARA USAR (99% confiança)
Motivo: endereço verificado, telefone testado, Google Maps confirmado
Risco baixo: CNPJ não encontrado mas não é blocker para ligação
```

---

## Quando NÃO Usar (Descartar)

❌ **Descartar se**:
- Endereço não existe ou está inativo
- Telefone é inválido ou não existe
- Empresa está inativa em registros públicos
- Múltiplas fontes conflitam (nome diferente, endereço diferente)
- É cópia/clone de outra empresa (mesmo Instagram mas CNPJ diferente)

---

## Nota Importante

**Você não precisa ter 100% dos dados para ligar.**

Basta ter:
- ✅ Endereço verificado (Google Maps)
- ✅ Telefone/WhatsApp público (Google Meu Negócio ou Instagram)
- ✅ Confirmação que é a empresa (ligação teste ou conversa)

CNPJ, site, Instagram = extras que ajudam mas não são blocker.

---

**Versão**: 1.0 | **Data**: 19/10/2026 | **Uso**: Antes de cada ligação
