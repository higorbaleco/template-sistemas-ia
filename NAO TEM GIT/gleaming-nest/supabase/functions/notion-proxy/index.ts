import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const NOTION_TOKEN = Deno.env.get("NOTION_TOKEN")!;
const NOTION_VERSION = "2022-06-28";

// Notion database IDs
const DATABASES = {
  ganchos: "623cb39e06864fd9b8a07b1da5d8ab37",
  roteiros: "ff760037ac3c455b89dd9df181eacf71",
  inspiracoes: "1d748ed258c94f5480f1f95ebbde4666",
  concorrentes: "8514a23ab2b6427aae6cbb0be263b406",
} as const;

type DatabaseKey = keyof typeof DATABASES;

const headers = {
  "Authorization": `Bearer ${NOTION_TOKEN}`,
  "Notion-Version": NOTION_VERSION,
  "Content-Type": "application/json",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { database, action, payload } = await req.json();

    if (!database || !DATABASES[database as DatabaseKey]) {
      return Response.json({ error: "Database inválido" }, { status: 400, headers: corsHeaders });
    }

    const dbId = DATABASES[database as DatabaseKey];
    let notionRes: Response;

    switch (action) {
      case "query":
        notionRes = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload ?? {}),
        });
        break;

      case "create":
        notionRes = await fetch(`https://api.notion.com/v1/pages`, {
          method: "POST",
          headers,
          body: JSON.stringify({ parent: { database_id: dbId }, properties: payload }),
        });
        break;

      case "update":
        notionRes = await fetch(`https://api.notion.com/v1/pages/${payload.pageId}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ properties: payload.properties }),
        });
        break;

      case "get":
        notionRes = await fetch(`https://api.notion.com/v1/pages/${payload.pageId}`, {
          method: "GET",
          headers,
        });
        break;

      default:
        return Response.json({ error: "Action inválida" }, { status: 400, headers: corsHeaders });
    }

    const data = await notionRes.json();
    return Response.json(data, { headers: corsHeaders });

  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500, headers: corsHeaders });
  }
});
