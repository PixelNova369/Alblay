console.log("APP LOADED SUCCESSFULLY")

// --------------------
// ALBUM DATA
// --------------------
const albums = [
  {
    title: "Abbey Road",
    artist: "The Beatles",
    image: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg"
  },
  {
    title: "Rumours",
    artist: "Fleetwood Mac",
    image: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG"
  },
  {
    title: "Dark Side of the Moon",
    artist: "Pink Floyd",
    image: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png"
  }
]

let currentFriend = null

// --------------------
// HELPERS
// --------------------
const $ = (id) => document.getElementById(id)

// --------------------
// PAGE SWITCH
// --------------------
function show(page){

  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active")
  })

  $(page + "Page").classList.add("active")
}

// --------------------
// ALBUM GENERATOR
// --------------------
function renderAlbum(){

  const a = albums[Math.floor(Math.random() * albums.length)]

  $("albumCover").style.backgroundImage = `url(${a.image})`
  $("title").textContent = a.title
  $("meta").textContent = a.artist
}

// --------------------
// FRIENDS (STATIC TEST FIRST)
// --------------------
function loadFriends(){

  const friends = ["Ethan", "Emma", "Ciaran"]

  const box = $("friendsList")
  box.innerHTML = ""

  friends.forEach(name=>{

    const row = document.createElement("div")
    row.className = "friendRow"

    row.innerHTML = `
      <span>${name}</span>
      <button>Message</button>
    `

    row.querySelector("button").onclick = ()=>{
      openChat(name)
    }

    box.appendChild(row)
  })
}

// --------------------
// CHAT
// --------------------
function openChat(name){

  currentFriend = name

  $("friendsPage").classList.remove("active")
  $("chatPage").style.display = "flex"

  $("chatTitle").textContent = "Chat with " + name

  $("messages").innerHTML = ""
}

// --------------------
// SEND MESSAGE
// --------------------
function sendMessage(){

  const input = $("msgInput")

  if(!input.value) return

  const div = document.createElement("div")
  div.className = "msg"
  div.textContent = input.value

  $("messages").appendChild(div)

  input.value = ""
}

// --------------------
// INIT
// --------------------
window.addEventListener("DOMContentLoaded", ()=>{

  console.log("DOM READY")

  $("homeBtn").onclick = ()=>show("home")
  $("friendsBtn").onclick = ()=>show("friends")

  $("generateBtn").onclick = renderAlbum
  $("sendBtn").onclick = sendMessage

  renderAlbum()
  loadFriends()
})
