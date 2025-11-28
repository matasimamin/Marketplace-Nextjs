import { fetchListings } from "@/lib/listings";
import { ListingsPageClient } from "./ListingsPageClient";

type ListingsPageProps = {
  searchParams?: {
    page?: string;
    q?: string;
    plats?: string;
  };
};

export const revalidate = 0;

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const initialPage = searchParams?.page ? parseInt(searchParams.page, 10) || 1 : 1;
  const safeInitialPage = initialPage > 0 ? initialPage : 1;
  const pageSize = 30;
  const rawSearchQuery = searchParams?.q?.trim() ?? "";
  const rawLocation = searchParams?.plats?.trim() ?? "";

  let regionFilter: string | undefined;
  let cityFilter: string | undefined;

  if (rawLocation) {
    const parts = rawLocation.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 2) {
      [cityFilter, regionFilter] = [parts[0], parts[1]];
    } else if (parts.length === 1) {
      [regionFilter] = parts;
    }
  }

  const { listings, totalCount } = await fetchListings({
    page: safeInitialPage,
    limit: pageSize,
    searchQuery: rawSearchQuery,
    region: regionFilter,
    city: cityFilter,
  });

  return (
    <ListingsPageClient
      initialListings={listings}
      initialTotalCount={totalCount}
      initialPage={safeInitialPage}
      pageSize={pageSize}
      initialSearchQuery={rawSearchQuery}
      initialRegion={regionFilter}
      initialCity={cityFilter}
    />
  );
}
