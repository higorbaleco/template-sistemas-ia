import Link from "next/link";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { buildCatalogListPayload, getCompanyBySlug, getScope, toFilterState } from "@/lib/catalog-utils";
import { SegmentKey } from "@/lib/catalog-types";

type PageProps = {
  params: { company: string; segment: SegmentKey };
  searchParams: Record<string, string | string[] | undefined>;
};

export default function CompanySegmentPage({ params, searchParams }: PageProps) {
  const company = getCompanyBySlug(params.company);
  const scope = getScope(params.segment, params.company);
  const filters = toFilterState(params.segment, searchParams);
  const payload = buildCatalogListPayload(scope, filters);

  return (
    <main className="page" id="main-content">
      <div className="container">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark" />
            Catálogo Lab · {company?.name ?? params.company}
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
        <CatalogExplorer scope={scope} payload={payload} initialFilters={filters} pathPrefix={scope.publicPath} />
      </div>
    </main>
  );
}
