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
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read food_items" ON public.food_items FOR SELECT USING (true);
CREATE POLICY "Public read establishments" ON public.establishments FOR SELECT USING (true);
CREATE POLICY "Public read food_trails" ON public.food_trails FOR SELECT USING (true);
CREATE POLICY "Public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public read post_comments" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Public read post_likes" ON public.post_likes FOR SELECT USING (true);

-- Profiles: Public read, user can update their own
CREATE POLICY "Public read profiles" ON public.food_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.food_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.food_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts & Comments: Authenticated users can insert, update/delete their own
CREATE POLICY "Users can insert posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Users can insert comments" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can delete own comments" ON public.post_comments FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Users can toggle likes" ON public.post_likes FOR ALL USING (auth.uid() = user_id);

-- User Saved / Bookmarks: Private to user
CREATE POLICY "Users manage own saved items" ON public.user_saved FOR ALL USING (auth.uid() = user_id);

-- Orders: Users view and manage their own orders
CREATE POLICY "Users manage own orders" ON public.user_orders FOR ALL USING (auth.uid() = user_id);

-- Tasting Log: Users manage their own tasting logs
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

