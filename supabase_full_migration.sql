-- ==============================================================================
-- FULL MIGRATION SCRIPT (IDEMPOTENT & RE-RUNNABLE)
-- ==============================================================================

-- ==============================================================================
-- NAGA FOOD APP: SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Food Profiles (User profile extending auth.users)
CREATE TABLE IF NOT EXISTS public.food_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  location TEXT DEFAULT 'Centro, Naga City',
  spice_preference TEXT DEFAULT 'moderate', -- 'mild' | 'moderate' | 'fiery'
  favorite_district TEXT DEFAULT 'Centro',
  member_since TEXT DEFAULT 'November 2026',
  badge TEXT DEFAULT 'Naga Foodie Explorer',
  review_count INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Food Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Food Items (Culinary Codex & Specialties)
CREATE TABLE IF NOT EXISTS public.food_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bikol_name TEXT,
  tagline TEXT,
  description TEXT,
  cultural_context TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  category_label TEXT,
  image_url TEXT,
  price_range TEXT,
  price_level TEXT DEFAULT 'budget',
  serving_spots_count INTEGER DEFAULT 1,
  featured BOOLEAN DEFAULT false,
  flavor_profile TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Establishments (Restaurants, Kinalasan, Bakeries, Stalls)
CREATE TABLE IF NOT EXISTS public.establishments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  type_label TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  map_x DOUBLE PRECISION DEFAULT 50,
  map_y DOUBLE PRECISION DEFAULT 50,
  distance_km DOUBLE PRECISION DEFAULT 0.5,
  opening_hours TEXT NOT NULL,
  is_open_now BOOLEAN DEFAULT true,
  contact_number TEXT,
  hero_image TEXT,
  logo TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  foods_offered JSONB DEFAULT '[]'::jsonb,
  price_level TEXT DEFAULT 'budget',
  atmosphere_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Food Trails (Curated Food Crawls)
CREATE TABLE IF NOT EXISTS public.food_trails (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  description TEXT,
  hero_image TEXT,
  badge_name TEXT,
  badge_icon TEXT,
  xp_reward INTEGER DEFAULT 150,
  estimated_duration TEXT,
  stops JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Social Posts (Community Feed)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES public.food_profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_handle TEXT,
  author_avatar TEXT,
  location_name TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'Street Food Crawl',
  dish_tags TEXT[] DEFAULT '{}',
  eatery_id TEXT REFERENCES public.establishments(id) ON DELETE SET NULL,
  eatery_name TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Post Likes (User Likes per Post)
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.food_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- 9. Post Comments
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.food_profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. User Saved / Bookmarks (Foods and Eateries)
CREATE TABLE IF NOT EXISTS public.user_saved (
  user_id UUID REFERENCES public.food_profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'food' | 'establishment'
  item_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, item_type, item_id)
);

-- 11. User Pre-Orders / Digital Dining Passes
CREATE TABLE IF NOT EXISTS public.user_orders (
  id TEXT PRIMARY KEY, -- e.g. ORD-2026-NAGA-0841 or UUID
  user_id UUID REFERENCES public.food_profiles(id) ON DELETE CASCADE,
  establishment_id TEXT REFERENCES public.establishments(id) ON DELETE SET NULL,
  establishment_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed' | 'preparing' | 'ready_for_pickup' | 'completed' | 'cancelled'
  dining_option TEXT DEFAULT 'dine_in', -- 'dine_in' | 'takeout'
  pickup_time TEXT NOT NULL,
  special_instructions TEXT,
  payment_method TEXT DEFAULT 'cash', -- 'cash' | 'gcash' | 'maya'
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10,2) NOT NULL,
  qr_code_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. User Tasting Log & Passport Stamps
CREATE TABLE IF NOT EXISTS public.user_tastings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.food_profiles(id) ON DELETE CASCADE,
  food_id TEXT REFERENCES public.food_items(id) ON DELETE CASCADE,
  establishment_id TEXT REFERENCES public.establishments(id) ON DELETE SET NULL,
  dish_name TEXT NOT NULL,
  establishment_name TEXT NOT NULL,
  spice_level INTEGER DEFAULT 1,
  notes TEXT,
  photo_url TEXT,
  xp_earned INTEGER DEFAULT 60,
  tasted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.food_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tastings ENABLE ROW LEVEL SECURITY;

-- Catalog tables: Public read
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read food_items" ON public.food_items;
CREATE POLICY "Public read food_items" ON public.food_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read establishments" ON public.establishments;
CREATE POLICY "Public read establishments" ON public.establishments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read food_trails" ON public.food_trails;
CREATE POLICY "Public read food_trails" ON public.food_trails FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read posts" ON public.posts;
CREATE POLICY "Public read posts" ON public.posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read post_comments" ON public.post_comments;
CREATE POLICY "Public read post_comments" ON public.post_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read post_likes" ON public.post_likes;
CREATE POLICY "Public read post_likes" ON public.post_likes FOR SELECT USING (true);

