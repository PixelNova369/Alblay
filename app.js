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
    title:"Dark Side of the Moon",
    artist:"Pink Floyd",
    image:"https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png"
  }
];

let index = 0;

/* LOGIN FIX */
function login(){

  const username = $("user").value.trim();
  const password = $("pass").value.trim();

  if(!username || !password){
    alert("Please enter username + password");
    return;
  }

  user = username;

  go("home");
  render();
}

/* NAV */
function go(page){

  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active");
  });

  $(page+"Page").classList.add("active");

  if(page === "friends"){
    loadFriends();
  }
}

/* RENDER HOME */
function render(){

  const a = albums[index];

  $("albumCover").style.backgroundImage = `url(${a.image})`;
  $("title").textContent = a.title;
  $("meta").textContent = a.artist;
}

/* FRIENDS (EMPTY BASE FOR NOW) */
function loadFriends(){

  const box = $("friendsList");
  box.innerHTML = "";

  let stored = JSON.parse(localStorage.getItem("friends") || "[]");

  stored.forEach(name=>{
    const div = document.createElement("div");
    div.className = "friendRow";

    div.innerHTML = `
      <span>${name}</span>
      <button>Message</button>
    `;

    box.appendChild(div);
  });
}

/* CONTROLS */
function next(){
  index = (index + 1) % albums.length;
  render();
}

function prev(){
  index = (index - 1 + albums.length) % albums.length;
  render();
}

/* DRAWER */
let open = false;

function toggleDrawer(){
  const d = $("drawerPanel");
  open = !open;
  d.classList.toggle("hidden");
}

/* INIT */
window.addEventListener("DOMContentLoaded", ()=>{

  /* LOGIN BUTTON FIX */
  $("loginBtn").onclick = login;

  /* ENTER KEY FIX */
  document.addEventListener("keydown",(e)=>{
    if(e.key === "Enter" && $("loginPage").classList.contains("active")){
      login();
    }
  });

  /* NAV */
  $("homeBtn").onclick = ()=>go("home");
  $("friendsBtn").onclick = ()=>go("friends");

  /* HOME CONTROLS */
  $("nextBtn").onclick = next;
  $("prevBtn").onclick = prev;

  $("playBtn").onclick = ()=>{
    const a = albums[index];
    window.open(
      `https://open.spotify.com/search/${encodeURIComponent(a.title+" "+a.artist)}`
    );
  };

  $("generateBtn").onclick = ()=>{
    index = Math.floor(Math.random()*albums.length);
    render();
  };

  $("drawerBtn").onclick = toggleDrawer;
  $("closeDrawer").onclick = toggleDrawer;

  render();
});
