console.log("🔥 JS IS LOADING CORRECTLY")
alert("JS LOADED")
console.log("🔥 APP JS RUNNING")

// =====================
// SAFE STATE (NO SUPABASE DEPENDENCY)
// =====================
let currentChat = null

// =====================
// ALBUM DATA (STATIC = ALWAYS WORKS)
// =====================
const albums = [
  { title:"Abbey Road", artist:"Beatles", image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title:"Rumours", artist:"Fleetwood Mac", image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" },
  { title:"Dark Side", artist:"Pink Floyd", image:"https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" }
]

// =====================
// RENDER HOME
// =====================
function renderAlbum(){
  const a = albums[Math.floor(Math.random()*albums.length)]

  document.getElementById("albumCover").style.backgroundImage =
    `url(${a.image})`

  document.getElementById("title").textContent = a.title
  document.getElementById("meta").textContent = a.artist
}

// =====================
// PAGE SWITCHING (FIXED)
// =====================
function show(page){

  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))

  document.getElementById("chatPage").style.display = "none"

  document.getElementById(page+"Page").classList.add("active")
}

// =====================
// FRIENDS (ALWAYS SHOWS)
// =====================
function loadFriends(){

  const friends = [
    { name:"Ethan", id:"1" },
    { name:"Emma", id:"2" },
    { name:"Ciaran", id:"3" }
  ]

  const box = document.getElementById("friendsList")
  box.innerHTML = ""

  friends.forEach(f=>{

    const row = document.createElement("div")
    row.className = "friendRow"

    row.innerHTML = `
      <span>${f.name}</span>
      <button>Message</button>
    `

    row.querySelector("button").onclick = ()=>{
      openChat(f)
    }

    box.appendChild(row)
  })
}

// =====================
// CHAT (SIMPLE WORKING)
// =====================
function openChat(friend){

  currentChat = friend

  document.getElementById("friendsPage").classList.remove("active")
  document.getElementById("chatPage").style.display = "flex"

  document.getElementById("chatTitle").textContent =
    "Chat with " + friend.name

  document.getElementById("messages").innerHTML = ""
}

function sendMessage(){

  const input = document.getElementById("msgInput")

  if(!input.value) return

  const div = document.createElement("div")
  div.className = "msg me"
  div.textContent = input.value

  document.getElementById("messages").appendChild(div)

  input.value = ""
}

// =====================
// INIT (GUARANTEED RUN)
// =====================
window.addEventListener("DOMContentLoaded", ()=>{

  console.log("🔥 DOM READY")

  document.getElementById("homeBtn").onclick = ()=>show("home")
  document.getElementById("friendsBtn").onclick = ()=>show("friends")

  document.getElementById("generateBtn").onclick = renderAlbum
  document.getElementById("sendBtn").onclick = sendMessage

  renderAlbum()
  loadFriends()
})
