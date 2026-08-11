import { NextRequest } from "next/server";
import { buildCatalogDetailPayload, getItemBySlug, resolveScope } from "@/lib/catalog-utils";
import { SegmentKey } from "@/lib/catalog-types";

type Params = {
  params: { segment: SegmentKey; slug: string };
};

export function GET(_request: NextRequest, { params }: Params) {
  const scope = resolveScope(params.segment);
  if (!scope) {
    return Response.json({ error: "Segment not found" }, { status: 404 });
  }

  const item = getItemBySlug(params.segment, params.slug);

  if (!item) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  return Response.json(buildCatalogDetailPayload(scope, item));
}
