"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { swedishRegions } from "@/data/locations";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { uploadImage } from "@/utils/uploadImage";

export default function CreateListingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    priceType: "fixed",
    condition: "used",
  });

  const cities = selectedRegion ? swedishRegions.find((r) => r.name === selectedRegion)?.cities || [] : [];

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedCity("");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name").order("name");

      if (data) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Du måste vara inloggad för att skapa annonser");
      return;
    }

    if (!selectedRegion) {
      toast.error("Välj en region");
      return;
    }

    setLoading(true);

    let newListingId: string | null = null;

    try {
      const locationText =
        selectedCity && selectedCity !== "region_all" ? `${selectedCity}, ${selectedRegion}` : selectedRegion;

      const slug = formData.title
        .toLowerCase()
        .replace(/å/g, "a")
        .replace(/ä/g, "a")
        .replace(/ö/g, "o")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const { data: newListing, error } = await supabase
        .from("listings")
        .insert({
          seller_id: user.id,
          title: formData.title,
          slug: `${slug}-${Date.now()}`,
          description: formData.description,
          category_id: formData.category || null,
          price: formData.price ? parseFloat(formData.price) : null,
          price_type: formData.priceType,
          condition: formData.condition,
          location_text: locationText,
          region: selectedRegion,
          municipality: selectedCity && selectedCity !== "region_all" ? selectedCity : null,
          images: null,
          status: "active",
        } as any)
        .select()
        .single();

      if (error) throw error;
      newListingId = newListing.id;

      if (imageFiles.length > 0) {
        const uploadedPaths = await Promise.all(
          imageFiles.map((file) => uploadImage(file, `listings/${newListingId}`))
        );

        const { error: imagesError } = await supabase.from("listing_images").insert(
          uploadedPaths.map((path) => ({
            listing_id: newListingId,
            path,
          }))
        );

        if (imagesError) throw imagesError;
      }

      toast.success("Annons skapad!", {
        description: "Din annons är nu publicerad och kan ses av andra användare.",
      });

      setImageFiles([]);
      setImagePreviews([]);
      router.push("/konto/dina-annonser");
    } catch (error: any) {
      toast.error("Kunde inte skapa annons", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    if (imageFiles.length >= 8) {
      toast.error("Du kan max ladda upp 8 bilder.");
      return;
    }

    const remainingSlots = 8 - imageFiles.length;
    const filesToStore = Array.from(files).slice(0, remainingSlots);
    const previews = filesToStore.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...filesToStore]);
    setImagePreviews((prev) => [...prev, ...previews]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(index, 1);
      if (removed) {
        URL.revokeObjectURL(removed);
      }
      return updated;
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Lägg upp en annons</h1>
            <p className="text-muted-foreground">Fyll i informationen nedan för att skapa din annons</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <Label className="text-lg font-semibold">Bilder</Label>
                <p className="text-sm text-muted-foreground mb-4">Lägg till upp till 8 bilder. Första bilden blir huvudbild.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4 text-destructive-foreground" />
                      </button>
                    </div>
                  ))}

                  {imageFiles.length < 8 && (
                    <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Lägg till bild</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="title">Titel*</Label>
                  <Input
                    id="title"
                    placeholder="T.ex. iPhone 14 Pro i perfekt skick"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Beskrivning*</Label>
                  <Textarea
                    id="description"
                    placeholder="Beskriv vad du säljer, skick, eventuella defekter etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={6}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Kategori*</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Välj kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="condition">Skick*</Label>
                    <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Ny</SelectItem>
                        <SelectItem value="used">Begagnad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Pris (kr)*</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="priceType">Pristyp*</Label>
                    <Select value={formData.priceType} onValueChange={(value) => setFormData({ ...formData, priceType: value })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fast pris</SelectItem>
                        <SelectItem value="negotiable">Förhandlingsbart</SelectItem>
                        <SelectItem value="free">Gratis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Plats*</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <Select value={selectedRegion} onValueChange={handleRegionChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Välj region" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] bg-background">
                          {swedishRegions.map((region) => (
                            <SelectItem key={region.name} value={region.name}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedRegion && (
                      <div>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                          <SelectTrigger>
                            <SelectValue placeholder="Välj stad (valfritt)" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px] bg-background">
                            <SelectItem value="region_all">Hela {selectedRegion}</SelectItem>
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
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="button" variant="outline" size="lg" onClick={() => router.back()} className="flex-1" disabled={loading}>
                Avbryt
              </Button>
              <Button type="submit" size="lg" className="flex-1 bg-gradient-primary" disabled={loading}>
                {loading ? "Skapar annons..." : "Publicera annons"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}
