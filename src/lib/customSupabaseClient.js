import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mxeoeqxkkypvhzfefeym.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ZW9lcXhra3lwdmh6ZmVmZXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MzU4ODUsImV4cCI6MjA2NjExMTg4NX0.e4-FN-P2_sViZW2HMhoaO3-mOCwExr07oMlny2W4sUg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);