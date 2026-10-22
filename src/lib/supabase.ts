import { createClient } from '@supabase/supabase-js';

// Default Supabase configuration provided for this project
const DEFAULT_SUPABASE_URL = 'https://zlanohjydjhjrfioqqll.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsYW5vaGp5ZGpoanJmaW9xcWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NDc3OTMsImV4cCI6MjEwODIyMzc5M30.H8vrqKmiX11si87elA_5Spaj60F6kngyp6rWpmnC3kU';

// Allow overriding via Vite environment variables if configured
export const SUPABASE_URL =
  (import.meta.env?.VITE_SUPABASE_URL as string)?.replace(/\/rest\/v1\/?$/, '') ||
  DEFAULT_SUPABASE_URL;

export const SUPABASE_ANON_KEY =
  (import.meta.env?.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
