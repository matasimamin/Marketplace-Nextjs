"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { fetchListings, type ListingPreview, type ListingsResult, type ListingsSortOption } from "@/lib/listings";
import { supabase } from "@/integrations/supabase/client";
import { swedishRegions } from "@/data/locations";

type ListingsPageClientProps = {
  initialListings: ListingPreview[];
  initialTotalCount: number;
  initialPage?: number;
  pageSize?: number;
  initialSearchQuery?: string;
  initialRegion?: string;
  initialCity?: string;
};

const DEFAULT_PAGE_SIZE = 30;
const PRICE_RANGE_MIN = 0;
const PRICE_RANGE_MAX = 50000;

type FilterValues = {
  category: string;
  condition: string;
  region: string;
  city: string;
  priceRange: [number, number];
};

const createDefaultFilters = (overrides: Partial<FilterValues> = {}): FilterValues => ({
  category: "all",
  condition: "all",
  region: "",
  city: "",
  priceRange: [PRICE_RANGE_MIN, PRICE_RANGE_MAX],
  ...overrides,
});

export function ListingsPageClient({
  initialListings,
  initialTotalCount,
  initialPage = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  initialSearchQuery = "",
  initialRegion = "",
  initialCity = "",
}: ListingsPageClientProps) {
  const normalizedInitialQuery = initialSearchQuery.trim();
  const normalizedInitialRegion = initialRegion || "";
  const normalizedInitialCity = initialCity || "";
  const [searchInput, setSearchInput] = useState(normalizedInitialQuery);
  const [searchQuery, setSearchQuery] = useState(normalizedInitialQuery);
  const [regionFilter, setRegionFilter] = useState(normalizedInitialRegion);
  const [cityFilter, setCityFilter] = useState(normalizedInitialCity);
  const [filterValues, setFilterValues] = useState<FilterValues>(() =>
    createDefaultFilters({
      region: normalizedInitialRegion || "",
      city: normalizedInitialCity || "",
    })
  );
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>(() =>
    createDefaultFilters({
      region: normalizedInitialRegion || "",
      city: normalizedInitialCity || "",
    })
  );
  const [sortBy, setSortBy] = useState<ListingsSortOption>("latest");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileView, setIsMobileView] = useState<boolean | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;
      setIsMobileView(window.innerWidth < 640);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const normalizedQuery = initialSearchQuery.trim();
    setSearchInput((prev) => (prev === normalizedQuery ? prev : normalizedQuery));
    setSearchQuery((prev) => (prev === normalizedQuery ? prev : normalizedQuery));
  }, [initialSearchQuery]);

  useEffect(() => {
    setRegionFilter((prev) => (prev === normalizedInitialRegion ? prev : normalizedInitialRegion));
  }, [normalizedInitialRegion]);

  useEffect(() => {
    setCityFilter((prev) => (prev === normalizedInitialCity ? prev : normalizedInitialCity));
  }, [normalizedInitialCity]);

  useEffect(() => {
    setFilterValues((prev) => ({
      ...prev,
      region: normalizedInitialRegion || "",
      city: normalizedInitialCity || "",
    }));
    setAppliedFilters((prev) => ({
      ...prev,
      region: normalizedInitialRegion || "",
      city: normalizedInitialCity || "",
    }));
  }, [normalizedInitialRegion, normalizedInitialCity]);

  const appliedMinPrice =
    appliedFilters.priceRange[0] > PRICE_RANGE_MIN
      ? appliedFilters.priceRange[0]
      : undefined;
  const appliedMaxPrice =
    appliedFilters.priceRange[1] < PRICE_RANGE_MAX
      ? appliedFilters.priceRange[1]
      : undefined;
  const appliedCategory =
    appliedFilters.category && appliedFilters.category !== "all"
      ? appliedFilters.category
      : undefined;
  const appliedCondition =
    appliedFilters.condition && appliedFilters.condition !== "all"
      ? appliedFilters.condition
      : undefined;
  const filtersAreDefault =
    !appliedCategory &&
    !appliedCondition &&
    !appliedMinPrice &&
    !appliedMaxPrice;

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data ?? [];
    },
  });

  const selectedRegion = filterValues.region;
  const regionCities =
    selectedRegion && selectedRegion !== "all"
      ? swedishRegions.find((region) => region.name === selectedRegion)?.cities || []
      : [];

  const isDefaultQuery =
    searchQuery === normalizedInitialQuery &&
    sortBy === "latest" &&
    currentPage === initialPage &&
    regionFilter === normalizedInitialRegion &&
    cityFilter === normalizedInitialCity &&
    filtersAreDefault;
  const isDefaultMobileQuery =
    searchQuery === normalizedInitialQuery &&
    sortBy === "latest" &&
    regionFilter === normalizedInitialRegion &&
    cityFilter === normalizedInitialCity &&
    filtersAreDefault;

  const sharedQueryKey = [
    searchQuery,
    sortBy,
    regionFilter,
    cityFilter,
    appliedCategory,
    appliedCondition,
    appliedFilters.priceRange[0],
    appliedFilters.priceRange[1],
  ] as const;

  const {
    data: paginatedData,
    isLoading: isPaginatedLoading,
  } = useQuery<ListingsResult>({
    queryKey: ["listings", ...sharedQueryKey, currentPage],
    queryFn: () =>
      fetchListings({
        searchQuery,
        sortBy,
        page: currentPage,
        limit: pageSize,
        region: regionFilter || undefined,
        city: cityFilter || undefined,
        minPrice: appliedMinPrice,
        maxPrice: appliedMaxPrice,
        categoryId: appliedCategory,
        condition: appliedCondition,
      }),
    initialData: isDefaultQuery
      ? {
          listings: initialListings,
          totalCount: initialTotalCount,
        }
      : undefined,
    enabled: isMobileView !== true,
  });

  const infiniteQuery = useInfiniteQuery<
    ListingsResult & { page: number }
  >({
    queryKey: ["listings-infinite", ...sharedQueryKey],
    queryFn: async ({ pageParam = initialPage }) => {
      const result = await fetchListings({
        searchQuery,
        sortBy,
        page: pageParam,
        limit: pageSize,
        region: regionFilter || undefined,
        city: cityFilter || undefined,
        minPrice: appliedMinPrice,
        maxPrice: appliedMaxPrice,
        categoryId: appliedCategory,
        condition: appliedCondition,
      });
      return {
        ...result,
        page: pageParam,
      };
    },
    initialPageParam: initialPage,
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce(
        (acc, page) => acc + page.listings.length,
        0
      );
      if (loaded >= lastPage.totalCount) {
        return undefined;
      }
      return lastPage.page + 1;
    },
    enabled: isMobileView === true,
    initialData: isDefaultMobileQuery
      ? {
          pageParams: [initialPage],
          pages: [
            {
              listings: initialListings,
              totalCount: initialTotalCount,
              page: initialPage,
            },
          ],
        }
      : undefined,
  });

  const useInfinite = isMobileView === true;
  const listings = useInfinite
    ? infiniteQuery.data?.pages.flatMap((page) => page.listings) ??
      (isDefaultMobileQuery ? initialListings : [])
    : paginatedData?.listings ?? [];

  const totalCount = useInfinite
    ? infiniteQuery.data?.pages?.[0]?.totalCount ??
      (isDefaultMobileQuery ? initialTotalCount : 0)
    : paginatedData?.totalCount ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItem =
    totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);
  const isLoading = useInfinite
    ? infiniteQuery.status === "loading" && listings.length === 0
    : isPaginatedLoading;
  const isFetchingNextPage =
    useInfinite && infiniteQuery.isFetchingNextPage ? true : false;
  const hasNextPage = useInfinite ? Boolean(infiniteQuery.hasNextPage) : false;
  const fetchNextInfinitePage = infiniteQuery.fetchNextPage;

  const paginationPages = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    if (!pages.includes(1)) {
      pages.unshift(1);
    }

    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return Array.from(new Set(pages));
  }, [currentPage, totalPages]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setCurrentPage(1);
    setSearchQuery(searchInput.trim());
  };

  const handleSortChange = (value: ListingsSortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    const normalizedRegion =
      filterValues.region === "all" ? "" : filterValues.region;
    const normalizedCity =
      filterValues.city === "region_all" ? "" : filterValues.city;

    setRegionFilter(normalizedRegion);
    setCityFilter(normalizedRegion && normalizedCity ? normalizedCity : "");
    setAppliedFilters({
      ...filterValues,
      priceRange: [...filterValues.priceRange] as [number, number],
    });
    setCurrentPage(1);
    setIsFilterSheetOpen(false);
  };

  const handleResetFilters = () => {
    const defaults = createDefaultFilters();
    setFilterValues(defaults);
    setAppliedFilters(defaults);
    setRegionFilter("");
    setCityFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!useInfinite || !hasNextPage) {
      return;
    }

    const target = loadMoreRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextInfinitePage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [useInfinite, hasNextPage, isFetchingNextPage, fetchNextInfinitePage]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-full overflow-x-hidden">
        <div className="mb-8">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-4 md:flex-row md:items-center"
          >
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Sök bland annonser..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                type="submit"
                size="lg"
                className="flex-1 md:flex-none gap-2"
              >
                <Search className="h-5 w-5" />
                Sök
              </Button>
              <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtrera annonser</SheetTitle>
                    <SheetDescription>
                      Anpassa din sökning med filter nedan
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <Label>Kategori</Label>
                      <Select
                        value={filterValues.category}
                        onValueChange={(value) =>
                          setFilterValues((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Välj kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alla kategorier</SelectItem>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Prisintervall (kr)</Label>
                      <div className="mt-4">
                        <Slider
                          value={filterValues.priceRange}
                          onValueChange={(value) =>
                            setFilterValues((prev) => ({
                              ...prev,
                              priceRange: [value[0], value[1]] as [number, number],
                            }))
                          }
                          max={PRICE_RANGE_MAX}
                          step={500}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{filterValues.priceRange[0].toLocaleString("sv-SE")} kr</span>
                          <span>{filterValues.priceRange[1].toLocaleString("sv-SE")} kr</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Region</Label>
                      <Select
                        value={filterValues.region}
                        onValueChange={(value) =>
                          setFilterValues((prev) => ({
                            ...prev,
                            region: value,
                            city: "",
                          }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Välj region" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] bg-background">
                          <SelectItem value="all">Hela Sverige</SelectItem>
                          {swedishRegions.map((region) => (
                            <SelectItem key={region.name} value={region.name}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {filterValues.region && filterValues.region !== "all" && (
                      <div>
                        <Label>Stad</Label>
                        <Select
                          value={filterValues.city}
                          onValueChange={(value) =>
                            setFilterValues((prev) => ({ ...prev, city: value }))
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder={`Välj stad i ${filterValues.region}`} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] bg-background">
                            <SelectItem value="region_all">Hela {filterValues.region}</SelectItem>
                            {regionCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label>Skick</Label>
                      <Select
                        value={filterValues.condition}
                        onValueChange={(value) =>
                          setFilterValues((prev) => ({ ...prev, condition: value }))
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Välj skick" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alla</SelectItem>
                          <SelectItem value="new">Ny</SelectItem>
                          <SelectItem value="used">Begagnad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button type="button" className="w-full" onClick={handleApplyFilters}>
                        Tillämpa filter
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={handleResetFilters}
                      >
                        Återställ filter
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <p className="text-muted-foreground text-sm sm:text-base">
            Visar{" "}
            <span className="font-semibold text-foreground">
              {useInfinite
                ? listings.length
                : totalCount === 0
                  ? 0
                  : `${startItem}-${endItem}`}
            </span>{" "}
            av{" "}
            <span className="font-semibold text-foreground">
              {totalCount}
            </span>{" "}
            annonser
          </p>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex border rounded-lg p-1 bg-muted/50 gap-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-1.5 min-w-[44px] h-9"
                aria-label="Rutnät vy"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="text-xs">Rutnät</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-1.5 min-w-[44px] h-9"
                aria-label="List vy"
              >
                <List className="h-4 w-4" />
                <span className="text-xs">Lista</span>
              </Button>
            </div>

            <Select value={sortBy} onValueChange={(value) => handleSortChange(value as ListingsSortOption)}>
              <SelectTrigger className="w-[140px] sm:w-[180px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Senaste först</SelectItem>
                <SelectItem value="price-asc">Lägsta pris</SelectItem>
                <SelectItem value="price-desc">Högsta pris</SelectItem>
                <SelectItem value="relevant" disabled>
                  Mest relevanta
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              Inga annonser hittades
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Prova att ändra dina sökfilter eller skapa en ny annons
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6"
                : "flex flex-col gap-3 sm:gap-4"
            }
          >
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                {...listing}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {useInfinite && listings.length > 0 && (
          <div
            ref={loadMoreRef}
            className="mt-8 flex justify-center text-sm text-muted-foreground"
          >
            {isFetchingNextPage
              ? "Laddar fler annonser..."
              : hasNextPage
                ? "Scrolla för att ladda fler"
                : "Du har nått slutet"}
          </div>
        )}

        {!useInfinite && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              >
                Föregående
              </Button>
              <div className="flex gap-2">
                {paginationPages.map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
              >
                Nästa
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
