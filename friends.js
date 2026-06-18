import { supabase } from "./supabase.js"

export async function findUser(email){
  const { data }=await supabase
    .from("profiles")
    .select("*")
    .eq("email",email)
    .single()

  return data
}

export async function sendFriendRequest(email){

  const friend=await findUser(email)
  if(!friend) return

  const { data:user }=await supabase.auth.getUser()

  await supabase.from("friend_requests").insert({
    sender_id:user.user.id,
    receiver_id:friend.id
  })
}

export async function loadFriendRequests(){

  const { data:user }=await supabase.auth.getUser()

  const { data }=await supabase
    .from("friend_requests")
    .select("*")
    .eq("receiver_id",user.user.id)

  return data||[]
}

export async function acceptRequest(id,sender){

  const { data:user }=await supabase.auth.getUser()

  await supabase.from("friend_requests")
    .update({status:"accepted"})
    .eq("id",id)

  await supabase.from("friends").insert([
    {user_id:user.user.id,friend_id:sender},
    {user_id:sender,friend_id:user.user.id}
  ])
}

export async function loadFriends(){

  const { data:user }=await supabase.auth.getUser()

  const { data }=await supabase
    .from("friends")
    .select("*")
    .or(`user_id.eq.${user.user.id},friend_id.eq.${user.user.id}`)

  return data||[]
}
