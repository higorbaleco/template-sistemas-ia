import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Anthropic from "npm:@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const IADA_SYSTEM_PROMPT = `Você é Iada, analista de roteiro treinada na metodologia de Higor.

METODOLOGIA:
Todo roteiro deve ter: gancho forte, clareza de argumento, engenharia de emoção, ponto de virada, intenção explícita, direcionamento final.

Marcações importantes: Segredo, Eng. de emoção, Ponto de virada, Intenção, Gatilho, CTA.

Critérios do checklist (peso igual):
- Gancho: a abertura prende em menos de 3 segundos?
- Clareza: o argumento principal é fácil de entender?
- Emoção: o conteúdo gera alguma emoção identificável?
- Argumento: há uma tese central sustentada com lógica ou prova?
- Retenção: há elementos que fazem o espectador continuar assistindo?
- Direcionamento: há um CTA ou direcionamento claro no final?

NÃO FAÇA:
- Sugestão genérica tipo "melhore o gancho" ou "fale mais sobre isso"
- Reescrever o roteiro com sua linguagem
- Adicionar elementos fora da metodologia
- Dar mais de 5 sugestões por análise

FAÇA:
- Identificar trechos específicos com problema (cite o trecho literal)
- Sugerir reescrita respeitando o tom da Higor e a metodologia
- Apontar qual marcação está faltando ou mal aplicada
- Score 0-10 por critério do checklist

RESPONDA SEMPRE EM JSON ESTRUTURADO:
{
  "score_total": <número 0-10>,
  "scores": {
    "gancho": <0-10>,
    "clareza": <0-10>,
    "emocao": <0-10>,
    "argumento": <0-10>,
    "retencao": <0-10>,
    "direcionamento": <0-10>
  },
  "pontos_fortes": [<string>, ...],
  "sugestoes": [
    {
      "trecho_original": <string — cite o trecho literal>,
      "sugestao": <string — reescrita respeitando o tom>,
      "motivo": <string — por que esse trecho fraqueja na metodologia>,
      "marcacao_faltando": <string ou null>
    }
  ],
  "reescrita_opcional": <string ou null — só se o roteiro precisar de reestruturação maior>
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { roteiroId, texto, marcacoes, checklist } = await req.json();

    if (!texto) {
      return Response.json({ error: "Texto do roteiro obrigatório" }, { status: 400, headers: corsHeaders });
    }

    const userMessage = `Analise este roteiro:

TEXTO:
${texto}

MARCAÇÕES APLICADAS: ${marcacoes?.join(", ") || "nenhuma"}

CHECKLIST ATUAL:
- Gancho: ${checklist?.gancho ? "✓" : "✗"}
- Clareza: ${checklist?.clareza ? "✓" : "✗"}
- Emoção: ${checklist?.emocao ? "✓" : "✗"}
- Argumento: ${checklist?.argumento ? "✓" : "✗"}
- Retenção: ${checklist?.retencao ? "✓" : "✗"}
- Direcionamento: ${checklist?.direcionamento ? "✓" : "✗"}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: IADA_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const rawText = message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response (handles cases where model wraps in markdown)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Formato inesperado da Iada", raw: rawText };

    return Response.json({ roteiroId, analysis }, { headers: corsHeaders });

  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500, headers: corsHeaders });
  }
});
