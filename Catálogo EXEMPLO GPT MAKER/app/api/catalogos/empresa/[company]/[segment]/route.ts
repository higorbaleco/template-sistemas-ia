import { NextRequest } from "next/server";
import { buildCatalogListPayload, resolveScope, toFilterState } from "@/lib/catalog-utils";
import { SegmentKey } from "@/lib/catalog-types";

type Params = {
  params: Promise<{ company: string; segment: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  const segment = resolvedParams.segment as SegmentKey;
  const scope = resolveScope(segment, resolvedParams.company);
  if (!scope) {
    return Response.json({ error: "Catalog not found" }, { status: 404 });
  }

  const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
  const filters = toFilterState(segment, searchParams);
  return Response.json(buildCatalogListPayload(scope, filters));
}
