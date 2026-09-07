# Gestão de Instâncias — Evolution API

Workflows para criar, conectar, listar e monitorar instâncias WhatsApp na Evolution API.

## Workflows Disponíveis

| Workflow | Descrição | Quando Usar |
|----------|-----------|------------|
| **Criar Instancia.json** | Cria nova instância com nome único | Primeira vez que vai disparar para um cliente/campanha |
| **Conectar Instancia (QR Code).json** | Gera QR code para conectar ao WhatsApp | Após criar; escaneie o QR no celular |
| **Listar Instancias.json** | Lista todas as instâncias criadas | Para encontrar instance_id de uma existente |
| **Verificar Status da Instancia.json** | Checa se está "connected" ou "disconnected" | Antes de disparo; diagnóstico de problemas |
| **Deletar-Logout Instancia.json** | Desconecta e remove instância (irreversível) | Limpeza; encerramento de campanha |

## Fluxo Recomendado

### 1. Criar Instância
```
Execute: Criar Instancia.json
Input: { "instance_name": "promo-q4" }
Output: Copie o "instance_id"
```

### 2. Conectar
```
Execute: Conectar Instancia (QR Code).json
Input: { "instance_id": "<copie da saída anterior>" }
Output: Escaneie o QR com o celular no WhatsApp
Aguarde ~30s até confirmar conexão
```

### 3. Verificar Status
```
Execute: Verificar Status da Instancia.json
Input: { "instance_id": "<seu instance_id>" }
Output: Deve retornar "connected"
```

### 4. Pronto!
Use este `instance_id` em todos os workflows de envio (`03-Envio-de-Mensagens/`).

---

## Conceitos Chave

### O que é uma Instância?

Uma **instância** é uma sessão autenticada do WhatsApp na Evolution API. Cada instância é:
- **Independente**: tem seu próprio número (ou número compartilhado, dependendo da configuração)
- **Reutilizável**: uma mesma instância pode enviar múltiplas mensagens
- **Monitorável**: pode estar "connected" ou "disconnected"

### instance_id vs. nome da instância

- **instance_name**: nome amigável que você escolhe (ex: "promo-q4", "newsletter")
- **instance_id**: ID único gerado pela API (ex: "abc123def456")

Ambos identificam a instância, mas `instance_id` é o que você passa nos workflows de envio.

### Reconexão

Se uma instância desconectar (WhatsApp atualizou, internet caiu, etc.):
1. Verifique o status com `Verificar Status da Instancia.json`
2. Se "disconnected", execute `Conectar Instancia (QR Code).json` novamente
3. Escaneie o novo QR

---

## Segurança & Boas Práticas

- **Não reutilize a mesma instância para múltiplos números**: cada instância = um número de WhatsApp
- **Monitore reconexões**: instâncias instáveis indicam problemas na rede ou no WhatsApp
- **Limpe instâncias antigas**: se não usar mais, delete para evitar confusão
- **Nomes únicos**: use nomes descritivos e únicos (ex: "promo-natal-2025", não apenas "promo")

---

## Troubleshooting

| Problema | Causa Possível | Solução |
|----------|----------------|---------|
| Erro 401 ao criar | Credencial não configurada | Ver `00-Setup/CREDENCIAIS.md` |
| QR code não scanneia | Celular sem câmera focada | Tente novamente, escaneie com cuidado |
| Status retorna "disconnected" | Sessão expirou | Execute `Conectar Instancia (QR Code).json` novamente |
| Instância deletada acidentalmente | Irreversível | Crie nova com `Criar Instancia.json` |

---

**Última atualização**: 2026-09-07
