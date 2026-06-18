console.log("🔥 APP JS RUNNING")

function $(id){
  const el = document.getElementById(id)
  if(!el){
    console.warn("❌ Missing element:", id)
  }
  return el
}

// --------------------
// ALBUM TEST DATA
// --------------------
const albums = [
  { title:"Abbey Road", artist:"Beatles", image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title:"Rumours", artist:"Fleetwood Mac", image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" }
]

// --------------------
// RENDER HOME
// --------------------
function render(){
  const a = albums[Math.floor(Math.random()*albums.length)]

  const cover = $("albumCover")
  const title = $("title")
  const meta = $("meta")

  if(!cover || !title || !meta) return

  cover.style.backgroundImage = `url(${a.image})`
  title.textContent = a.title
  meta.textContent = a.artist
}

// --------------------
// FRIENDS MOCK (GUARANTEED VISUAL)
// --------------------
function loadFriends(){

  const box = $("friendsList")
  if(!box) return

  box.innerHTML = ""

  const friends = ["Ethan","Emma","Ciaran"]

  friends.forEach(name=>{
    const row = document.createElement("div")
    row.style.cssText = `
      display:flex;
      justify-content:space-between;
      padding:12px;
      margin:10px 0;
      background:#1a1a1a;
      border-radius:12px;
    `

    row.innerHTML = `
      <span>${name}</span>
      <button>Message</button>
    `

    box.appendChild(row)
  })
}

// --------------------
// PAGE SWITCH
// --------------------
function show(page){

  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active")
  })

  const target = $(page+"Page")
  if(target){
    target.classList.add("active")
  }

  const chat = $("chatPage")
  if(chat) chat.style.display = "none"
}

// --------------------
// CHAT TEST
// --------------------
function openChat(name){

  const chat = $("chatPage")
  const title = $("chatTitle")

  if(!chat || !title) return

  chat.style.display = "flex"
  title.textContent = "Chat with " + name
}

// --------------------
// INIT (FORCE SAFE)
// --------------------
window.addEventListener("DOMContentLoaded", ()=>{

  console.log("🔥 DOM READY")

  // NAV
  $("homeBtn")?.addEventListener("click", ()=>show("home"))
  $("friendsBtn")?.addEventListener("click", ()=>show("friends"))

  // HOME BUTTON
  $("generateBtn")?.addEventListener("click", render)

  // SEND BUTTON (if exists)
  $("sendBtn")?.addEventListener("click", ()=>{
    const input = $("msgInput")
    const box = $("messages")

    if(!input || !box) return

    const div = document.createElement("div")
    div.className = "msg me"
    div.textContent = input.value

    box.appendChild(div)
    input.value = ""
  })

  render()
  loadFriends()
})
