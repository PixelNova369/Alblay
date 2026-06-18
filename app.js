import { supabase } from "./supabase.js"
import { sendFriendRequest, loadFriends, loadFriendRequests, acceptRequest } from "./friends.js"

console.log("APP START")

// ================= ALBUM =================
const albums = [
  { title:"Abbey Road", artist:"Beatles", image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title:"Rumours", artist:"Fleetwood Mac", image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" }
]

let index=0
let current=albums[0]
let activeChat=null

function render(i){
  current=albums[i]

  document.getElementById("albumCover").style.backgroundImage =
    `url(${current.image})`

  document.getElementById("title").textContent=current.title
  document.getElementById("meta").textContent=current.artist
}

// ================= DRAWER =================
window.toggleDrawer = ()=>{
  const d=document.getElementById("drawer")
  d.style.right = d.style.right==="0px" ? "-300px" : "0px"
}

// ================= CHAT ID =================
function chatId(a,b){
  return [a,b].sort().join("_")
}

// ================= OPEN CHAT =================
window.openChat = async (friendId)=>{

  const { data:user } = await supabase.auth.getUser()

  activeChat = chatId(user.user.id, friendId)

  show("chat")
  loadMessages()
  subscribeLive()
}

// ================= LIVE MESSAGES =================
let channel=null

function subscribeLive(){

  if(channel) supabase.removeChannel(channel)

  channel = supabase
    .channel("chat")
    .on("postgres_changes",
      { event:"INSERT", table:"messages" },
      ()=>loadMessages()
    )
    .subscribe()
}

// ================= LOAD MESSAGES =================
async function loadMessages(){

  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", activeChat)
    .order("created_at")

  const box=document.getElementById("chatBox")
  box.innerHTML=""

  data.forEach(m=>{
    const div=document.createElement("div")

    div.innerHTML=`
      <p>${m.message_text||""}</p>

      ${m.album_title?`
        <div style="background:#222;padding:8px;border-radius:10px;">
          🎧 ${m.album_title}
        </div>`:""}
    `

    box.appendChild(div)
  })
}

// ================= SEND MSG =================
document.getElementById("sendMsg").onclick=async()=>{

  const { data:user }=await supabase.auth.getUser()

  await supabase.from("messages").insert({
    chat_id:activeChat,
    sender_id:user.user.id,
    message_text:document.getElementById("msgInput").value
  })

  document.getElementById("msgInput").value=""
}

// ================= SEND ALBUM =================
document.getElementById("sendAlbum").onclick=async()=>{

  const { data:user }=await supabase.auth.getUser()

  await supabase.from("messages").insert({
    chat_id:activeChat,
    sender_id:user.user.id,
    album_title:current.title,
    album_artist:current.artist,
    album_cover:current.image
  })
}

// ================= FRIENDS =================
async function renderFriends(){

  const box=document.getElementById("friendsList")
  box.innerHTML=""

  const friends=await loadFriends()

  friends.forEach(f=>{
    const div=document.createElement("div")

    div.innerHTML=`
      <div style="margin:10px;padding:10px;background:#111;border-radius:10px;">
        ${f.friend_id}
        <button onclick="openChat('${f.friend_id}')">Message</button>
      </div>
    `

    box.appendChild(div)
  })
}

// ================= INBOX =================
document.getElementById("inboxBtn").onclick=async()=>{

  const box=document.getElementById("inbox")

  box.style.display = box.style.display==="block"?"none":"block"

  const req=await loadFriendRequests()

  box.innerHTML=req.map(r=>`
    <div>
      ${r.sender_id}
      <button onclick="accept(${r.id},'${r.sender_id}')">✔</button>
    </div>
  `).join("")
}

// ================= NAV =================
function show(p){
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"))
  document.getElementById(p+"Page").classList.add("active")
}

document.getElementById("homeBtn").onclick=()=>show("home")
document.getElementById("friendsBtn").onclick=async()=>{
  show("friends")
  await renderFriends()
}
document.getElementById("profileBtn").onclick=()=>show("profile")

// ================= ALBUM CONTROLS =================
document.getElementById("generateBtn").onclick=()=>{
  index=Math.floor(Math.random()*albums.length)
  render(index)
}

document.getElementById("nextBtn").onclick=()=>{
  index=(index+1)%albums.length
  render(index)
}

document.getElementById("prevBtn").onclick=()=>{
  index=(index-1+albums.length)%albums.length
  render(index)
}

render(0)
