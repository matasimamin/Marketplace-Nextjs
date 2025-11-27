"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Heart,
  Share2,
  Flag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const listingId = params?.id;
  const router = useRouter();
  const { user } = useAuth();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(
          `
          *,
          profiles (
            name,
            avatar_url,
            account_type
          )
        `
        )
        .eq("id", listingId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!listingId,
  });

  useEffect(() => {
    if (listing?.images?.length) {
      setSelectedImageIndex(0);
    }
  }, [listing?.images?.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.push("/annonser")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka till annonser
          </Button>
          <div className="text-center mt-12">
            <h1 className="text-2xl font-bold mb-4">Annonsen hittades inte</h1>
            <p className="text-muted-foreground">
              Annonsen du söker existerar inte eller har tagits bort.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const createdDate = new Date(listing.created_at);
  const daysAgo = Math.floor(
    (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const images = listing.images ?? [];
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  const showNextImage = () => {
    if (!hasMultipleImages) return;
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const showPrevImage = () => {
    if (!hasMultipleImages) return;
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleContactSeller = async () => {
    if (!user) {
      toast.error("Du måste vara inloggad", {
        description: "Logga in för att kontakta säljaren",
      });
      router.push("/logga-in");
      return;
    }

    if (user.id === listing.seller_id) {
      toast.error("Du kan inte kontakta dig själv");
      return;
    }

    setIsCreatingThread(true);

    try {
      const { data: existingThread } = await supabase
        .from("threads")
        .select("id")
        .eq("listing_id", listing.id)
        .eq("buyer_id", user.id)
        .eq("seller_id", listing.seller_id)
        .maybeSingle();

      if (existingThread) {
        router.push(`/meddelanden/${existingThread.id}`);
        return;
      }

      const { data: newThread, error } = await supabase
        .from("threads")
        .insert({
          listing_id: listing.id,
          buyer_id: user.id,
          seller_id: listing.seller_id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Konversation startad!");
      router.push(`/meddelanden/${newThread.id}`);
    } catch (error) {
      console.error("Error creating thread:", error);
      toast.error("Kunde inte starta konversation", {
        description: "Försök igen senare",
      });
    } finally {
      setIsCreatingThread(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/annonser")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tillbaka till annonser
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            {hasImages ? (
              <>
                <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={images[selectedImageIndex]}
                    alt={listing.title}
                    fill
                    className="object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onClick={() => setImageDialogOpen(true)}
                  />
                  {hasMultipleImages && (
                    <>
                      <button
                        type="button"
                        aria-label="Föregående bild"
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white p-2 hover:bg-black/60 transition"
                        onClick={showPrevImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Nästa bild"
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white p-2 hover:bg-black/60 transition"
                        onClick={showNextImage}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  {hasMultipleImages && (
                    <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                      {images.map((_, index) => (
                        <span
                          key={index}
                          className={cn(
                            "h-2 w-2 rounded-full bg-white/50 transition",
                            index === selectedImageIndex && "bg-white"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* {hasMultipleImages && (
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {images.map((img, index) => (
                      <button
                        key={`${img}-${index}`}
                        type="button"
                        className={cn(
                          "relative aspect-square rounded-md overflow-hidden border transition",
                          index === selectedImageIndex
                            ? "border-primary ring-2 ring-primary/40"
                            : "border-border"
                        )}
                        onClick={() => setSelectedImageIndex(index)}
                        aria-label={`Välj bild ${index + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`${listing.title} - bild ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      </button>
                    ))}
                  </div>
                )} */}
              </>
            ) : (
              <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Ingen bild</span>
              </div>
            )}
          </div>

          <div className="flex flex-col h-full">
            <div className="space-y-4 flex-1">
              <div>
                <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {listing.location_text || "Plats ej angiven"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {daysAgo === 0 ? "Idag" : `${daysAgo} dagar sedan`}
                  </span>
                </div>
                <div className="py-6 border-t border-b border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-primary">
                      {listing.price ? `${listing.price} kr` : "Pris saknas"}
                    </span>
                    {listing.condition && (
                      <Badge variant="secondary">{listing.condition}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Flag className="h-4 w-4" />
              </Button>
            </div>

            {listing.profiles && (
              <Card className="mt-6 p-6 bg-muted/50 border-2">
                <h2 className="text-xl font-semibold mb-3">Säljare</h2>
                <div className="flex items-center gap-3">
                  {listing.profiles.avatar_url ? (
                    <div className="relative w-12 h-12">
                      <Image
                        src={listing.profiles.avatar_url}
                        alt={listing.profiles.name || "Säljare"}
                        fill
                        className="rounded-full object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xl">
                        {listing.profiles.name?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">
                      {listing.profiles.name || "Anonym"}
                    </p>
                    {listing.profiles.account_type === "business" && (
                      <Badge variant="secondary" className="text-xs">
                        Företag
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={handleContactSeller}
                  disabled={isCreatingThread}
                >
                  {isCreatingThread
                    ? "Startar konversation..."
                    : "Kontakta säljare"}
                </Button>
              </Card>
            )}
          </div>
        </div>

        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold mb-3">Beskrivning</h2>
          <p className="text-foreground/90 whitespace-pre-wrap break-words ">
            {listing.description}
          </p>
        </Card>

        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="max-w-4xl w-full p-0">
            {hasImages && (
              <Image
                src={images[selectedImageIndex]}
                alt={listing.title}
                width={1200}
                height={1200}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
