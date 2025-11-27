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
  Pause,
  Play,
  Trash2,
  Pencil,
  Phone,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getPublicImageUrl } from "@/utils/uploadImage";

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const listingId = params?.id;
  const router = useRouter();
  const { user } = useAuth();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: listing,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(
          `
          *,
          listing_images (
            path
          ),
          profiles (
            first_name,
            last_name,
            phone,
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

  const listingImagePaths = (
    (listing?.listing_images as { path: string }[]) ?? []
  ).map((img) => img.path);
  const fallbackImages = listing?.images ?? [];
  const images =
    listingImagePaths.length > 0
      ? listingImagePaths.map((path) =>
          getPublicImageUrl(path, { width: 1280, quality: 80 })
        )
      : fallbackImages;

  useEffect(() => {
    if (images.length) {
      setSelectedImageIndex(0);
    }
  }, [images.length]);

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

  const isOwner = !!user && user.id === listing.seller_id;

  if (!isOwner && listing.status !== "active") {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => router.push("/annonser")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka till annonser
          </Button>
          <div className="text-center mt-12">
            <h1 className="text-2xl font-bold mb-4">Annonsen är inte tillgänglig</h1>
            <p className="text-muted-foreground">
              Den här annonsen är inte längre aktiv.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sellerProfile = listing.profiles as typeof listing.profiles & {
    first_name?: string | null;
    last_name?: string | null;
    phone?: string | null;
  };
  const sellerName =
    [sellerProfile?.first_name, sellerProfile?.last_name]
      .filter(Boolean)
      .join(" ") ||
    sellerProfile?.name ||
    "Anonym";
  const sellerPhone = sellerProfile?.phone;
  const createdDate = new Date(listing.created_at);
  const daysAgo = Math.floor(
    (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );
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

  const handleEditListing = () => {
    if (!listing) return;
    router.push(`/skapa-annons?listingId=${listing.id}`);
  };

  const handleToggleListingStatus = async () => {
    if (!listing || !isOwner) return;
    const nextStatus = listing.status === "paused" ? "active" : "paused";

    setIsUpdatingStatus(true);

    try {
      const { error } = await supabase
        .from("listings")
        .update({ status: nextStatus })
        .eq("id", listing.id)
        .eq("seller_id", user?.id);

      if (error) throw error;

      toast.success(
        nextStatus === "paused" ? "Annons pausad" : "Annons aktiverad",
        {
          description:
            nextStatus === "paused"
              ? "Din annons är nu pausad och visas inte för köpare."
              : "Din annons är aktiv igen.",
        }
      );

      await refetch();
    } catch (error) {
      console.error("Error updating listing status", error);
      toast.error("Kunde inte uppdatera annonsstatus", {
        description: "Försök igen senare",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!listing || !isOwner) return;

    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Är du säker på att du vill ta bort annonsen?"
      );
      if (!confirmed) {
        return;
      }
    }

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listing.id)
        .eq("seller_id", user?.id);

      if (error) throw error;

      toast.success("Annons borttagen", {
        description: "Din annons har tagits bort permanent.",
      });

      router.push("/konto/dina-annonser");
    } catch (error) {
      console.error("Error deleting listing", error);
      toast.error("Kunde inte ta bort annonsen", {
        description: "Försök igen senare",
      });
    } finally {
      setIsDeleting(false);
    }
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
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{sellerName}</p>
                    </div>
                    {listing.profiles.account_type === "business" && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Företag
                      </Badge>
                    )}
                  </div>
                </div>
                {isOwner ? (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={handleEditListing}
                      disabled={isDeleting || isUpdatingStatus}
                      className="justify-start gap-2"
                    >
                      <Pencil className="h-4 w-4" />
                      Redigera annons
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleToggleListingStatus}
                      disabled={isUpdatingStatus || isDeleting}
                      className="justify-start gap-2"
                    >
                      {listing.status === "paused" ? (
                        <Play className="h-4 w-4" />
                      ) : (
                        <Pause className="h-4 w-4" />
                      )}
                      {isUpdatingStatus
                        ? "Uppdaterar..."
                        : listing.status === "paused"
                        ? "Aktivera annons"
                        : "Pausa annons"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteListing}
                      disabled={isDeleting}
                      className="justify-start gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      {isDeleting ? "Tar bort..." : "Ta bort annons"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex  gap-2">
                    <Button
                      className="w-1/2 mt-4"
                      onClick={handleContactSeller}
                      disabled={isCreatingThread}
                    >
                      {isCreatingThread
                        ? "Startar konversation..."
                        : "Kontakta säljare"}
                    </Button>
                    {sellerPhone && (
                      <Button asChild className="px-3 gap-2 w-1/2 mt-4">
                        <a
                          href={`tel:${sellerPhone}`}
                          aria-label="Ring säljaren"
                        >
                          <Phone className="h-4 w-4" />
                          {sellerPhone}
                        </a>
                      </Button>
                    )}
                  </div>
                )}
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
