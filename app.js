import { supabase } from "./supabase.js"

console.log("APP START")

let currentChat = null

// --------------------
// ALBUMS
// --------------------
const albums = [
  { title:"Abbey Road", artist:"Beatles", image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title:"Rumours", artist:"Fleetwood Mac", image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" }
]

function renderAlbum(){
  const a = albums[Math.floor(Math.random()*albums.length)]

  document.getElementById("albumCover").style.backgroundImage =
    `url(${a.image})`

  document.getElementById("title").textContent = a.title
  document.getElementById("meta").textContent = a.artist
}

// --------------------
// NAV SAFE SWITCH
// --------------------
function show(page){

  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))

  document.getElementById("chatPage").style.display = "none"

  document.getElementById(page+"Page").classList.add("active")
}

// --------------------
// FRIENDS (SAFE FALLBACK)
// --------------------
async function loadFriends(){

  const { data } = await supabase.from("friends").select("*")

  const box = document.getElementById("friendsList")
  box.innerHTML = ""

  if(!data || data.length === 0){
    box.innerHTML = "<p>No friends yet</p>"
    return
  }

  data.forEach(f=>{

    const row = document.createElement("div")
    row.className = "friendRow"

    row.innerHTML = `
      <span>User ${f.friend_id.slice(0,6)}</span>
      <button>Message</button>
    `

    row.querySelector("button").onclick = ()=>{
      openChat(f.friend_id)
    }

    box.appendChild(row)
  })
}

// --------------------
// CHAT (MINIMAL BUT WORKING)
// --------------------
async function openChat(friendId){

  currentChat = friendId

  document.getElementById("friendsPage").classList.remove("active")
  document.getElementById("chatPage").style.display = "flex"

  document.getElementById("chatTitle").textContent =
    "Chat " + friendId.slice(0,6)

  loadMessages()
}

// --------------------
// MESSAGES (FIXED SAFE)
// --------------------
async function loadMessages(){

  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at",{ascending:true})

  const box = document.getElementById("messages")
  box.innerHTML = ""

  if(!data) return

  data.forEach(m=>{
    const div = document.createElement("div")
    div.className = "msg them"
    div.textContent = m.message_text
    box.appendChild(div)
  })
}

// --------------------
// SEND MESSAGE (SAFE)
// --------------------
async function send(){

  const input = document.getElementById("msgInput")
  if(!input.value || !currentChat) return

  await supabase.from("messages").insert({
    chat_id: currentChat,
    sender_id: "temp",
    message_text: input.value
  })

  input.value = ""
  loadMessages()
}

// --------------------
// INIT (ONE ENTRY POINT FIX)
// --------------------
window.addEventListener("DOMContentLoaded", ()=>{

  document.getElementById("homeBtn").onclick=()=>show("home")
  document.getElementById("friendsBtn").onclick=()=>show("friends")

  document.getElementById("generateBtn").onclick=renderAlbum
  document.getElementById("sendBtn").onclick=send

  renderAlbum()
  loadFriends()
})
