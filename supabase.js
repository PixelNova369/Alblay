import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://imsevturnvlegnmszuyx.supabase.co/rest/v1/"
const supabaseKey = "sb_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltc2V2dHVybnZsZWdubXN6dXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MjA5NTEsImV4cCI6MjA5NzA5Njk1MX0.1auc5wncmyL7OukXaP13lmuhl_PuPCAIXAqADnztiGg_..."

export const supabase = createClient(supabaseUrl, supabaseKey)
async function testSupabase() {
  const { data, error } = await supabase
    .from('albums')
    .select('*')

  console.log("DATA:", data)
  console.log("ERROR:", error)
}

testSupabase()
