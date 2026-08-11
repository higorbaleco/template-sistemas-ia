import Link from "next/link";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { buildCatalogListPayload, getAllCompaniesBySegment, getScope, toFilterState } from "@/lib/catalog-utils";
import { SegmentKey } from "@/lib/catalog-types";

type PageProps = {
  params: { segment: SegmentKey };
  searchParams: Record<string, string | string[] | undefined>;
};

export default function SegmentPage({ params, searchParams }: PageProps) {
  const scope = getScope(params.segment);
  const filters = toFilterState(params.segment, searchParams);
  const payload = buildCatalogListPayload(scope, filters);
  const companies = getAllCompaniesBySegment(params.segment);

  return (
    <main className="page" id="main-content">
      <div className="container">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark" />
            Catálogo Lab · {scope.segment.label}
          </div>
          <nav className="nav-links">
            <Link className="nav-chip" href="/catalogos">
              Dashboard
            </Link>
            {companies.map((company) => (
              <Link className="nav-chip" href={`/catalogos/empresa/${company.slug}/${company.segment}`} key={company.slug}>
                {company.name}
              </Link>
            ))}
          </nav>
        </header>
        <CatalogExplorer scope={scope} payload={payload} initialFilters={filters} pathPrefix={scope.publicPath} />
      </div>
    </main>
  );
}
