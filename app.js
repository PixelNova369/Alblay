import { supabase } from "./supabase.js"

console.log("APP START")

let currentChat = null

// ----------------------
// AUTH
// ----------------------
async function checkAuth(){

  const { data } = await supabase.auth.getSession()

  if(!data.session){
    document.getElementById("authGate").style.display = "flex"
    document.getElementById("homePage").style.display = "none"
    return false
  }

  document.getElementById("authGate").style.display = "none"
  document.getElementById("homePage").style.display = "block"
  return true
}

function setupAuth(){

  document.getElementById("loginBtn").onclick = async () => {

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if(error) return alert(error.message)

    location.reload()
  }

  document.getElementById("signupBtn").onclick = async () => {

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if(error) return alert(error.message)

    alert("Check email to confirm login")
  }
}

// ----------------------
// ALBUM SYSTEM (NOW PLAYING)
// ----------------------
const albums = [
  {
    title:"Abbey Road",
    artist:"The Beatles",
    image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg"
  },
  {
    title:"Rumours",
    artist:"Fleetwood Mac",
    image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG"
  },
  {
    title:"Dark Side of the Moon",
    artist:"Pink Floyd",
    image:"https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png"
  }
]

function renderAlbum(){

  const a = albums[Math.floor(Math.random()*albums.length)]

  document.getElementById("albumCover").style.backgroundImage =
    `url(${a.image})`

  document.getElementById("title").textContent = a.title
  document.getElementById("meta").textContent = a.artist
}

// ----------------------
// NAV
// ----------------------
function show(page){

  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))

  document.getElementById(page+"Page").classList.add("active")
}

// ----------------------
// FRIENDS
// ----------------------
async function loadFriends(){

  const { data } = await supabase.from("friends").select("*")

  const box = document.getElementById("friendsList")
  box.innerHTML = ""

  if(!data?.length){
    box.innerHTML = "No friends yet"
    return
  }

  data.forEach(f=>{

    const div = document.createElement("div")
    div.className = "friendRow"

    div.innerHTML = `
      <span>${f.friend_id.slice(0,6)}</span>
      <button>Message</button>
    `

    div.querySelector("button").onclick = ()=>{
      openChat(f.friend_id)
    }

    box.appendChild(div)
  })
}

// ----------------------
// CHAT
// ----------------------
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

async function sendMessage(){

  const input = document.getElementById("msgInput")

  await supabase.from("messages").insert({
    sender_id: "temp",
    receiver_id: currentChat,
    message_text: input.value
  })

  input.value = ""
  loadMessages()
}

// ----------------------
// INIT
// ----------------------
window.addEventListener("DOMContentLoaded", async ()=>{

  setupAuth()

  const ok = await checkAuth()
  if(!ok) return

  document.getElementById("homeBtn").onclick = ()=>show("home")
  document.getElementById("friendsBtn").onclick = ()=>show("friends")

  document.getElementById("generateBtn").onclick = renderAlbum
  document.getElementById("sendBtn").onclick = sendMessage

  renderAlbum()
  loadFriends()
})
