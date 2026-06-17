import { supabase } from './supabase.js'

// =====================
// SEND FRIEND REQUEST
// =====================
export async function sendFriendRequest(receiver_id) {

  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData?.session?.user

  if (!user) {
    alert("Not logged in")
    return
  }

  const { error } = await supabase
    .from("friend_requests")
    .insert({
      sender_id: user.id,
      receiver_id,
      status: "pending"
    })

  if (error) {
    console.error(error)
    alert("Failed to send request")
  } else {
    alert("Friend request sent")
  }
}

// =====================
// LOAD FRIEND REQUESTS
// =====================
export async function loadFriendRequests() {

  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData?.session?.user

  if (!user) return

  const { data, error } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("receiver_id", user.id)
    .eq("status", "pending")

  if (error) {
    console.error(error)
    return
  }

  const container = document.getElementById("friendRequests")
  if (!container) return

  container.innerHTML = ""

  data.forEach(req => {

    const card = document.createElement("div")

    card.style.background = "#111"
    card.style.padding = "10px"
    card.style.margin = "8px 0"
    card.style.borderRadius = "8px"

    card.innerHTML = `
      <p style="font-size:12px;">From: ${req.sender_id}</p>
      <button id="accept-${req.id}">Accept</button>
    `

    container.appendChild(card)

    document.getElementById(`accept-${req.id}`).onclick = async () => {

      await supabase
        .from("friend_requests")
        .update({ status: "accepted" })
        .eq("id", req.id)

      await createFriend(req.sender_id)

      loadFriendRequests()
      loadFriends()
    }
  })
}

// =====================
// CREATE FRIEND CONNECTION
// =====================
export async function createFriend(friend_id) {

  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData?.session?.user

  if (!user) return

  await supabase.from("friends").insert({
    user_id: user.id,
    friend_id
  })
}

// =====================
// LOAD FRIEND LIST
// =====================
export async function loadFriends() {

  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData?.session?.user

  if (!user) return

  const { data, error } = await supabase
    .from("friends")
    .select("*")
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

  if (error) {
    console.error(error)
    return
  }

  const container = document.getElementById("friendsList")
  if (!container) return

  container.innerHTML = ""

  data.forEach(f => {

    const friendId =
      f.user_id === user.id ? f.friend_id : f.user_id

    const card = document.createElement("div")

    card.style.background = "#222"
    card.style.padding = "10px"
    card.style.margin = "8px 0"
    card.style.borderRadius = "8px"

    card.innerHTML = `
      <p style="font-size:12px;">Friend: ${friendId}</p>
    `

    container.appendChild(card)
  })
}
