console.log("APP START")

import {
  sendFriendRequest,
  getUserByUsername,
  sendAlbumToFriend,
  getSuggestedFriends,
  getSharedAlbums,
  getFriends
} from "./friends.js"

const albums = [
  { title:"Abbey Road", artist:"The Beatles", image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title:"Rumours", artist:"Fleetwood Mac", image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" },
  { title:"Dark Side", artist:"Pink Floyd", image:"https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" }
]

let index = 0
let current = albums[0]

function render(i){
  current = albums[i]

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")

  cover.style.opacity = 0
  cover.style.transform = "scale(0.95)"

  setTimeout(()=>{
    cover.style.backgroundImage = `url(${current.image})`
    title.textContent = current.title
    meta.textContent = current.artist

    cover.style.opacity = 1
    cover.style.transform = "scale(1)"
  },200)
}

window.addEventListener("DOMContentLoaded", async () => {

  const $ = (id)=>document.getElementById(id)

  // NAV
  function show(page){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
    $(page+"Page").classList.add("active")
  }

  $("homeBtn").onclick = ()=>show("home")
  $("friendsBtn").onclick = ()=>show("friends")
  $("profileBtn").onclick = ()=>show("profile")

  // DRAWER
  $("drawerBtn").onclick = ()=>$("#drawer").classList.add("open")
  $("closeDrawer").onclick = ()=>$("#drawer").classList.remove("open")

  // ALBUM CONTROLS
  $("nextBtn").onclick = ()=>{index=(index+1)%albums.length;render(index)}
  $("prevBtn").onclick = ()=>{index=(index-1+albums.length)%albums.length;render(index)}
  $("generateBtn").onclick = ()=>{index=Math.floor(Math.random()*albums.length);render(index)}

  $("playBtn").onclick = ()=>{
    window.open(`https://open.spotify.com/search/${current.title+" "+current.artist}`)
  }

  // FRIEND REQUEST
  $("sendFriendBtn").onclick = async ()=>{
    const username = $("friendUsernameInput").value
    await sendFriendRequest(username)
    $("friendUsernameInput").value=""
  }

  // SEND ALBUM
  $("sendAlbumBtn").onclick = async ()=>{
    const username = $("shareUsername").value
    const friend = await getUserByUsername(username)

    if(!friend) return alert("User not found")

    await sendAlbumToFriend(friend.id, current)
    alert("Sent!")
  }

  // SUGGESTIONS
  async function loadSuggestions(){
    const box = $("suggestedFriends")
    const data = await getSuggestedFriends()

    box.innerHTML=""

    data.forEach(u=>{
      const div=document.createElement("div")
      div.className="card"
      div.innerHTML=`<b>${u.id}</b><br/><small>${u.mutualCount} mutual</small>`
      box.appendChild(div)
    })
  }

  // INBOX
  async function loadInbox(){
    const box = $("inbox")
    const data = await getSharedAlbums()

    box.innerHTML=""

    data.forEach(a=>{
      const div=document.createElement("div")
      div.className="card"
      div.innerHTML=`<b>${a.title}</b><br/>${a.artist}`
      box.appendChild(div)
    })
  }

  await loadSuggestions()
  await loadInbox()

  render(0)
})
