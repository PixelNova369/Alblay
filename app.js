import { supabase } from "./supabase.js"

console.log("APP START")

// ================= HOME ALBUMS =================
const albums = [
  { title:"Abbey Road", artist:"Beatles", image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title:"Rumours", artist:"Fleetwood Mac", image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" }
]

let current = albums[0]
let currentChatId = null

function render(i){
  current = albums[i]

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")

  cover.style.backgroundImage = `url(${current.image})`
  title.textContent = current.title
  meta.textContent = current.artist
}

// ================= NAV =================
function show(page){

  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))

  if(page === "chat"){
    document.getElementById("chatPage").style.display = "flex"
    document.getElementById("friendsPage").classList.remove("active")
    document.getElementById("homePage").classList.remove("active")
    return
  }

  document.getElementById(page+"Page").classList.add("active")
  document.getElementById("chatPage").style.display = "none"
}

// ================= FRIEND LIST =================
async function loadFriends(){

  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  const { data } = await supabase
    .from("friends")
    .select("*")
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

  const list = document.getElementById("friendsList")
  list.innerHTML = ""

  data.forEach(f=>{

    const other = f.user_id === user.id ? f.friend_id : f.user_id

    const row = document.createElement("div")
    row.className = "friendRow"

    row.innerHTML = `
      <span>${other}</span>
      <button data-id="${other}">Message</button>
    `

    row.querySelector("button").onclick = ()=>openChat(other)

    list.appendChild(row)
  })
}

// ================= CHAT SYSTEM =================
async function openChat(friendId){

  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

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

  document.getElementById("chatTitle").textContent = friendId

  show("chat")
  loadMessages(chatId)
  listenMessages(chatId)
}

// ================= MESSAGES =================
async function loadMessages(chatId){

  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending:true })

  renderMessages(data)
}

function renderMessages(msgs){

  const box = document.getElementById("messages")
  box.innerHTML = ""

  msgs.forEach(m=>{

    const div = document.createElement("div")
    div.className = "msg " + (m.sender_id === "me" ? "me" : "them")

    div.textContent = m.message_text
    box.appendChild(div)
  })
}

// realtime
function listenMessages(chatId){

  supabase
    .channel("chat_"+chatId)
    .on("postgres_changes",{
      event:"INSERT",
      schema:"public",
      table:"messages",
      filter:`chat_id=eq.${chatId}`
    },payload=>{
      loadMessages(chatId)
    })
    .subscribe()
}

// send message
async function sendMessage(){

  const input = document.getElementById("msgInput")

  await supabase.from("messages").insert({
    chat_id: currentChatId,
    sender_id: (await supabase.auth.getUser()).data.user.id,
    message_text: input.value
  })

  input.value = ""
}

// ================= INIT =================
window.addEventListener("DOMContentLoaded",()=>{

  document.getElementById("homeBtn").onclick=()=>show("home")
  document.getElementById("friendsBtn").onclick=()=>show("friends")

  document.getElementById("sendMsgBtn").onclick=sendMessage

  document.getElementById("generateBtn").onclick=()=>{
    const i = Math.floor(Math.random()*albums.length)
    render(i)
  }

  render(0)
  loadFriends()
})
