import { NextRequest } from "next/server";
import { buildCatalogListPayload, resolveScope, toFilterState } from "@/lib/catalog-utils";
import { SegmentKey } from "@/lib/catalog-types";

type Params = {
  params: { segment: SegmentKey };
};

export function GET(request: NextRequest, { params }: Params) {
  const scope = resolveScope(params.segment);
  if (!scope) {
    return Response.json({ error: "Segment not found" }, { status: 404 });
  }

  const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const filters = toFilterState(params.segment, searchParams);
  return Response.json(buildCatalogListPayload(scope, filters));
}
