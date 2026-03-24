import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xjwlkeonfmnfxvwiwzix.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqd2xrZW9uZm1uZnh2d2l3eml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzQ4MzAsImV4cCI6MjA4OTkxMDgzMH0.KGMnwoMzGH7I9RQrYzyM9nMGYdlygAfzlSenuhBzH_I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
