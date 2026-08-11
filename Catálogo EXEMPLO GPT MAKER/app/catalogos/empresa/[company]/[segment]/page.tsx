import Link from "next/link";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { buildCatalogListPayload, getCompanyBySlug, getScope, toFilterState } from "@/lib/catalog-utils";
import { SegmentKey } from "@/lib/catalog-types";

type PageProps = {
  params: Promise<{ company: string; segment: SegmentKey }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CompanySegmentPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const company = getCompanyBySlug(resolvedParams.company);
  const scope = getScope(resolvedParams.segment, resolvedParams.company);
  const filters = toFilterState(resolvedParams.segment, resolvedSearchParams);
  const payload = buildCatalogListPayload(scope, filters);

  return (
    <main className="page" id="main-content">
      <div className="container">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark" />
            Catálogo Lab · {company?.name ?? resolvedParams.company}
          </div>
          <nav className="nav-links">
            <Link className="nav-chip" href="/catalogos">
              Dashboard
            </Link>
            <Link className="nav-chip" href={scope.segment.publicPath}>
              Ver segmento
            </Link>
          </nav>
        </header>
        <CatalogExplorer
          scope={payload.scope}
          payload={payload}
          initialFilters={filters}
          pathPrefix={scope.publicPath}
          filterDefinitions={scope.segment.filterDefinitions}
          segmentLabel={scope.segment.label}
          queryExamples={scope.segment.queryExamples}
        />
      </div>
    </main>
  );
}
