import { supabase } from "./supabase.js"

// ==========================
// FIND USER BY EMAIL
// ==========================
export async function findUserByEmail(email) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single()

  return data
}

// ==========================
// SEND FRIEND REQUEST
// ==========================
export async function sendFriendRequest(email) {
  const friend = await findUserByEmail(email)
  if (!friend) {
    alert("User not found")
    return
  }

  const { data: userData } = await supabase.auth.getUser()

  return supabase.from("friend_requests").insert({
    sender_id: userData.user.id,
    receiver_id: friend.id,
    status: "pending"
  })
}

// ==========================
// LOAD REQUESTS
// ==========================
export async function loadFriendRequests() {
  const { data: userData } = await supabase.auth.getUser()

  const { data } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("receiver_id", userData.user.id)

  return data || []
}

// ==========================
// ACCEPT REQUEST
// ==========================
export async function acceptRequest(requestId, senderId) {
  const { data: userData } = await supabase.auth.getUser()

  await supabase.from("friend_requests")
    .update({ status: "accepted" })
    .eq("id", requestId)

  // create mutual friendship
  await supabase.from("friends").insert([
    { user_id: userData.user.id, friend_id: senderId },
    { user_id: senderId, friend_id: userData.user.id }
  ])
}

// ==========================
// LOAD FRIENDS
// ==========================
export async function loadFriends() {
  const { data: userData } = await supabase.auth.getUser()

  const { data } = await supabase
    .from("friends")
    .select("*")
    .or(`user_id.eq.${userData.user.id},friend_id.eq.${userData.user.id}`)

  return data || []
}
