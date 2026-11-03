import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';

const BUCKET_NAME = 'food';

/**
 * Service to handle image uploads to Supabase Storage bucket 'food'
 */
export const StorageService = {
  /**
   * Upload an image URI (from expo-image-picker or camera) to the 'food' bucket
   * @param uri Local file URI (file://...) or web blob URI
   * @param folder Folder path inside bucket, e.g. 'posts', 'avatars', 'eateries'
   * @returns Public URL of uploaded image, or null if failed
   */
  async uploadImage(uri: string, folder: string = 'posts'): Promise<string | null> {
    try {
      if (!uri) return null;

      // If it's already an http/https remote URL, return as-is
      if (uri.startsWith('http://') || uri.startsWith('https://')) {
        return uri;
      }

      // Determine file extension and MIME type
      const filename = uri.split('/').pop() || `photo_${Date.now()}.jpg`;
      const cleanName = filename.split('?')[0];
      const match = /\.(\w+)$/.exec(cleanName);
      const ext = match ? match[1].toLowerCase() : 'jpg';
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      
      const filePath = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

      // Convert local URI to ArrayBuffer or FormData depending on environment
      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, arrayBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        console.warn(`Supabase Storage upload error to '${BUCKET_NAME}':`, error.message);
        // Return original uri if storage failed (offline / bucket not created yet)
        return null;
      }

      // Retrieve public URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.warn('StorageService.uploadImage caught error:', err);
      return null;
    }
  },
};
