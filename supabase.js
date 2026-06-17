import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = "https://imsevturnvlegnmszuyx.supabase.co"
const supabaseKey = "YOUR_ANON_KEY_HERE"

export const supabase = createClient(supabaseUrl, supabaseKey)


// =====================
// AUTH
// =====================
export const getUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}


// =====================
// FRIEND SYSTEM
// =====================
export const sendFriendRequest = async (receiver_id) => {
  const user = await getUser()
  if (!user) return

  return await supabase.from("friend_requests").insert({
    sender_id: user.id,
    receiver_id,
    status: "pending"
  })
}

export const acceptFriendRequest = async (request_id) => {
  return await supabase
    .from("friend_requests")
    .update({ status: "accepted" })
    .eq("id", request_id)
}

export const getFriendRequests = async () => {
  const user = await getUser()
  if (!user) return []

  const { data } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("receiver_id", user.id)

  return data || []
}

export const getFriends = async () => {
  const user = await getUser()
  if (!user) return []

  const { data } = await supabase
    .from("friends")
    .select("*")
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

  return data || []
}


// =====================
// ALBUM SHARING
// =====================
export const sendAlbumToFriend = async (friend_id, album) => {
  const user = await getUser()
  if (!user) return

  return await supabase.from("shared_albums").insert({
    sender_id: user.id,
    receiver_id: friend_id,
    title: album.title,
    artist: album.artist,
    image_url: album.cover_url || album.image_url,
    spotify_url: album.spotify_url || ""
  })
}

export const getSharedAlbums = async () => {
  const user = await getUser()
  if (!user) return []

  const { data } = await supabase
    .from("shared_albums")
    .select("*")
    .eq("receiver_id", user.id)
    .order("created_at", { ascending: false })

  return data || []
}
