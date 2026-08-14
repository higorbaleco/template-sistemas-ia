---
description: Verifica consumo de janela e compacta preservando decisao, arquivos tocados e proximo passo. Usar por volta de sessenta por cento de contexto.
---

Verifique o consumo atual de contexto desta janela.

Se estiver acima de aproximadamente sessenta por cento e a tarefa ainda está em andamento: compacte preservando três coisas, e apenas três: decisão tomada até agora, arquivos já tocados, próximo passo exato. Descarte o restante do histórico de exploração.

Se a tarefa já foi concluída: não compacte, encerre a janela. Compactação serve para continuar a mesma tarefa, não para começar outra (`docs/06-economia-de-contexto-e-tokens.md`, seção 4).
