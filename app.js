const $ = (id)=>document.getElementById(id);

const friends = ["Ethan","Emma","Ciaran","Alex","Jamie"];

let activeFriend = null;

/* STORAGE */
function getChats(){
  return JSON.parse(localStorage.getItem("chats") || "{}");
}

function saveChats(data){
  localStorage.setItem("chats", JSON.stringify(data));
}

/* LOAD FRIENDS */
function loadFriends(){
  const panel = $("friendsPanel");
  panel.innerHTML = "";

  friends.forEach(name=>{
    const div = document.createElement("div");
    div.className = "friendItem";
    div.innerText = name;

    div.onclick = ()=>openChat(name);

    panel.appendChild(div);
  });
}

/* OPEN CHAT */
function openChat(name){
  activeFriend = name;

  $("chatHeader").innerText = name;

  renderMessages();
}

/* RENDER MESSAGES */
function renderMessages(){

  const box = $("messages");
  box.innerHTML = "";

  if(!activeFriend) return;

  const chats = getChats();

  const msgs = chats[activeFriend] || [];

  msgs.forEach(m=>{
    const div = document.createElement("div");
    div.className = "msg " + (m.from === "me" ? "me" : "");
    div.innerText = m.text;
    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

/* SEND MESSAGE */
function sendMessage(){

  const input = $("textInput");
  const text = input.value.trim();

  if(!text || !activeFriend) return;

  const chats = getChats();

  if(!chats[activeFriend]) chats[activeFriend] = [];

  chats[activeFriend].push({
    from:"me",
    text
  });

  saveChats(chats);

  input.value = "";

  renderMessages();
}

/* ALBUM SEND (placeholder) */
function sendAlbum(){

  if(!activeFriend) return;

  const chats = getChats();

  if(!chats[activeFriend]) chats[activeFriend] = [];

  chats[activeFriend].push({
    from:"me",
    text:"🎧 Sent you an album (feature coming soon)"
  });

  saveChats(chats);

  renderMessages();
}

/* INIT */
window.addEventListener("DOMContentLoaded", ()=>{

  loadFriends();

  $("sendBtn").onclick = sendMessage;

  $("albumBtn").onclick = sendAlbum;

  $("textInput").addEventListener("keypress",(e)=>{
    if(e.key === "Enter") sendMessage();
  });

});
