import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jkfrmcvqonuvcemlwsls.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZnJtY3Zxb251dmNlbWx3c2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzAyNjMsImV4cCI6MjA4OTg0NjI2M30.JbHVg43uYfdUsIDwRChDDXFPcNrmGcN9_QDNdLsrMuc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
