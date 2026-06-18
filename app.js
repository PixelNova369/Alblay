import { supabase, getUser, getProfile } from "./supabase.js"

console.log("APP START")

let currentChat = null

// --------------------
// HOME ALBUMS
// --------------------
const albums = [
  { title:"Abbey Road", artist:"Beatles", image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title:"Rumours", artist:"Fleetwood Mac", image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" }
]

function renderAlbum(){
  const i = Math.floor(Math.random()*albums.length)
  const a = albums[i]

  document.getElementById("albumCover").style.backgroundImage = `url(${a.image})`
  document.getElementById("title").textContent = a.title
  document.getElementById("meta").textContent = a.artist
}

// --------------------
// PAGE SWITCH
// --------------------
function show(page){

  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))

  document.getElementById("chatPage").style.display = "none"

  document.getElementById(page+"Page").classList.add("active")
}

// --------------------
// FRIENDS LOAD (FIXED)
// --------------------
async function loadFriends(){

  const user = await getUser()
  if(!user){
    document.getElementById("friendsList").innerHTML =
      "<p>Please log in to see friends</p>"
    return
  }

  const { data } = await supabase
    .from("friends")
    .select("*")

  const list = document.getElementById("friendsList")
  list.innerHTML = ""

  for(const f of data){

    const otherId = f.user_id === user.id ? f.friend_id : f.user_id
    const profile = await getProfile(otherId)

    const row = document.createElement("div")
    row.className = "friendRow"

    row.innerHTML = `
      <span>${profile?.username || "User"}</span>
      <button>Message</button>
    `

    row.querySelector("button").onclick = ()=>{
      openChat(otherId, profile)
    }

    list.appendChild(row)
  }
}

// --------------------
// CHAT FIXED
// --------------------
async function openChat(id, profile){

  currentChat = id

  document.getElementById("chatTitle").textContent =
    profile?.username || "Chat"

  document.getElementById("friendsPage").classList.remove("active")
  document.getElementById("chatPage").style.display = "flex"

  loadMessages()
}

// --------------------
// MESSAGES (SAFE)
// --------------------
async function loadMessages(){

  const user = await getUser()

  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at",{ascending:true})

  const box = document.getElementById("messages")
  box.innerHTML = ""

  data.forEach(m=>{
    const div = document.createElement("div")
    div.className = "msg " + (m.sender_id === user.id ? "me" : "them")
    div.textContent = m.message_text
    box.appendChild(div)
  })
}

// --------------------
// SEND MESSAGE
// --------------------
async function send(){

  const user = await getUser()

  const input = document.getElementById("msgInput")

  await supabase.from("messages").insert({
    chat_id: currentChat,
    sender_id: user.id,
    message_text: input.value
  })

  input.value = ""
  loadMessages()
}

// --------------------
// INIT (CRITICAL FIX)
// --------------------
window.addEventListener("DOMContentLoaded", async ()=>{

  const user = await getUser()

  if(!user){
    alert("Please log in first (Supabase auth required)")
  }

  document.getElementById("homeBtn").onclick=()=>show("home")
  document.getElementById("friendsBtn").onclick=()=>show("friends")

  document.getElementById("generateBtn").onclick=renderAlbum
  document.getElementById("sendBtn").onclick=send

  renderAlbum()
  loadFriends()
})
