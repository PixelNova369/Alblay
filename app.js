import { supabase, getUser, getProfile, ensureProfile } from "./supabase.js"

console.log("APP START")

// =====================
// HOME ALBUMS
// =====================
const albums = [
  { title:"Abbey Road", artist:"The Beatles", image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title:"Rumours", artist:"Fleetwood Mac", image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" }
]

let currentChatId = null
let currentFriend = null

// =====================
// INIT PROFILE SYSTEM
// =====================
async function initProfile(){
  const user = await getUser()
  if (!user) return
  await ensureProfile(user)
}

// =====================
// RENDER HOME
// =====================
function render(i){
  const album = albums[i]

  document.getElementById("albumCover").style.backgroundImage =
    `url(${album.image})`

  document.getElementById("title").textContent = album.title
  document.getElementById("meta").textContent = album.artist
}

// =====================
// FRIEND LIST (REAL PROFILES)
// =====================
async function loadFriends(){

  const user = await getUser()

  const { data } = await supabase
    .from("friends")
    .select("*")

  const list = document.getElementById("friendsList")
  list.innerHTML = ""

  for(const f of data){

    const otherId = f.user_id === user.id ? f.friend_id : f.user_id

    const profile = await getProfile(otherId)

    const row = document.createElement("div")
    row.style.cssText = `
      display:flex;
      justify-content:space-between;
      padding:12px;
      margin:10px 0;
      background:rgba(255,255,255,0.04);
      border-radius:14px;
      align-items:center;
    `

    row.innerHTML = `
      <div>
        <strong>${profile?.username || "User"}</strong>
      </div>
      <button>Message</button>
    `

    row.querySelector("button").onclick = ()=>{
      openChat(otherId, profile)
    }

    list.appendChild(row)
  }
}

// =====================
// CHAT SYSTEM (WITH PROFILE)
// =====================
async function openChat(friendId, profile){

  currentFriend = friendId

  document.getElementById("chatTitle").textContent =
    profile?.username || "Chat"

  document.getElementById("chatPage").style.display = "flex"
  document.getElementById("friendsPage").classList.remove("active")

  const user = await getUser()

  let { data: chats } = await supabase
    .from("chat_members")
    .select("chat_id")
    .eq("user_id", user.id)

  let chatId = null

  for(const c of chats){
    const { data: members } = await supabase
      .from("chat_members")
      .select("*")
      .eq("chat_id", c.chat_id)

    if(members.some(m=>m.user_id === friendId)){
      chatId = c.chat_id
      break
    }
  }

  if(!chatId){

    const { data: newChat } = await supabase
      .from("chats")
      .insert({})
      .select()
      .single()

    chatId = newChat.id

    await supabase.from("chat_members").insert([
      { chat_id: chatId, user_id: user.id },
      { chat_id: chatId, user_id: friendId }
    ])
  }

  currentChatId = chatId
  loadMessages(chatId)
}

// =====================
// MESSAGES
// =====================
async function loadMessages(chatId){

  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending:true })

  const box = document.getElementById("messages")
  box.innerHTML = ""

  const user = await getUser()

  data.forEach(m=>{
    const div = document.createElement("div")

    div.className = "msg " + (m.sender_id === user.id ? "me" : "them")
    div.textContent = m.message_text

    box.appendChild(div)
  })
}

// =====================
// SEND MESSAGE
// =====================
async function sendMessage(){

  const input = document.getElementById("msgInput")
  const user = await getUser()

  await supabase.from("messages").insert({
    chat_id: currentChatId,
    sender_id: user.id,
    message_text: input.value
  })

  input.value = ""
  loadMessages(currentChatId)
}

// =====================
// INIT
// =====================
window.addEventListener("DOMContentLoaded", async ()=>{

  await initProfile()

  document.getElementById("generateBtn").onclick = ()=>{
    const i = Math.floor(Math.random()*albums.length)
    render(i)
  }

  document.getElementById("sendMsgBtn").onclick = sendMessage

  document.getElementById("friendsBtn").onclick = ()=>{
    document.getElementById("homePage").classList.remove("active")
    document.getElementById("friendsPage").classList.add("active")
  }

  document.getElementById("homeBtn").onclick = ()=>{
    document.getElementById("friendsPage").classList.remove("active")
    document.getElementById("homePage").classList.add("active")
  }

  render(0)
  loadFriends()
})
