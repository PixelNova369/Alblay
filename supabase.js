import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

export const supabase = createClient(
  "https://imsevturnvlegnmszuyx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
)

// =====================
// GET CURRENT USER
// =====================
export const getUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}

// =====================
// PROFILE CREATION / FETCH
// =====================
export const getProfile = async (userId) => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  return data
}

// auto-create profile if missing
export const ensureProfile = async (user) => {
  if (!user) return

  const existing = await getProfile(user.id)

  if (!existing) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      username: user.email.split("@")[0],
      avatar_url: ""
    })
  }
}

// =====================
// FRIEND SEARCH (BY USERNAME)
// =====================
export const searchUsers = async (query) => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", `%${query}%`)

  return data || []
}

// =====================
// FRIEND REQUESTS (UNCHANGED)
// =====================
export const sendFriendRequest = async (receiver_id) => {
  const user = await getUser()
  if (!user) return

  return supabase.from("friend_requests").insert({
    sender_id: user.id,
    receiver_id,
    status: "pending"
  })
}

// =====================
// FRIENDS LIST
// =====================
export const getFriends = async () => {
  const user = await getUser()

  const { data } = await supabase
    .from("friends")
    .select("*")
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

  return data || []
}
