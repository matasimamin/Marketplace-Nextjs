"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  image?: string;
  createdAt: string;
  condition?: string;
  viewMode?: "grid" | "list";
}

export const ListingCard = ({
  id,
  title,
  price,
  location,
  image,
  createdAt,
  condition,
  viewMode = "grid",
}: ListingCardProps) => {
  const daysAgo = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 border-border/50">
        <Link href={`/annonser/${id}`} className="flex items-stretch h-full">
          {/* Image - Square on left */}
          <div className="relative w-32 sm:w-56 lg:w-64 aspect-square sm:aspect-[4/3] bg-muted overflow-hidden flex-shrink-0">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 8rem, (max-width: 1024px) 14rem, 16rem"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                Ingen bild
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1 min-w-0">
                {/* Price first */}
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">
                  {price === 0
                    ? "Gratis"
                    : `${price.toLocaleString("sv-SE")} kr`}
                </p>
                {/* Title */}
                <h3 className="text-sm sm:text-base font-normal text-foreground/90 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {title}
                </h3>
              </div>

              {/* Heart button */}
              <Button
                size="icon"
                variant="ghost"
                className="flex-shrink-0 h-8 w-8 hover:scale-110 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  // Toggle favorite
                }}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Location and time at bottom */}
            <div className="flex items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground mt-auto">
              <span className="truncate">{location}</span>
              <span className="whitespace-nowrap flex-shrink-0">
                {daysAgo === 0
                  ? "Idag"
                  : `${daysAgo} dag${daysAgo > 1 ? "ar" : ""} sedan`}
              </span>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all">
      <Link href={`/annonser/${id}`}>
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Ingen bild
            </div>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/90 hover:scale-110 hover:bg-primary/10 hover:text-primary"
            onClick={(e) => {
              e.preventDefault();
              // Toggle favorite
            }}
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/annonser/${id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-primary">
              {price === 0 ? "Gratis" : `${price.toLocaleString("sv-SE")} kr`}
            </span>
            {condition && (
              <Badge variant="secondary" className="text-xs">
                {condition === "new" ? "Ny" : "Begagnad"}
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate">{location}</span>
            </div>
            <span className="text-xs whitespace-nowrap ml-2">
              {daysAgo === 0
                ? "Idag"
                : `${daysAgo} dag${daysAgo > 1 ? "ar" : ""} sedan`}
            </span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};
