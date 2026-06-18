import { supabase } from "./supabase.js"
import {
  sendFriendRequest,
  loadFriendRequests,
  loadFriends,
  acceptRequest
} from "./friends.js"

console.log("APP START")

// ==========================
// ALBUM SYSTEM
// ==========================
const albums = [
  { title:"Abbey Road", artist:"The Beatles", image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title:"Rumours", artist:"Fleetwood Mac", image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" },
  { title:"Dark Side of the Moon", artist:"Pink Floyd", image:"https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" }
]

let index = 0
let current = albums[0]

function renderAlbum(i){
  current = albums[i]

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")

  if (!cover) return

  cover.style.opacity = 0

  setTimeout(() => {
    cover.style.backgroundImage = `url(${current.image})`
    title.textContent = current.title
    meta.textContent = current.artist
    cover.style.opacity = 1
  }, 150)
}

// ==========================
// PAGE NAV
// ==========================
function showPage(page){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"))
  document.getElementById(page + "Page").classList.add("active")
}

// ==========================
// FRIENDS UI
// ==========================
async function renderFriends() {
  const list = document.getElementById("friendsList")
  const requests = document.getElementById("friendRequests")

  if (!list || !requests) return

  list.innerHTML = ""
  requests.innerHTML = ""

  const friends = await loadFriends()
  const friendRequests = await loadFriendRequests()

  // FRIENDS
  friends.forEach(f => {
    const div = document.createElement("div")

    div.innerHTML = `
      <div style="margin:10px 0;padding:10px;background:rgba(255,255,255,0.05);border-radius:10px;">
        Friend ID: ${f.friend_id}
        <button onclick="alert('Open chat coming next step')">Message</button>
        <button onclick="alert('Send album coming next step')">Send Album</button>
      </div>
    `

    list.appendChild(div)
  })

  // REQUESTS
  friendRequests.forEach(r => {
    const div = document.createElement("div")

    div.innerHTML = `
      <div style="margin:10px 0;padding:10px;background:rgba(255,255,255,0.05);border-radius:10px;">
        Request from: ${r.sender_id}
        <button onclick="accept(${r.id}, '${r.sender_id}')">Accept</button>
      </div>
    `

    requests.appendChild(div)
  })
}

// expose for inline button
window.accept = acceptRequest

// ==========================
// INIT
// ==========================
window.addEventListener("DOMContentLoaded", async () => {

  // NAV
  document.getElementById("homeBtn").onclick = () => showPage("home")
  document.getElementById("friendsBtn").onclick = async () => {
    showPage("friends")
    await renderFriends()
  }
  document.getElementById("profileBtn").onclick = () => showPage("profile")

  // ALBUM
  document.getElementById("generateBtn").onclick = () => {
    index = Math.floor(Math.random() * albums.length)
    renderAlbum(index)
  }

  // FRIEND REQUEST
  document.getElementById("sendRequestBtn").onclick = async () => {
    const email = document.getElementById("friendEmail").value
    await sendFriendRequest(email)
    alert("Request sent")
  }

  renderAlbum(0)
})
