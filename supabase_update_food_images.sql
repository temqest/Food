-- ==============================================================================
-- NAGA FOOD APP: SUPABASE STORAGE BUCKET & DISH IMAGES MIGRATION
-- Run this in your Supabase Project's SQL Editor (Dashboard > SQL Editor)
-- ==============================================================================

-- 1. Create the public 'food-images' storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-images', 'food-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Ensure RLS policies allow public viewing and uploads to the bucket
DROP POLICY IF EXISTS "Public Access food-images" ON storage.objects;
CREATE POLICY "Public Access food-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'food-images');

DROP POLICY IF EXISTS "Allow Uploads food-images" ON storage.objects;
CREATE POLICY "Allow Uploads food-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'food-images');

DROP POLICY IF EXISTS "Allow Updates food-images" ON storage.objects;
CREATE POLICY "Allow Updates food-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'food-images');

-- 3. Update the food_items table with their corresponding public Supabase Storage URLs
UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/kinalas.webp'
WHERE id = 'kinalas';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/sinanglay.jpg'
WHERE id = 'sinanglay';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/toasted-siopao.jpg'
WHERE id = 'toasted-siopao';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/pinangat.webp'
WHERE id = 'pinangat';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/bicol-express.jpg'
WHERE id = 'bicol-express';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/laing.jpg'
WHERE id = 'laing';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/kinunot.webp'
WHERE id = 'kinunot';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/sinantol.webp'
WHERE id = 'sinantol';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/tilmok.jpg'
WHERE id = 'tilmok';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/pancit-bato.webp'
WHERE id = 'pancit-bato';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/crispy-pili.jpg'
WHERE id = 'crispy-pili';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/mazapan-de-pili.jpg'
WHERE id = 'mazapan-de-pili';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/pili-shake.jpg'
WHERE id = 'pili-shake';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/baduya.jpg'
WHERE id = 'baduya';

UPDATE public.food_items
SET image_url = 'https://hncwrjcilvfqaczwlglk.supabase.co/storage/v1/object/public/food-images/naga-night-skewers.jpg'
WHERE id = 'naga-night-skewers';