-- Profiles: Public read, user can update their own
DROP POLICY IF EXISTS "Public read profiles" ON public.food_profiles;
CREATE POLICY "Public read profiles" ON public.food_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.food_profiles;
CREATE POLICY "Users can update own profile" ON public.food_profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.food_profiles;
CREATE POLICY "Users can insert own profile" ON public.food_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts & Comments: Authenticated users can insert, update/delete their own
DROP POLICY IF EXISTS "Users can insert posts" ON public.posts;
CREATE POLICY "Users can insert posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can insert comments" ON public.post_comments;
CREATE POLICY "Users can insert comments" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.post_comments;
CREATE POLICY "Users can delete own comments" ON public.post_comments FOR DELETE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can toggle likes" ON public.post_likes;
CREATE POLICY "Users can toggle likes" ON public.post_likes FOR ALL USING (auth.uid() = user_id);

-- User Saved / Bookmarks: Private to user
DROP POLICY IF EXISTS "Users manage own saved items" ON public.user_saved;
CREATE POLICY "Users manage own saved items" ON public.user_saved FOR ALL USING (auth.uid() = user_id);

-- Orders: Users view and manage their own orders
DROP POLICY IF EXISTS "Users manage own orders" ON public.user_orders;
CREATE POLICY "Users manage own orders" ON public.user_orders FOR ALL USING (auth.uid() = user_id);

-- Tasting Log: Users manage their own tastings" ON public.user_tastings;
DROP POLICY IF EXISTS "Users manage own tastings" ON public.user_tastings;
CREATE POLICY "Users manage own tastings" ON public.user_tastings FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.food_profiles (
    id,
    name,
    email,
    phone,
    avatar_url,
    spice_preference,
    favorite_district,
    member_since
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'spice_preference', 'moderate'),
    COALESCE(NEW.raw_user_meta_data->>'favorite_district', 'Centro'),
    to_char(NOW(), 'Month YYYY')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, food_profiles.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 13. STORAGE BUCKET: 'food' & POLICIES
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'food',
  'food',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage bucket access policies:
-- Public can view/read any photo in the 'food' bucket
DROP POLICY IF EXISTS "Public Read Food Bucket" ON storage.objects;
CREATE POLICY "Public Read Food Bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'food');

-- Authenticated users can upload photos into the 'food' bucket
DROP POLICY IF EXISTS "Authenticated Upload Food Bucket" ON storage.objects;
CREATE POLICY "Authenticated Upload Food Bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'food');

-- Users can update or delete their own uploads
DROP POLICY IF EXISTS "Users Update Own Uploads Food Bucket" ON storage.objects;
CREATE POLICY "Users Update Own Uploads Food Bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'food' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users Delete Own Uploads Food Bucket" ON storage.objects;
CREATE POLICY "Users Delete Own Uploads Food Bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'food' AND auth.uid()::text = (storage.foldername(name))[1]);




-- ==============================================================================
-- SEED DATA
-- ==============================================================================

-- ==============================================================================
-- NAGA FOOD APP: AUTOMATED SEED DATA MIGRATION
-- Generated from frontend/src/data mock sets
-- ==============================================================================

-- 1. Categories
INSERT INTO public.categories (id, label, icon, description) VALUES
  ('heritage-soups', 'Heritage Soups & Noodles', 'restaurant-outline', 'Iconic comforting broths including Kinalas and Pancit Bato'),
  ('gata-sili', 'Gata & Sili Classics', 'flame-outline', 'Slow-simmered dishes in rich coconut milk and siling labuyo'),
  ('pili-delicacies', 'Pili Nut Specialties', 'nutrition-outline', 'Indigenous Bicolano nut roasted, glazed, and transformed into sweets'),
  ('bakery-merienda', 'Local Bakeries & Merienda', 'cafe-outline', 'Crisp toasted siopao, pan bonete, and afternoon snacks'),
  ('street-grill', 'Street Food & Night Eats', 'fast-food-outline', 'Bustling night market grills, skewers, and street stalls'),
  ('coolers-beverages', 'Coolers & Native Drinks', 'wine-outline', 'Native tablea chocolate, pili shakes, and shaved ice desserts')
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, icon = EXCLUDED.icon, description = EXCLUDED.description;

