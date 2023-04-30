import { createClient } from "@supabase/supabase-js"

const supabaseUrl = 'https://dpjxeujgrsnsqygvxwag.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwanhldWpncnNuc3F5Z3Z4d2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExODE5NjgsImV4cCI6MTk5Njc1Nzk2OH0.XDGbcz5_XcABlLVtVlH2TLrOwgEtn2iBkoKZ5-qhv3U'
export const supabase = createClient(supabaseUrl, supabaseKey)
