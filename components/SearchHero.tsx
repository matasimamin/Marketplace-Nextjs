"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { swedishRegions } from "@/data/locations";

export const SearchHero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const router = useRouter();

  const cities = selectedRegion
    ? swedishRegions.find((r) => r.name === selectedRegion)?.cities || []
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);

    if (selectedCity && selectedCity !== "region_all") {
      params.set("plats", `${selectedCity}, ${selectedRegion}`);
    } else if (selectedRegion && selectedRegion !== "all") {
      params.set("plats", selectedRegion);
    }

    const query = params.toString();
    router.push(query ? `/annonser?${query}` : "/annonser");
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedCity(""); // Reset city when region changes
  };

  return (
    <div className="relative bg-gradient-hero text-white py-20 rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC00djJ6bS0yIDB2Mmgydi0yem0tMiAydjJoMnYtMnptMCAydjJoMnYtMnptMiAwdjJoMnYtMnptMC0ydjJoMnYtMnptMi0ydjJoMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Hitta det du söker
        </h1>
        <p className="text-xl mb-8 text-center text-white/90">
          Sveriges mest användbara köp & sälj-plattform
        </p>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl p-2 shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-2">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none z-10" />
              <Input
                type="text"
                placeholder="Vad letar du efter?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg border-0 focus-visible:ring-0 bg-transparent text-foreground"
              />
            </div>

            {/* Location Selectors */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              {/* Region Select */}
              <div className="relative w-full sm:w-48">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none z-10" />
                <Select
                  value={selectedRegion}
                  onValueChange={handleRegionChange}
                >
                  <SelectTrigger className="pl-12 h-14 text-lg border-0 focus:ring-0 bg-transparent text-foreground">
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

              {/* City Select - Only visible when region is selected */}
              {selectedRegion && selectedRegion !== "all" && (
                <div className="w-full sm:w-48">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="h-14 text-lg border-0 focus:ring-0 bg-transparent text-foreground">
                      <SelectValue placeholder="Välj stad" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] bg-background">
                      <SelectItem value="region_all">
                        Hela {selectedRegion}
                      </SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              size="lg"
              className="h-14 px-8 bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              Sök
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
