import { supabase } from "@/integrations/supabase/client";

const BUCKET_NAME = "market-images";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const generateFilePath = (fileName: string, folder = "listings") => {
  const extension = fileName.split(".").pop() || "jpg";
  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${folder}/${uniqueId}.${extension}`;
};

export const uploadImage = async (file: File, folder?: string) => {
  // Validate type
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Endast JPG, PNG, or WebP är tillåtna.");
  }

  // Validate size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Bilden måste vara mindre än 10Mb.");
  }

  const filePath = generateFilePath(file.name, folder);

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return filePath;
};

type ImageUrlOptions = {
  width?: number;
  quality?: number;
};

export const getPublicImageUrl = (path: string, options: ImageUrlOptions = {}) => {
  if (!path) return "";

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  const url = data?.publicUrl;
  if (!url) return "";

  const params = new URLSearchParams();
  if (options.width) params.set("width", options.width.toString());
  if (options.quality) params.set("quality", options.quality.toString());

  const paramString = params.toString();
  return paramString ? `${url}?${paramString}` : url;
};

export const getImageVariants = (path: string) => ({
  original: getPublicImageUrl(path),
  large: getPublicImageUrl(path, { width: 1280, quality: 80 }),
  medium: getPublicImageUrl(path, { width: 800, quality: 80 }),
  thumb: getPublicImageUrl(path, { width: 400, quality: 70 }),
});
