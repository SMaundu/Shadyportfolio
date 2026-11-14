import { media, type MediaAsset, type MediaId } from "@/content/media.generated";

export const getMedia = (id: MediaId | string | null | undefined): MediaAsset | undefined =>
  id ? (media as Record<string, MediaAsset>)[id] : undefined;
