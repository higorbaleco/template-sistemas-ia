import { NextRequest } from "next/server";
import { buildCatalogDetailPayload, getItemBySlug, resolveScope } from "@/lib/catalog-utils";
import { SegmentKey } from "@/lib/catalog-types";

type Params = {
  params: Promise<{ segment: string; slug: string }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  const segment = resolvedParams.segment as SegmentKey;
  const scope = resolveScope(segment);
  if (!scope) {
    return Response.json({ error: "Segment not found" }, { status: 404 });
  }

  const item = getItemBySlug(segment, resolvedParams.slug);

  if (!item) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  return Response.json(buildCatalogDetailPayload(scope, item));
}
