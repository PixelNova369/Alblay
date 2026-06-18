import { supabase } from "./supabase.js"
import {
  sendFriendRequest,
  loadFriendRequests,
  loadFriends,
  acceptRequest,
  sendAlbumToFriend
} from "./friends.js"

console.log("APP START")

// =====================
// ALBUMS
// =====================
const albums = [
  { title:"Abbey Road", artist:"The Beatles", image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title:"Rumours", artist:"Fleetwood Mac", image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" },
  { title:"Dark Side of the Moon", artist:"Pink Floyd", image:"https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" }
]

let index = 0
let current = albums[0]
let activeChatFriend = null

function renderAlbum(i){
  current = albums[i]

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")

  cover.style.backgroundImage = `url(${current.image})`
  title.textContent = current.title
  meta.textContent = current.artist
}

// =====================
// NAV
// =====================
function show(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
  document.getElementById(page+"Page").classList.add("active")
}

// =====================
// CHAT
// =====================
window.openChat = (friendId) => {
  activeChatFriend = friendId
  show("chat")
  loadMessages()
}

async function loadMessages(){

  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", activeChatFriend)
    .order("created_at")

  const box = document.getElementById("chatMessages")
  box.innerHTML = ""

  data.forEach(m=>{
    const div = document.createElement("div")

    div.innerHTML = `
      <p><b>${m.sender_id}</b>: ${m.message_text || ""}</p>

      ${m.album_title ? `
        <div style="padding:8px;background:#222;border-radius:10px;">
          🎧 ${m.album_title} - ${m.album_artist}
        </div>
      ` : ""}
    `

    box.appendChild(div)
  })
}

// =====================
// INIT
// =====================
window.addEventListener("DOMContentLoaded", async ()=>{

  // NAV
  document.getElementById("homeBtn").onclick = ()=>show("home")
  document.getElementById("friendsBtn").onclick = async ()=>{
    show("friends")
    await renderFriends()
  }
  document.getElementById("profileBtn").onclick = ()=>show("profile")

  // ALBUM
  document.getElementById("generateBtn").onclick = ()=>{
    index = Math.floor(Math.random()*albums.length)
    renderAlbum(index)
  }

  // FRIEND REQUEST
  document.getElementById("sendRequestBtn").onclick = async ()=>{
    const email = document.getElementById("friendEmail").value
    await sendFriendRequest(email)
  }

  // INBOX
  document.getElementById("inboxBtn").onclick = async ()=>{
    const data = await loadFriendRequests()
    document.getElementById("inboxBox").innerHTML =
      data.map(r=>`
        <div>
          ${r.sender_id}
          <button onclick="accept(${r.id}, '${r.sender_id}')">Accept</button>
        </div>
      `).join("")
  }

  // CHAT SEND MESSAGE
  document.getElementById("sendMsgBtn").onclick = async ()=>{

    const text = document.getElementById("chatInput").value
    const { data:user } = await supabase.auth.getUser()

    await supabase.from("messages").insert({
      chat_id: activeChatFriend,
      sender_id: user.user.id,
      message_text: text
    })

    document.getElementById("chatInput").value = ""
    loadMessages()
  }

  // SEND ALBUM
  document.getElementById("sendAlbumBtn").onclick = async ()=>{
    const { data:user } = await supabase.auth.getUser()

    await supabase.from("messages").insert({
      chat_id: activeChatFriend,
      sender_id: user.user.id,
      album_title: current.title,
      album_artist: current.artist,
      album_cover: current.image
    })

    loadMessages()
  }

  renderAlbum(0)
})

// =====================
// FRIENDS RENDER
// =====================
async function renderFriends(){

  const box = document.getElementById("friendsList")
  box.innerHTML = ""

  const friends = await loadFriends()

  friends.forEach(f=>{
    const div = document.createElement("div")

    div.innerHTML = `
      <div style="margin:10px 0;padding:10px;background:#111;border-radius:10px;">
        ${f.friend_id}
        <button onclick="openChat('${f.friend_id}')">Message</button>
      </div>
    `

    box.appendChild(div)
  })
}
