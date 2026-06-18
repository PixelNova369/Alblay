const $ = (id)=>document.getElementById(id);

let loggedIn = false;
let active = null;

/* ALBUMS */
const albums = [
  {
    title:"Abbey Road",
    artist:"The Beatles",
    image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg"
  },
  {
    title:"Rumours",
    artist:"Fleetwood Mac",
    image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG"
  }
];

let index = 0;

/* CHAT STORAGE */
function getChats(){
  return JSON.parse(localStorage.getItem("dm") || "{}");
}

function saveChats(data){
  localStorage.setItem("dm", JSON.stringify(data));
}

/* LOGIN */
function login(){

  const u = $("user").value.trim();
  const p = $("pass").value.trim();

  if(!u || !p) return;

  loggedIn = true;
  go("home");
  render();
}

/* NAV */
function go(page){

  if(!loggedIn) return;

  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active");
  });

  $(page+"Page").classList.add("active");

  if(page === "friends"){
    loadInbox();
  }
}

/* HOME */
function render(){

  const a = albums[index];

  $("albumCover").style.backgroundImage = `url(${a.image})`;
  $("title").textContent = a.title;
  $("meta").textContent = a.artist;
}

/* INBOX (NO PRE-NAMES) */
function loadInbox(){

  const box = $("inbox");
  box.innerHTML = "";

  let chats = getChats();

  let names = Object.keys(chats);

  if(names.length === 0){
    box.innerHTML = "<p style='padding:10px'>No chats yet</p>";
    return;
  }

  names.forEach(name=>{
    const div = document.createElement("div");
    div.className = "thread";
    div.innerText = name;

    div.onclick = ()=>openChat(name);

    box.appendChild(div);
  });
}

/* OPEN CHAT */
function openChat(name){
  active = name;
  $("chatHeader").innerText = name;
  renderMessages();
}

/* RENDER MESSAGES */
function renderMessages(){

  const box = $("messages");
  box.innerHTML = "";

  if(!active) return;

  const chats = getChats();
  const msgs = chats[active] || [];

  msgs.forEach(m=>{
    const div = document.createElement("div");
    div.className = "msg " + (m.from === "me" ? "me" : "");
    div.innerText = m.text;
    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

/* SEND */
function send(){

  const input = $("text");
  const text = input.value.trim();

  if(!text || !active) return;

  const chats = getChats();

  if(!chats[active]) chats[active] = [];

  chats[active].push({
    from:"me",
    text
  });

  saveChats(chats);

  input.value = "";

  renderMessages();
}

/* INIT */
window.addEventListener("DOMContentLoaded", ()=>{

  $("loginBtn").onclick = login;

  $("homeBtn").onclick = ()=>go("home");
  $("friendsBtn").onclick = ()=>go("friends");

  $("send").onclick = send;

  $("text").addEventListener("keydown",(e)=>{
    if(e.key==="Enter") send();
  });

  render();
});
