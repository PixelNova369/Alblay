import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabase = createClient(
  "https://imsevturnvlegnmszuyx.supabase.co",
  "YOUR_ANON_KEY"
)

// USER LOOKUP
export const getUserByUsername = async (username) => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single()

  return data
}

// FRIEND REQUEST
export const sendFriendRequest = async (username) => {
  const friend = await getUserByUsername(username)
  if (!friend) return

  const user = await supabase.auth.getUser()

  return supabase.from("friend_requests").insert({
    sender_id: user.data.user.id,
    receiver_id: friend.id,
    status: "pending"
  })
}

// SEND ALBUM
export const sendAlbumToFriend = async (friend_id, album) => {
  const user = await supabase.auth.getUser()

  return supabase.from("shared_albums").insert({
    sender_id: user.data.user.id,
    receiver_id: friend_id,
    title: album.title,
    artist: album.artist,
    image_url: album.image
  })
}

// SUGGESTIONS (simple version)
export const getSuggestedFriends = async () => {
  const { data } = await supabase.from("profiles").select("*")
  return (data || []).map(u => ({
    id: u.id,
    mutualCount: Math.floor(Math.random()*5)
  }))
}

// INBOX
export const getSharedAlbums = async () => {
  const user = await supabase.auth.getUser()

  const { data } = await supabase
    .from("shared_albums")
    .select("*")
    .eq("receiver_id", user.data.user.id)

  return data || []
}

// FRIENDS
export const getFriends = async () => {
  const user = await supabase.auth.getUser()

  const { data } = await supabase
    .from("friends")
    .select("*")
    .or(`user_id.eq.${user.data.user.id},friend_id.eq.${user.data.user.id}`)

  return data || []
}
