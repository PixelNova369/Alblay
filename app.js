const $ = (id)=>document.getElementById(id);

let user = null;

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
  },
  {
    title:"Blonde",
    artist:"Frank Ocean",
    image:"https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg"
  }
];

let index = 0;

/* LOGIN */
function login(){
  const val = $("user").value.trim();
  if(!val) return;

  user = val;

  go("home");
  render();
}

/* NAV */
function go(page){

  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active");
  });

  $(page+"Page").classList.add("active");

  if(page==="friends"){
    loadFriends();
  }
}

/* HOME */
function render(){
  const a = albums[index];

  $("albumCover").style.backgroundImage = `url(${a.image})`;
  $("title").textContent = a.title;
  $("meta").textContent = a.artist;
}

/* FRIENDS (ONLY USER-ADDED) */
function loadFriends(){

  const box = $("friendsList");
  box.innerHTML = "";

  let stored = JSON.parse(localStorage.getItem("friends") || "[]");

  stored.forEach(name=>{
    const div = document.createElement("div");
    div.className = "friendRow";

    div.innerHTML = `
      <span>${name}</span>
      <button onclick="message('${name}')">Message</button>
    `;

    box.appendChild(div);
  });

  /* add simple input UI */
  const input = document.createElement("input");
  input.placeholder = "Add friend";

  const btn = document.createElement("button");
  btn.innerText = "Add";

  btn.onclick = ()=>{
    if(!input.value.trim()) return;

    stored.push(input.value.trim());
    localStorage.setItem("friends", JSON.stringify(stored));

    loadFriends();
  };

  box.appendChild(input);
  box.appendChild(btn);
}

/* MESSAGE (placeholder) */
function message(name){
  alert("Chat with " + name + " coming next update");
}

/* INIT */
window.addEventListener("DOMContentLoaded", ()=>{
  render();
});
