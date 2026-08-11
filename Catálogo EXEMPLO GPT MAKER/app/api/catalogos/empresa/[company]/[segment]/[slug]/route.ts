import { NextRequest } from "next/server";
import { buildCatalogDetailPayload, getItemBySlug, resolveScope } from "@/lib/catalog-utils";
import { SegmentKey } from "@/lib/catalog-types";

type Params = {
  params: Promise<{ company: string; segment: string; slug: string }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  const segment = resolvedParams.segment as SegmentKey;
  const scope = resolveScope(segment, resolvedParams.company);
  if (!scope) {
    return Response.json({ error: "Catalog not found" }, { status: 404 });
  }

  const item = getItemBySlug(segment, resolvedParams.slug, resolvedParams.company);

  if (!item) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  return Response.json(buildCatalogDetailPayload(scope, item));
}
