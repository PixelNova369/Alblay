import { supabase } from "./supabase.js"

// =====================
// FRIEND REQUESTS
// =====================
export const sendFriendRequest = async (receiver_id) => {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user
  if (!user) return

  return await supabase.from("friend_requests").insert({
    sender_id: user.id,
    receiver_id,
    status: "pending"
  })
}

export const loadFriendRequests = async () => {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user
  if (!user) return

  const { data } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("receiver_id", user.id)
    .eq("status", "pending")

  const container = document.getElementById("friendRequests")
  if (!container) return

  container.innerHTML = ""

  data?.forEach(req => {
    const div = document.createElement("div")
    div.style.padding = "10px"
    div.style.margin = "5px"
    div.style.background = "#222"
    div.innerHTML = `
      <p>Request from: ${req.sender_id}</p>
      <button data-id="${req.id}">Accept</button>
    `

    div.querySelector("button").onclick = async () => {
      await supabase
        .from("friend_requests")
        .update({ status: "accepted" })
        .eq("id", req.id)

      loadFriendRequests()
      loadFriends()
    }

    container.appendChild(div)
  })
}

// =====================
// FRIEND LIST
// =====================
export const loadFriends = async () => {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user
  if (!user) return

  const { data } = await supabase
    .from("friends")
    .select("*")
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

  const container = document.getElementById("friendsList")
  if (!container) return

  container.innerHTML = ""

  data?.forEach(f => {
    const other = f.user_id === user.id ? f.friend_id : f.user_id

    const div = document.createElement("div")
    div.style.padding = "10px"
    div.style.margin = "5px"
    div.style.background = "#222"
    div.innerHTML = `Friend: ${other}`

    container.appendChild(div)
  })
}

// =====================
// ALBUM SHARING (REAL)
// =====================
export const sendAlbumToFriend = async (friend_id, album) => {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user
  if (!user) return

  return await supabase.from("shared_albums").insert({
    sender_id: user.id,
    receiver_id: friend_id,
    title: album.title,
    artist: album.artist,
    image_url: album.image_url || album.image,
    spotify_url: album.spotify_url || ""
  })
}

// =====================
// INBOX SYSTEM
// =====================
export const loadInbox = async () => {
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user
  if (!user) return

  const { data } = await supabase
    .from("shared_albums")
    .select("*")
    .eq("receiver_id", user.id)
    .order("created_at", { ascending: false })

  const container = document.getElementById("friendRequests")
  if (!container) return

  // append inbox section visually separated
  const inboxTitle = document.createElement("h4")
  inboxTitle.innerText = "Inbox"
  container.appendChild(inboxTitle)

  data?.forEach(album => {
    const div = document.createElement("div")
    div.style.padding = "10px"
    div.style.margin = "5px"
    div.style.background = "#333"

    div.innerHTML = `
      <strong>${album.title}</strong><br/>
      ${album.artist}
    `

    container.appendChild(div)
  })
}
