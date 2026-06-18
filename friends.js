import { supabase } from "./supabase.js"

// FIND USER
export async function findUserByEmail(email){
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single()

  return data
}

// FRIEND REQUEST
export async function sendFriendRequest(email){

  const friend = await findUserByEmail(email)
  if(!friend) return alert("User not found")

  const { data:user } = await supabase.auth.getUser()

  return supabase.from("friend_requests").insert({
    sender_id: user.user.id,
    receiver_id: friend.id
  })
}

// LOAD REQUESTS
export async function loadFriendRequests(){

  const { data:user } = await supabase.auth.getUser()

  const { data } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("receiver_id", user.user.id)

  return data || []
}

// ACCEPT REQUEST
export async function acceptRequest(id, senderId){

  const { data:user } = await supabase.auth.getUser()

  await supabase.from("friend_requests")
    .update({ status:"accepted" })
    .eq("id", id)

  await supabase.from("friends").insert([
    { user_id:user.user.id, friend_id:senderId },
    { user_id:senderId, friend_id:user.user.id }
  ])
}

// LOAD FRIENDS
export async function loadFriends(){

  const { data:user } = await supabase.auth.getUser()

  const { data } = await supabase
    .from("friends")
    .select("*")
    .or(`user_id.eq.${user.user.id},friend_id.eq.${user.user.id}`)

  return data || []
}
