const $ = (id)=>document.getElementById(id);

/* NO STATIC NAMES - GENERATED THREADS */
const threads = ["Alex","Jamie","Sam","Taylor","Jordan"];

let active = null;

/* STORAGE */
function getChats(){
  return JSON.parse(localStorage.getItem("dm") || "{}");
}

function saveChats(data){
  localStorage.setItem("dm", JSON.stringify(data));
}

/* LOAD INBOX */
function loadInbox(){

  const box = $("inbox");
  box.innerHTML = "";

  threads.forEach(name=>{
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
  render();
}

/* RENDER MESSAGES */
function render(){

  const box = $("messages");
  box.innerHTML = "";

  if(!active) return;

  const data = getChats();
  const msgs = data[active] || [];

  msgs.forEach(m=>{
    const div = document.createElement("div");
    div.className = "msg " + (m.from === "me" ? "me" : "");
    div.innerText = m.text;
    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

/* SEND MESSAGE */
function send(){

  const input = $("text");
  const text = input.value.trim();

  if(!text || !active) return;

  const data = getChats();

  if(!data[active]) data[active] = [];

  data[active].push({
    from:"me",
    text
  });

  saveChats(data);

  input.value = "";
  render();
}

/* INIT */
window.addEventListener("DOMContentLoaded", ()=>{

  loadInbox();

  $("send").onclick = send;

  $("text").addEventListener("keydown",(e)=>{
    if(e.key==="Enter") send();
  });

});
