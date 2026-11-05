-- ==============================================================================
-- NAGA FOOD APP: BUSINESS & MERCHANT PORTAL SCHEMA
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- It creates all required merchant tables, security policies, and permissions.

-- 1. Businesses / Food Establishments Owned by Users
CREATE TABLE IF NOT EXISTS public.businesses (
  id TEXT PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  establishment_id TEXT,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'carinderia', -- 'kinalas-station' | 'heritage-restaurant' | 'carinderia' | 'bakery' | 'street-stall' | 'specialty-cafe' | 'pasalubong'
  type_label TEXT NOT NULL DEFAULT 'Carinderia & Turo-Turo',
  description TEXT DEFAULT '',
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL DEFAULT 'Centro',
  contact_number TEXT NOT NULL,
  opening_hours TEXT NOT NULL DEFAULT '7:00 AM – 8:30 PM',
  is_open_now BOOLEAN DEFAULT true,
  hero_image TEXT,
  logo_image TEXT,
  atmosphere_tags TEXT[] DEFAULT '{}',
  rating NUMERIC(3,2) DEFAULT 5.00,
  review_count INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active' | 'pending' | 'suspended'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Business Products / Store Menu Items
CREATE TABLE IF NOT EXISTS public.business_products (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  food_id TEXT,
  name TEXT NOT NULL,
  bikol_name TEXT,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'main-dishes',
  category_label TEXT NOT NULL DEFAULT 'Main Dishes (Ulam)',
  price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  is_signature BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  prep_time TEXT DEFAULT '5–10 mins',
  image_url TEXT,
  flavor_profile TEXT[] DEFAULT '{}',
  serving_note TEXT,
  total_orders_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Business Promotions / In-App Ad Campaigns
CREATE TABLE IF NOT EXISTS public.business_promotions (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  badge_text TEXT NOT NULL DEFAULT 'PROMO',
  discount_percent INTEGER DEFAULT 0,
  target_district TEXT NOT NULL DEFAULT 'Centro',
  featured_food_id TEXT,
  featured_food_name TEXT,
  featured_product_ids TEXT[] DEFAULT '{}',
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  orders_driven INTEGER DEFAULT 0,
  budget_tier TEXT DEFAULT 'starter',
  duration_days INTEGER DEFAULT 7,
  cost NUMERIC(10,2) DEFAULT 0.00,
  payment_mode TEXT DEFAULT 'store_balance',
  payment_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Business Wallets & Cashout Accounting
CREATE TABLE IF NOT EXISTS public.business_wallets (
  business_id TEXT PRIMARY KEY REFERENCES public.businesses(id) ON DELETE CASCADE,
  balance NUMERIC(10,2) DEFAULT 0.00,
  today_earnings NUMERIC(10,2) DEFAULT 0.00,
  pending_balance NUMERIC(10,2) DEFAULT 0.00,
  lifetime_paid NUMERIC(10,2) DEFAULT 0.00,
  payout_history JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Business Gallery Images
CREATE TABLE IF NOT EXISTS public.business_gallery (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  category TEXT DEFAULT 'Signature Food',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Business Merchant Subscriptions
CREATE TABLE IF NOT EXISTS public.business_subscriptions (
  business_id TEXT PRIMARY KEY REFERENCES public.businesses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'inactive', -- 'active' | 'inactive'
  plan TEXT DEFAULT 'none', -- 'monthly' | 'annual' | 'none'
  expiry_date TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT false,
  payment_method TEXT,
  payment_ref TEXT,
  subscribed_since TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR BUSINESS SUITE
-- ==============================================================================

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_subscriptions ENABLE ROW LEVEL SECURITY;

-- 1. Businesses policies
DROP POLICY IF EXISTS "Public can view active businesses" ON public.businesses;
CREATE POLICY "Public can view active businesses"
  ON public.businesses FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own business" ON public.businesses;
CREATE POLICY "Users can insert their own business"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can update their own business" ON public.businesses;
CREATE POLICY "Owners can update their own business"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners can delete their own business" ON public.businesses;
CREATE POLICY "Owners can delete their own business"
  ON public.businesses FOR DELETE
  USING (auth.uid() = owner_id);

-- 2. Business Products policies
DROP POLICY IF EXISTS "Public can view business products" ON public.business_products;
CREATE POLICY "Public can view business products"
  ON public.business_products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can manage business products" ON public.business_products;
CREATE POLICY "Owners can manage business products"
  ON public.business_products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE public.businesses.id = public.business_products.business_id
      AND public.businesses.owner_id = auth.uid()
    )
  );

-- 3. Business Promotions policies
DROP POLICY IF EXISTS "Public can view active promotions" ON public.business_promotions;
CREATE POLICY "Public can view active promotions"
  ON public.business_promotions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can manage business promotions" ON public.business_promotions;
CREATE POLICY "Owners can manage business promotions"
  ON public.business_promotions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE public.businesses.id = public.business_promotions.business_id
      AND public.businesses.owner_id = auth.uid()
    )
  );

-- 4. Business Wallets policies
DROP POLICY IF EXISTS "Owners can view and manage their wallet" ON public.business_wallets;
CREATE POLICY "Owners can view and manage their wallet"
  ON public.business_wallets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE public.businesses.id = public.business_wallets.business_id
      AND public.businesses.owner_id = auth.uid()
    )
  );

-- 5. Business Gallery policies
DROP POLICY IF EXISTS "Public can view business gallery" ON public.business_gallery;
CREATE POLICY "Public can view business gallery"
  ON public.business_gallery FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can manage business gallery" ON public.business_gallery;
CREATE POLICY "Owners can manage business gallery"
  ON public.business_gallery FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE public.businesses.id = public.business_gallery.business_id
      AND public.businesses.owner_id = auth.uid()
    )
  );

-- 6. Business Subscriptions policies
DROP POLICY IF EXISTS "Owners can view and manage their subscriptions" ON public.business_subscriptions;
CREATE POLICY "Owners can view and manage their subscriptions"
  ON public.business_subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE public.businesses.id = public.business_subscriptions.business_id
      AND public.businesses.owner_id = auth.uid()
    )
  );

-- ==============================================================================
-- GRANTS & SCHEMA CACHE RELOAD
-- ==============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Immediately reload PostgREST schema cache so tables are accessible without restarting
NOTIFY pgrst, 'reload schema';
