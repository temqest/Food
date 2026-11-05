import 'react-native-url-polyfill/auto.js';
import { createClient } from '@supabase/supabase-js';
import { safeStorage } from '@/utils/safeStorage';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PROJECT_URL ||
  'https://hncwrjcilvfqaczwlglk.supabase.co';

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLISHABLE_KEY ||
  'sb_publishable_rn5YLWLNxtbjOP3AwzSf0Q__17FM_FA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
