import { supabase } from "@/integrations/supabase/client";
import { getPublicImageUrl } from "@/utils/uploadImage";

export type ListingsSortOption = "latest" | "price-asc" | "price-desc";

export interface ListingPreview {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  createdAt: string;
  condition?: string;
}

export interface FetchListingsOptions {
  searchQuery?: string;
  sortBy?: ListingsSortOption;
  page?: number;
  limit?: number;
  region?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  condition?: string;
}

export interface ListingsResult {
  listings: ListingPreview[];
  totalCount: number;
}

const DEFAULT_LIMIT = 32;

export async function fetchListings({
  searchQuery = "",
  sortBy = "latest",
  page = 1,
  limit = DEFAULT_LIMIT,
  region,
  city,
  minPrice,
  maxPrice,
  categoryId,
  condition,
}: FetchListingsOptions = {}): Promise<ListingsResult> {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_LIMIT;
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;

  let query = supabase
    .from("listings")
    .select(
      `
        *,
        listing_images (
          path
        )
      `,
      { count: "exact" }
    )
    .eq("status", "active");

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  if (region) {
    query = query.eq("region", region);
  }

  if (city) {
    query = query.eq("municipality", city);
  }

  if (typeof minPrice === "number" && !Number.isNaN(minPrice)) {
    query = query.gte("price", minPrice);
  }

  if (typeof maxPrice === "number" && !Number.isNaN(maxPrice)) {
    query = query.lte("price", maxPrice);
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (condition) {
    query = query.eq("condition", condition);
  }

  if (sortBy === "latest") {
    query = query.order("created_at", { ascending: false });
  } else if (sortBy === "price-asc") {
    query = query.order("price", { ascending: true, nullsFirst: true });
  } else if (sortBy === "price-desc") {
    query = query.order("price", { ascending: false, nullsLast: true });
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw error;
  }

  const listings =
    data?.map((listing: any) => {
      const imagePaths =
        listing.listing_images?.map((img: { path: string }) => img.path) ?? [];
      const primaryPath = imagePaths[0];
      const fallbackImage = listing.images?.[0] || "";

      return {
        id: listing.id,
        title: listing.title,
        price: listing.price || 0,
        location: listing.location_text || "",
        image: primaryPath
          ? getPublicImageUrl(primaryPath, { width: 800, quality: 80 })
          : fallbackImage,
        createdAt: listing.created_at,
        condition: listing.condition,
      } as ListingPreview;
    }) ?? [];

  return {
    listings,
    totalCount: count ?? 0,
  };
}
