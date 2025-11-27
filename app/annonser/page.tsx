import { fetchListings } from "@/lib/listings";
import { ListingsPageClient } from "./ListingsPageClient";

type ListingsPageProps = {
  searchParams?: {
    page?: string;
  };
};

export const revalidate = 0;

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const initialPage = searchParams?.page ? parseInt(searchParams.page, 10) || 1 : 1;
  const safeInitialPage = initialPage > 0 ? initialPage : 1;
  const pageSize = 30;

  const { listings, totalCount } = await fetchListings({
    page: safeInitialPage,
    limit: pageSize,
  });

  return (
    <ListingsPageClient
      initialListings={listings}
      initialTotalCount={totalCount}
      initialPage={safeInitialPage}
      pageSize={pageSize}
    />
  );
}
