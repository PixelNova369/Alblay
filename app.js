import { supabase } from "./supabase.js"

console.log("APP START")

let currentChat = null

// --------------------
// AUTH CHECK
// --------------------
async function checkAuth(){

  const { data } = await supabase.auth.getSession()

  if(!data.session){
    document.getElementById("authGate").style.display = "flex"
    return false
  }

  document.getElementById("authGate").style.display = "none"
  return true
}

// --------------------
// LOGIN
// --------------------
async function setupAuth(){

  document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const { error } = await supabase.auth.signInWithPassword({
      email, password
    })

    if(error) return alert(error.message)

    location.reload()
  }

  document.getElementById("signupBtn").onclick = async () => {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const { error } = await supabase.auth.signUp({
      email, password
    })

    if(error) return alert(error.message)

    alert("Check email to confirm account")
  }
}

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
// NAV
// --------------------
function show(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
  document.getElementById("chatPage").style.display = "none"
  document.getElementById(page+"Page").classList.add("active")
}

// --------------------
// FRIENDS UI (REAL FIX)
// --------------------
async function loadFriends(){

  const { data } = await supabase.from("friends").select("*")

  const box = document.getElementById("friendsList")
  box.innerHTML = ""

  if(!data?.length){
    box.innerHTML = "No friends yet"
    return
  }

  data.forEach(f=>{

    const row = document.createElement("div")
    row.className = "row"

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
// CHAT
// --------------------
async function openChat(id){

  currentChat = id

  document.getElementById("friendsPage").classList.remove("active")
  document.getElementById("chatPage").style.display = "flex"

  document.getElementById("chatTitle").textContent =
    "Chat " + id.slice(0,6)

  loadMessages()
}

async function loadMessages(){

  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at",{ascending:true})

  const box = document.getElementById("messages")
  box.innerHTML = ""

  data?.forEach(m=>{
    const div = document.createElement("div")
    div.className = "msg them"
    div.textContent = m.message_text
    box.appendChild(div)
  })
}

async function send(){

  const input = document.getElementById("msgInput")

  await supabase.from("messages").insert({
    chat_id: currentChat,
    sender_id: "temp",
    message_text: input.value
  })

  input.value = ""
  loadMessages()
}

// --------------------
// INIT (ONE SAFE STARTUP)
// --------------------
window.addEventListener("DOMContentLoaded", async ()=>{

  await setupAuth()

  const ok = await checkAuth()
  if(!ok) return

  document.getElementById("homeBtn").onclick=()=>show("home")
  document.getElementById("friendsBtn").onclick=()=>show("friends")

  document.getElementById("generateBtn").onclick=renderAlbum
  document.getElementById("sendBtn").onclick=send

  renderAlbum()
  loadFriends()
})
