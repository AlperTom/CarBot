// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const isBrowser = typeof window !== 'undefined';

export const supabase = isBrowser
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  : {
      // Platzhalter‑Implementierung, damit Imports nicht fehlschlagen
      from: () => ({ insert: async () => ({ error: null }) }),
    };
