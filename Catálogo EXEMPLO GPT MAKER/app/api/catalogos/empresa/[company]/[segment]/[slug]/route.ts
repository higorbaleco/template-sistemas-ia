import { NextRequest } from "next/server";
import { buildCatalogDetailPayload, getItemBySlug, resolveScope } from "@/lib/catalog-utils";
import { SegmentKey } from "@/lib/catalog-types";

type Params = {
  params: { company: string; segment: SegmentKey; slug: string };
};

export function GET(_request: NextRequest, { params }: Params) {
  const scope = resolveScope(params.segment, params.company);
  if (!scope) {
    return Response.json({ error: "Catalog not found" }, { status: 404 });
  }

  const item = getItemBySlug(params.segment, params.slug, params.company);

  if (!item) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  return Response.json(buildCatalogDetailPayload(scope, item));
}