-- 2. Food Items
INSERT INTO public.food_items (id, name, bikol_name, tagline, description, cultural_context, category_id, category_label, image_url, price_range, price_level, serving_spots_count, featured, flavor_profile, tags) VALUES
  ('kinalas', 'Kinalas', 'Kinalas na Baka / Orig', 'Naga’s crown jewel noodle soup drenched in savory brain gravy', 'A hearty noodle soup distinctive to Naga City. Fresh miki noodles are served in a rich, slow-simmered beef and pork bone broth, topped with tender meat scraped from the boiled head and bones, crowned with a thick, savory brown gravy traditionally made from beef or pork brain and pan juices. Garnished with spring onions, toasted garlic, chili paste, and hard-boiled egg.', 'The name originates from the Bikol verb "kalas", meaning "to fall off" or "to separate from the bone", referring to how the tender head meat detaches after hours of boiling. Born as a working-class comfort meal along Barlin and Bagumbayan, it is now the quintessential Naga food rite of passage.', 'heritage-soups', 'Heritage Soups & Noodles', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱70 – ₱120', 'budget', 4, true, '{"Rich & Savory","Umami Gravy","Spicy Kick","Citrusy Calamansi"}', '{"Soup","Noodles","Beef/Pork","Must-Try","Local Heritage"}'),
  ('sinanglay', 'Sinanglay na Tilapia', 'Sinanglay', 'Whole freshwater fish stuffed with aromatics and wrapped in leafy greens simmered in chili coconut cream', 'Fresh tilapia split down the spine and stuffed with minced onions, garlic, tomatoes, ginger, and wild bird’s eye chilies. The fish is securely wrapped in blanched pechay or gabi (taro) leaves, tied with banana twine, and gently braised in thick kakang gata (coconut milk).', 'Sinanglay represents the agrarian and freshwater bounty of the Bicol River basin. Wrapping the fish in leaves keeps the flesh extraordinarily moist while allowing the coconut milk and chili oils to infuse directly into the bone.', 'gata-sili', 'Gata & Sili Classics', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱140 – ₱240', 'moderate', 4, true, '{"Creamy Coconut","Fresh Ginger","Mild to Fiery Sili","Tender Fish"}', '{"Fish","Coconut Milk","Spicy","Bicolano Staple"}'),
  ('toasted-siopao', 'Naga Toasted Siopao', 'Tinapang Siopao', 'Crisp, golden oven-baked buns packed with spiced pork asado and salted egg', 'Unlike steamed Chinese bao, Naga’s toasted siopao is baked until the exterior crust turns amber-golden and flaky-crisp. Inside lies a dense, savory-sweet filling of stewed braised pork, boiled quail or salted egg, and rich caramelized onion reduction.', 'First popularized by Naga bakeries in the 1980s, the toasted siopao was engineered as a hearty, mess-free travel merienda for locals commuting across Camarines Sur and travelers boarding buses at the CBD terminal.', 'bakery-merienda', 'Local Bakeries & Merienda', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱20 – ₱35 each', 'budget', 4, true, '{"Crisp Crust","Sweet-Savory Pork","Salted Egg","Flaky"}', '{"Bakery","Merienda","Takeaway","Affordable","Naga Original"}'),
  ('pinangat', 'Pinangat', 'Pinangat / Pangat', 'Tightly folded taro leaf parcels filled with smoked fish, pork, and coconut cream', 'A masterclass in slow cooking: young gabi (taro) leaves are meticulously layered around a core of smoked fish flakes, bits of pork, aromatics, and coconut cream, tied into neat pouches, and simmered for hours over low fire until the leaves melt into tender velvet.', 'While rooted in Camalig, Pinangat is a daily lunch centerpiece across Naga’s heritage carinderias and family dining tables, often paired with piping hot steamed rice and grilled meats.', 'gata-sili', 'Gata & Sili Classics', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱60 – ₱110', 'budget', 4, true, '{"Earthy Taro Leaf","Rich Coconut Milk","Smoky Flakes","Subtle Heat"}', '{"Taro Leaves","Slow Cooked","Traditional","Rice Companion"}'),
  ('bicol-express', 'Bicol Express', 'Sinilihan', 'Succulent pork belly simmered in creamy coconut milk and fermented shrimp paste with generous chilies', 'Cubed pork belly slowly stewed in coconut milk with sauteed garlic, ginger, and fermented shrimp paste (balaw), balanced by an authentic heap of native green and red chilies. Rich, piquant, and undeniably warming with a glistening latik oil sheen.', 'Locals also refer to the indigenous family of this dish as "Gulay na may Lada" or "Sinilihan". In Naga, the balance tilts toward velvety coconut reduction rather than watery sauce.', 'gata-sili', 'Gata & Sili Classics', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱160 – ₱280', 'moderate', 5, true, '{"Savory Balaw","Velvety Gata","Chili Warmth","Tender Pork"}', '{"Pork","Coconut","Spicy","Iconic Filipino","Must-Try"}'),
  ('laing', 'Laing na Natong', 'Gulay na Natong', 'Shredded sun-dried taro leaves slow-braised in pure coconut cream and bird’s eye chilies', 'Whole taro leaves and stalks are sun-dried, shredded, and simmered slowly in rich kakang gata without stirring until the leaves turn into a tender, velvety, dark-olive green confit infused with fermented balaw and chili oil.', 'The Bicolano benchmark of patience: stirring before the leaves are fully cooked will release itchy calcium oxalate crystals. Served at every festive and home feast in Camarines Sur.', 'gata-sili', 'Gata & Sili Classics', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱70 – ₱140', 'budget', 3, true, '{"Tender Taro Greens","Rich Coconut Cream","Fiery Chili","Savory Pork Bits"}', '{"Vegetables","Coconut","Spicy","Heritage Bicolano"}'),
  ('kinunot', 'Kinunot na Isda', 'Kinunot', 'Flaked fish in rich coconut cream with fresh malunggay leaves and sliced ginger', 'Tender, finely shredded fish flakes simmered in rich kakang gata, generously folded with vibrant green malunggay (moringa) leaves, sliced ginger, and native siling labuyo. A delicately balanced, nourishing Bicolano classic.', 'Traditionally prepared with stingray (pagi) or shark, modern Naga eateries make this everyday favorite with flaked fish, balancing rich coconut fats with iron-rich moringa.', 'gata-sili', 'Gata & Sili Classics', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱80 – ₱160', 'budget', 3, false, '{"Velvety Coconut","Fresh Moringa","Warm Ginger","Subtle Heat"}', '{"Fish","Moringa","Coconut Milk","Comfort Food"}'),
  ('sinantol', 'Sinantol', 'Ginataang Santol', 'Grated cotton fruit pulp simmered in spiced coconut cream and fermented shrimp paste', 'Grated sour santol fruit pulp is squeezed of its excess juice, then slow-cooked in thick coconut cream with garlic, onions, pork bits, balaw, and crushed chilies until it reduces into a savory, tangy, glistening meat-like paste.', 'A true masterclass in transforming indigenous backyard fruit into a savoury, appetite-opening viand that pairs exquisitely with mountain red rice.', 'gata-sili', 'Gata & Sili Classics', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱70 – ₱130', 'budget', 2, false, '{"Tangy Citrus Tartness","Savory Balaw","Rich Coconut Oil","Spicy Sili"}', '{"Fruit Ulam","Coconut","Tangy","Unique Bicolano"}'),
  ('tilmok', 'Tilmok', 'Tilmok', 'Minced crab meat and tender young coconut shreds steamed in banana leaf parcels', 'Flaked fresh crab meat and tender young coconut strips (buko) blended with garlic, ginger, and thick coconut cream, wrapped tightly into banana leaf packets and gently steamed until fragrant and unctuous.', 'A revered delicacy in Camarines Sur riverine communities, celebrated for the subtle natural sweetness of buko complementing sweet crab meat in coconut broth.', 'gata-sili', 'Gata & Sili Classics', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱85 – ₱180', 'moderate', 2, false, '{"Sweet Crab","Tender Young Coconut","Fragrant Banana Leaf","Creamy Gata"}', '{"Crab","Seafood","Steamed","Delicacy"}'),
  ('pancit-bato', 'Pancit Bato Guisado / Sinabawan', 'Pancit Bato', 'Sun-dried wood-toasted noodles from Bato tossed with vegetables and savory pork cracklings', 'Thick wheat noodles originating from Bato, Camarines Sur, that are sun-dried and gently oven-smoked. Prepared either dry-stir-fried with cabbage, carrots, and pork, or immersed in broth with a dash of calamansi and dinuguan sauce.', 'Pancit Bato noodles have a distinct smoky chewiness that holds firm in broth without becoming soggy, making it a daily staple at Naga’s Central Market.', 'heritage-soups', 'Heritage Soups & Noodles', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱50 – ₱90', 'budget', 2, false, '{"Toasty Wheat","Savory Pork Sauce","Crisp Veggies","Citrus Splash"}', '{"Noodles","Merienda","Camarines Sur Heritage","Affordable"}'),
  ('crispy-pili', 'Glazed & Crispy Pili Nuts', 'Pili na Tostado', 'Buttery indigenous Bicol pili nuts hand-roasted with honey or sea salt', 'The Bicol peninsula is the global epicenter of Canarium ovatum (Pili tree). The kernels are painstakingly extracted by hand, peeled of their brown testa, and either crisp-roasted in pure honey syrup or tossed with sea salt and garlic.', 'Pili nut processing in Naga is an artisanal heritage industry. Its uniquely tender, melt-in-the-mouth texture boasts higher healthy fat content than walnuts or almonds, making it Bicol’s most prized pasalubong.', 'pili-delicacies', 'Pili Nut Specialties', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱120 – ₱350', 'moderate', 4, true, '{"Buttery Nut","Crisp Honey Glaze","Subtle Crunch","Sweet or Salted"}', '{"Pasalubong","Snack","Artisanal","Sweet","Native Tree Nut"}'),
  ('mazapan-de-pili', 'Mazapan de Pili', 'Mazapan', 'Velvety confection of finely pulverized pili nuts, sweet condensed milk, and butter', 'A dense, delicate confectionery made by blending finely ground pili nuts with rich condensed milk, egg yolk, and butter, then gently cooked over low heat until it achieves a smooth, marzipan-like meltiness.', 'A Spanish-colonial influenced pastry that Naga confectioners perfected using local pili instead of European almonds. Wrapped individually in colorful cellophane, it is a staple gift for visiting dignitaries and families.', 'pili-delicacies', 'Pili Nut Specialties', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱90 – ₱220', 'budget', 5, false, '{"Rich Butter","Sweet Milk","Silky Nut Texture","Melt-in-Mouth"}', '{"Confectionery","Pasalubong","Sweet","Heritage"}'),
  ('pili-shake', 'Pili Milkshake & Tablea Cooler', 'Pili Shake', 'Chilled blended shake made of fresh pili nut cream, fresh milk, and brown sugar drizzle', 'A decadent, nutty cold beverage crafted with pure crushed pili nut paste, whole milk, shaved ice, and a dash of cinnamon or roasted tablea cacao shavings.', 'Developed by modern Naga cafes along Magsaysay Avenue to offer travelers a refreshing respite from midday Bicol heat while highlighting local harvests.', 'coolers-beverages', 'Coolers & Native Drinks', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱95 – ₱160', 'budget', 3, false, '{"Creamy Nutty","Smooth Milk","Light Sweetness","Ice Cold"}', '{"Beverage","Cafe","Pili","Cooler","Modern Local"}'),
  ('baduya', 'Baduya (Maruya Fritters)', 'Sinapot / Baduya', 'Crisp fanned Saba banana fritters fried golden and sprinkled with sugar', 'Thinly sliced ripe Saba bananas fanned out, dipped in light batter, and flash-fried to golden amber crunchiness. Sprinkled with sugar crystals, this street merienda is the iconic local accompaniment dunked into savory Kinalas broth.', 'Known in Naga as Sinapot or Baduya, having a plate of warm baduya alongside a steaming bowl of kinalas at Barlin or Dayangdang stalls is the quintessential local food ritual.', 'street-grill', 'Street Food & Night Eats', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱15 – ₱30', 'budget', 5, true, '{"Crisp Batter","Sweet Saba Banana","Sugar Crunch","Warm & Fluffy"}', '{"Street Food","Merienda","Banana","Kinalas Pairing","Affordable"}'),
  ('naga-night-skewers', 'Naga Night Skewers & Barbecue', 'Inihaw na Baboy buda Isaw', 'Smoky charcoal-grilled pork skewers, isaw, and street eats from Plaza night carts', 'Tender marinated pork skewers and coiled chicken isaw grilled over coconut charcoal embers, basted with a sweet-savory banana ketchup glaze and served with spicy native sinamak chili vinegar.', 'Every evening after dusk, the plazas and street corners of Centro and Magsaysay come alive with smoking barbecue grates where locals gather for cold drinks and street conversation.', 'street-grill', 'Street Food & Night Eats', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', '₱15 – ₱60 per stick', 'budget', 3, false, '{"Smoky Charcoal","Sweet-Savory Glaze","Tangy Chili Vinegar","Tender Meat"}', '{"Street Food","Grill","Pork","Night Life","Affordable"}')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url, flavor_profile = EXCLUDED.flavor_profile, tags = EXCLUDED.tags;

-- 3. Establishments
INSERT INTO public.establishments (id, name, type, type_label, description, address, neighborhood, latitude, longitude, map_x, map_y, distance_km, opening_hours, is_open_now, contact_number, hero_image, logo, gallery_images, foods_offered, price_level, atmosphere_tags) VALUES
  ('cha-chas-kinalas', 'Cha Cha’s Kinalas & Sinanglay', 'kinalas-station', 'Kinalas Station & Carinderia', 'An unpretentious, beloved open-air kinalasan on Barlin Street. Renowned for its dark, deeply flavorful brain gravy, tender beef scrapings, and freshly fried baduya on the side.', 'Barlin Street, Barangay Santa Cruz, Naga City', 'Barlin St / Santa Cruz', 13.6264, 123.1842, 42, 48, 0.4, '7:00 AM – 8:30 PM', true, '+63 917 555 8291', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"kinalas","foodName":"Kinalas Special (with Egg & Extra Brain Gravy)","price":85,"isSignature":true,"servingNote":"Served piping hot with homemade chili paste and calamansi"},{"foodId":"sinanglay","foodName":"Sinanglay na Tilapia","price":150,"isSignature":true,"servingNote":"Wrapped in fresh pechay with thick coconut reduction"},{"foodId":"pinangat","foodName":"Traditional Pinangat","price":70,"isSignature":false,"servingNote":"Slow simmered taro leaf pouch"},{"foodId":"baduya","foodName":"Crispy Saba Baduya Pair","price":20,"isSignature":true,"servingNote":"Hot fried banana fritters, dunked in savory kinalas gravy"},{"foodId":"naga-night-skewers","foodName":"Pork Barbecue Skewers (2 sticks)","price":35,"isSignature":false}]'::jsonb, 'budget', '{"Casual Outdoor","Bustling Morning","Authentic Local","Wheelchair Accessible"}'),
  ('aling-celys-kinalasan', 'Aling Cely’s Heritage Kinalas', 'kinalas-station', 'Heritage Kinalas Station', 'Serving locals for over 35 years in Santa Cruz. Known for its rich bone broth, tender fork-scraped beef cheek meat, and freshly fried maruya (baduya).', 'Barlin Street cor. Dimasalang St., Barangay Santa Cruz, Naga City', 'Barlin St / Santa Cruz', 13.6268, 123.1848, 43, 47, 0.5, '6:30 AM – 7:00 PM', true, '+63 920 882 1430', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"kinalas","foodName":"Aling Cely’s Extra Meat Kinalas","price":90,"isSignature":true,"servingNote":"Generous fork-shredded beef head meat with egg"},{"foodId":"pinangat","foodName":"Home-style Pinangat","price":65,"isSignature":false},{"foodId":"baduya","foodName":"Fresh Hot Baduya Fritter","price":20,"isSignature":true,"servingNote":"Crispy fried Saba banana dusted with sugar"}]'::jsonb, 'budget', '{"Heritage Institution","Quick Turnaround","Morning Rush","Local Favorite"}'),
  ('cha-kamot-kinalas', 'Cha Kamot (Cordova’s Kinalasan)', 'kinalas-station', 'Heritage Kinalas Station', 'A beloved Dayangdang culinary institution established in 1998. Celebrated for its deeply concentrated peppery beef-head stock, flatter bitang noodles, and generous rich brain sauce.', 'Corregidor Street, Barangay Dayangdang, Naga City', 'Dayangdang District', 13.6295, 123.1908, 56, 41, 0.9, '7:00 AM – 8:00 PM', true, '+63 919 334 1289', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"kinalas","foodName":"Cha Kamot Beef Broth Special (with Bitang Noodles)","price":85,"isSignature":true,"servingNote":"Silkier noodles in concentrated head stock with egg"},{"foodId":"baduya","foodName":"Cha Kamot Golden Baduya","price":20,"isSignature":true,"servingNote":"Crispy fanned banana fritters"},{"foodId":"pancit-bato","foodName":"Pancit Bato Guisado Bowl","price":60,"isSignature":false}]'::jsonb, 'budget', '{"Local Legend","Comfort Food","Open-Air Shed","Quick Service"}'),
  ('geewan-bicolano-eatery', 'Geewan Bicolano Heritage Eatery', 'carinderia', 'Turo-Turo Heritage Eatery', 'Located in the heart of Centro Naga, Geewan is a classic turo-turo (point-and-choose) eatery offering the widest selection of fresh authentic Bicolano coconut milk and chili viands.', 'P. Burgos Street, Barangay San Francisco, Centro, Naga City', 'Centro / Plaza Rizal', 13.6241, 123.1821, 36, 54, 0.2, '7:30 AM – 7:30 PM', true, '+63 54 473 3881', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"pinangat","foodName":"Fresh Geewan Pinangat","price":60,"isSignature":true,"servingNote":"Served hot with extra coconut milk reduction on request"},{"foodId":"bicol-express","foodName":"Homestyle Sinilihan (Bicol Express)","price":120,"isSignature":true},{"foodId":"sinanglay","foodName":"Sinanglay na Tilapia","price":140,"isSignature":false},{"foodId":"kinunot","foodName":"Geewan Kinunot na Isda","price":85,"isSignature":true,"servingNote":"Tender flaked fish in coconut cream with fresh malunggay"},{"foodId":"sinantol","foodName":"Ginataang Sinantol","price":70,"isSignature":true,"servingNote":"Tangy-spicy grated santol simmered with balaw"},{"foodId":"laing","foodName":"Authentic Gulay na Natong (Laing)","price":75,"isSignature":true,"servingNote":"Slow simmered shredded taro leaves in rendered kakang gata"},{"foodId":"tilmok","foodName":"Steamed Tilmok Pouch","price":90,"isSignature":false}]'::jsonb, 'budget', '{"Point & Choose Turo-Turo","Quick Lunch","Centro Hub","Budget Friendly"}'),
  ('naga-peoples-mall-stalls', 'Naga People’s Mall (Carinderia Row)', 'street-stall', 'Public Market Carinderia Section', 'Inside the 2nd floor of Naga City People’s Mall (one of Southeast Asia’s largest single market complexes). Home to historic vendors dishing out fresh Pancit Bato, steaming Kinalas broth, and sizzling skewers.', '2nd Level, General Luna Street, Centro, Naga City', 'Centro / People’s Mall', 13.6219, 123.1805, 30, 60, 0.5, '5:30 AM – 6:00 PM', true, '', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"pancit-bato","foodName":"Market-Style Pancit Bato Guisado","price":50,"isSignature":true,"servingNote":"Stir fried with chicharron bits and fresh kalamansi"},{"foodId":"kinalas","foodName":"Market Stall Kinalas","price":70,"isSignature":false,"servingNote":"Classic quick bowl served on plastic tables"},{"foodId":"baduya","foodName":"Crispy Market Baduya","price":15,"isSignature":true},{"foodId":"naga-night-skewers","foodName":"Pork Barbecue & Isaw Sticks","price":20,"isSignature":true,"servingNote":"Grilled fresh with native spiced vinegar"}]'::jsonb, 'budget', '{"Market Atmosphere","Early Morning","Raw & Authentic","Very Inexpensive"}'),
  ('biggs-diner-centro', 'Bigg’s Diner (Centro Flagship)', 'restaurant', 'Iconic Homegrown Diner', 'Founded in Naga in 1983 as Mang Donald’s. The legendary flagship diner where Bicolano fast-casual hospitality began, serving crispy chicken, tenderloin tips, and classic shakes.', 'Elias Angeles St. cor. General Luna St., Centro, Naga City', 'Centro District', 13.6225, 123.1818, 38, 56, 0.3, '7:00 AM – 10:00 PM', true, '+63 54 473 1111', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"pili-shake","foodName":"Signature Blended Pili Shake","price":130,"isSignature":true,"servingNote":"Creamy indigenous pili nut shake with chocolate drizzle"},{"foodId":"bicol-express","foodName":"Bigg’s Pork Bicol Express Rice Meal","price":195,"isSignature":true,"servingNote":"Simmered pork in creamy gata with garlic rice"},{"foodId":"toasted-siopao","foodName":"Bigg’s Toasted Pork Siopao","price":30,"isSignature":false}]'::jsonb, 'moderate', '{"Retro 50s Diner","Air-Conditioned","Homegrown Legend","Family Friendly"}'),
  ('biggs-diner-magsaysay', 'Bigg’s Diner (Magsaysay)', 'restaurant', 'Diner & Evening Patio', 'The lively Magsaysay Avenue outpost of Bicol’s favorite diner, featuring an outdoor patio terrace, cold pili shakes, and comforting all-day meals.', 'Magsaysay Avenue (near Avenue Square), Naga City', 'Magsaysay Avenue', 13.6292, 123.1965, 70, 44, 1.5, '8:00 AM – 11:00 PM', true, '+63 54 472 2222', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"pili-shake","foodName":"Crispy Glazed Pili Nut Shake","price":135,"isSignature":true,"servingNote":"Blended roasted pili nuts topped with crushed pili brittle"},{"foodId":"bicol-express","foodName":"Magsaysay Bicol Express Platter","price":195,"isSignature":true},{"foodId":"crispy-pili","foodName":"Side Order Honey Pili Nuts","price":140,"isSignature":false}]'::jsonb, 'moderate', '{"Vibrant Terrace","Late Night Bites","Air-Conditioned","Youth Hangout"}'),
  ('bob-marlin-restaurant', 'Bob Marlin Bicolano Cuisine', 'restaurant', 'Casual Heritage Dining', 'A staple along the culinary corridor of Magsaysay Avenue. Bob Marlin is renowned for its national award-winning Crispy Pata and elevated native Bicolano specialties served in a warm garden setting.', 'Magsaysay Avenue, Barangay Dayangdang, Naga City', 'Magsaysay Avenue', 13.6305, 123.1985, 74, 42, 1.6, '11:00 AM – 10:00 PM', true, '+63 54 473 1339', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"bicol-express","foodName":"Marlin’s Signature Bicol Express","price":245,"isSignature":true,"servingNote":"Slow simmered pork belly in rich gata and native chilies"},{"foodId":"sinanglay","foodName":"Sinanglay na Tilapia Feast","price":220,"isSignature":true,"servingNote":"Generous whole fish in coconut broth with hot rice"},{"foodId":"pinangat","foodName":"Claypot Steamed Pinangat","price":110,"isSignature":false},{"foodId":"kinunot","foodName":"Marlin’s Kinunot na Isda","price":160,"isSignature":true,"servingNote":"Shredded fish in rich coconut milk with moringa leaves"},{"foodId":"laing","foodName":"Heirloom Laing na Natong","price":130,"isSignature":true,"servingNote":"Velvety braised dried taro leaves in rendered kakang gata"}]'::jsonb, 'moderate', '{"Family Dining","Live Music Evenings","Garden Vibe","Air-Conditioned"}'),
  ('red-platter', 'The Red Platter', 'restaurant', 'Modern Bicolano Dining & Patisserie', 'A premier culinary destination on Magsaysay Avenue known for elevated Bicolano classics, crispy liempo bicol express, and handcrafted pili pastries.', 'Magsaysay Avenue, Barangay Dayangdang, Naga City', 'Magsaysay Avenue', 13.6301, 123.1978, 72, 43, 1.6, '10:00 AM – 10:00 PM', true, '+63 54 472 8888', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"bicol-express","foodName":"Crispy Liempo Bicol Express","price":260,"isSignature":true,"servingNote":"Crispy pork belly bicol express reduction"},{"foodId":"sinanglay","foodName":"Red Platter Sinanglay","price":230,"isSignature":true},{"foodId":"pili-shake","foodName":"Signature Roasted Pili Frappe","price":145,"isSignature":false},{"foodId":"mazapan-de-pili","foodName":"Artisanal Mazapan & Pili Cheesecake","price":150,"isSignature":true}]'::jsonb, 'moderate', '{"Fine Casual","Patisserie & Cakes","Air-Conditioned","Wine & Cocktails"}'),
  ('chef-doys-restaurant', 'Chef Doy’s Gourmet Restaurant', 'restaurant', 'Artisanal Bicolano Heritage Dining', 'Hidden inside Cereza Compound, Chef Doy’s showcases innovative interpretations of ancestral Camarines Sur dishes like Sinanglay na Tilapia, Tilmok, and Kinunot in a lush garden courtyard setting.', 'Cereza Compound, Magsaysay Avenue, Naga City', 'Magsaysay Avenue', 13.6312, 123.1992, 76, 41, 1.7, '11:00 AM – 10:00 PM', true, '+63 54 881 7777', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"sinanglay","foodName":"Gourmet Sinanglay na Tilapia","price":240,"isSignature":true,"servingNote":"Fresh pechay wrap with ginger-sili coconut reduction"},{"foodId":"tilmok","foodName":"Chef Doy’s Steamed Crab Tilmok","price":180,"isSignature":true,"servingNote":"Steamed crab and young coconut ribbons in banana leaves"},{"foodId":"bicol-express","foodName":"Special Pork Sinilihan","price":250,"isSignature":false},{"foodId":"kinunot","foodName":"Gourmet Kinunot na Isda","price":175,"isSignature":true},{"foodId":"sinantol","foodName":"Simmered Sinantol Appetizer","price":120,"isSignature":false}]'::jsonb, 'moderate', '{"Garden Courtyard","Farm-to-Table","Romantic","Air-Conditioned"}'),
  ('3n-bakery-triangulo', '3N Bakery (Triangulo)', 'bakery', 'Originator of Commercial Toasted Siopao', 'The famous bakeshop chain that made Naga’s toasted siopao a regional phenomenon. Freshly baked hourly with signature golden crispy crusts.', 'Ninoy & Cory Aquino Avenue, Barangay Triangulo, Naga City', 'Triangulo / CBD II', 13.6205, 123.1912, 58, 64, 1.1, '5:30 AM – 9:00 PM', true, '+63 54 472 3333', 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1509912760195-25b8ef6c3b87?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"toasted-siopao","foodName":"3N Original Toasted Siopao (Box of 10 or Solo)","price":25,"isSignature":true,"servingNote":"Oven-hot every 30 minutes with savory pork and salted egg"},{"foodId":"mazapan-de-pili","foodName":"3N Mazapan de Pili Bars","price":95,"isSignature":false},{"foodId":"crispy-pili","foodName":"Toasted Crispy Pili Bag","price":130,"isSignature":false}]'::jsonb, 'budget', '{"Fast Takeaway","Hot Bakes Hourly","Commuter Favorite","Budget Friendly"}'),
  ('pan-de-naga-heritage', 'Pan De Naga Heritage Bakery', 'bakery', 'Old Centro Heritage Bakeshop', 'Centuries-old Centro bakeshop celebrated for heirloom oven-toasted siopao, pan bonete, and traditional merienda pairings with hot native tablea chocolate.', 'Elias Angeles St., Centro, Naga City', 'Centro District', 13.6245, 123.1835, 45, 52, 0.2, '6:00 AM – 8:00 PM', true, '+63 54 473 7777', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"toasted-siopao","foodName":"Heritage Oven-Toasted Siopao","price":25,"isSignature":true,"servingNote":"Crispy baked pork asado bun with salted egg"},{"foodId":"mazapan-de-pili","foodName":"Artisanal Mazapan de Pili Bar","price":95,"isSignature":true},{"foodId":"baduya","foodName":"Pan De Naga Banana Fritters","price":20,"isSignature":true}]'::jsonb, 'budget', '{"Heritage Bakery","4 PM Merienda","Centro Classic","Takeaway Friendly"}'),
  ('bakers-plaza-naga', 'Baker’s Plaza Bakery & Cafe', 'bakery', 'Local Bakery & Pasalubong', 'A Naga institution since the 1970s. Famous for continuous fresh batches of hot toasted siopao coming straight out of industrial ovens throughout the day.', 'Panganiban Drive corner Balintawak St., Naga City', 'Panganiban Drive', 13.6238, 123.1932, 62, 62, 0.8, '6:00 AM – 9:00 PM', true, '+63 54 473 8812', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"toasted-siopao","foodName":"Fresh Baked Toasted Siopao (Box of 10 or Solo)","price":28,"isSignature":true,"servingNote":"Oven-fresh every 30 minutes; sweet pork & salted egg"},{"foodId":"mazapan-de-pili","foodName":"Artisanal Mazapan de Pili Bars","price":110,"isSignature":false,"servingNote":"Hand-wrapped classic confectionery"},{"foodId":"crispy-pili","foodName":"Plaza Roasted Pili Nuts","price":130,"isSignature":false}]'::jsonb, 'budget', '{"Air-Conditioned","Takeaway Friendly","Card Accepted","Fast Service"}'),
  ('j-emanuel-pili', 'J. Emanuel Pastries & Pili Delights', 'pasalubong-center', 'Pili Specialty Center', 'Widely regarded as the premier producer of authentic Bicol pili confections in Naga. Offers fresh samples, vacuum-packed crispy pili nuts, and artisanal gift packaging.', 'Diversion Road corner Magsaysay Ave., Naga City', 'Diversion / Magsaysay', 13.6212, 123.2045, 82, 68, 2.1, '8:00 AM – 8:00 PM', true, '+63 54 811 1888', 'https://images.unsplash.com/photo-1509912760195-25b8ef6c3b87?auto=format&fit=crop&w=900&q=80', 'https://images.unsplash.com/photo-1509912760195-25b8ef6c3b87?auto=format&fit=crop&w=240&q=80', '{"https://images.unsplash.com/photo-1509912760195-25b8ef6c3b87?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=900&q=80"}', '[{"foodId":"crispy-pili","foodName":"Honey-Glazed Crispy Pili Nuts (250g Jar)","price":260,"isSignature":true,"servingNote":"Award-winning slow roasted native nuts with pure honey"},{"foodId":"mazapan-de-pili","foodName":"Handmade Mazapan de Pili Roll","price":135,"isSignature":true,"servingNote":"Pure ground pili confection"},{"foodId":"pili-shake","foodName":"Pili Lounge Cooler","price":130,"isSignature":false}]'::jsonb, 'moderate', '{"Pasalubong Shopping","Free Samples","Credit Card Friendly","Box Packaging"}')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, address = EXCLUDED.address, hero_image = EXCLUDED.hero_image, foods_offered = EXCLUDED.foods_offered;

-- 4. Food Trails
INSERT INTO public.food_trails (id, title, subtitle, description, hero_image, badge_name, badge_icon, xp_reward, estimated_duration, stops) VALUES
  ('trail-barlin-kinalas', 'The Legendary Barlin & Dayangdang Kinalas Crawl', '', 'Walk the storied noodle alleyways of Santa Cruz and Dayangdang. Taste the rich difference in bone reduction broths, homemade sili paste, and crispy baduya pairings across top heritage stalls.', 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=900&q=80', '', '', 150, '2 hours', '[]'::jsonb),
  ('trail-gata-sili-trial', 'Magsaysay Food Strip — Modern Bicolano Feast', '', 'A culinary walk down Naga’s premier dining boulevard. Experience elevated crispy liempo Bicol express, gourmet pechay-wrapped sinanglay, and cold pili milkshakes.', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80', '', '', 150, '2 hours', '[]'::jsonb),
  ('trail-heritage-merienda', 'Centro & Downtown Heritage Food Trail', '', 'Follow the classic afternoon and morning culinary circuits of Centro Nagueños: market-style Pancit Bato, slow-simmered Pinangat, and oven-fresh Toasted Siopao.', 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=900&q=80', '', '', 150, '2 hours', '[]'::jsonb),
  ('trail-penafrancia-pilgrimage', 'The Peñafrancia Pilgrimage & Riverside Flavors Trail', '', 'Trace the sacred route of the world-famous Peñafrancia Festival. Experience riverbank delicacies, crispy pili nuts, and freshly baked toasted siopao across historic sanctuaries.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80', '', '', 150, '2 hours', '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, hero_image = EXCLUDED.hero_image, stops = EXCLUDED.stops;

