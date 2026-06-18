import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

export const supabase = createClient(
  "https://imsevturnvlegnmszuyx.supabase.co",
  "YOUR_ANON_KEY"
)

// --------------------
// AUTH SAFE WRAPPER
// --------------------
export const getUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data?.user ?? null
}

// --------------------
// PROFILE SAFE FETCH
// --------------------
export const getProfile = async (id) => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()

  return data ?? null
}
