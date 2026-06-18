import { supabase } from "./supabase.js"
import {
  sendFriendRequest,
  loadFriends,
  loadFriendRequests,
  acceptRequest
} from "./friends.js"

console.log("APP START")

// =====================
// ALBUM DATA
// =====================
const albums = [
  { title:"Abbey Road", artist:"The Beatles", image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title:"Rumours", artist:"Fleetwood Mac", image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" },
  { title:"Dark Side", artist:"Pink Floyd", image:"https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" }
]

let index = 0
let current = albums[0]

// =====================
// RENDER HOME (NOW PLAYING FIXED)
// =====================
function render(i){
  current = albums[i]

  document.getElementById("albumCover").style.backgroundImage =
    `url(${current.image})`

  document.getElementById("title").textContent = current.title
  document.getElementById("meta").textContent = current.artist
}

// =====================
// NAV FIX
// =====================
function show(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
  document.getElementById(page+"Page").classList.add("active")
}

// =====================
// FRIENDS RENDER
// =====================
async function renderFriends(){

  const box = document.getElementById("friendsList")
  box.innerHTML = ""

  const friends = await loadFriends()

  friends.forEach(f=>{
    const div = document.createElement("div")

    div.className = "friendRow"

    div.innerHTML = `
      <span>${f.friend_id}</span>
      <button onclick="openChat('${f.friend_id}')">Message</button>
    `

    box.appendChild(div)
  })
}

// =====================
// INBOX (NOW INSIDE FRIENDS PAGE)
// =====================
async function loadInbox(){

  const data = await loadFriendRequests()
  const box = document.getElementById("inboxBox")

  box.innerHTML = ""

  data.forEach(r=>{
    const div = document.createElement("div")

    div.className = "friendRow"

    div.innerHTML = `
      <span>${r.sender_id}</span>
      <button onclick="acceptRequest('${r.id}','${r.sender_id}')">Accept</button>
    `

    box.appendChild(div)
  })
}

// =====================
// INIT
// =====================
window.addEventListener("DOMContentLoaded", ()=>{

  // NAV
  document.getElementById("homeBtn").onclick = ()=>show("home")

  document.getElementById("friendsBtn").onclick = async ()=>{
    show("friends")
    await renderFriends()
    await loadInbox()
  }

  document.getElementById("profileBtn").onclick = ()=>show("profile")

  // HOME CONTROLS
  document.getElementById("generateBtn").onclick = ()=>{
    index = Math.floor(Math.random()*albums.length)
    render(index)
  }

  document.getElementById("nextBtn").onclick = ()=>{
    index = (index+1)%albums.length
    render(index)
  }

  document.getElementById("prevBtn").onclick = ()=>{
    index = (index-1+albums.length)%albums.length
    render(index)
  }

  // FRIEND REQUEST
  document.getElementById("sendRequestBtn").onclick = async ()=>{
    const email = document.getElementById("friendEmail").value
    await sendFriendRequest(email)
  }

  render(0)
})
