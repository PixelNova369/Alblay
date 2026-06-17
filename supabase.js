import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = "https://imsevturnvlegnmszuyx.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltc2V2dHVybnZsZWdubXN6dXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MjA5NTEsImV4cCI6MjA5NzA5Njk1MX0.1auc5wncmyL7OukXaP13lmuhl_PuPCAIXAqADnztiGg"

export const supabase = createClient(supabaseUrl, supabaseKey)

export const getUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export const saveAlbum = async (album) => {
  const user = await getUser()

  return await supabase.from("album_walls").insert({
    user_id: user.id,
    ...album
  })
}
