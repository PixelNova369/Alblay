console.log("BASELINE APP LOADED");

const $ = (id) => document.getElementById(id);

/* ---------------- ALBUMS ---------------- */
const albums = [
  {
    title: "Abbey Road",
    artist: "The Beatles",
    image: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg"
  },
  {
    title: "Rumours",
    artist: "Fleetwood Mac",
    image: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG"
  },
  {
    title: "Dark Side of the Moon",
    artist: "Pink Floyd",
    image: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png"
  }
];

let index = 0;

/* ---------------- NAV ---------------- */
function show(page){
  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active");
  });

  const target = $(page + "Page");
  if(target) target.classList.add("active");
}

/* ---------------- RENDER ALBUM ---------------- */
function render(i){
  const a = albums[i];

  const cover = $("albumCover");
  if(cover){
    cover.style.backgroundImage = `url(${a.image})`;
  }

  $("title").textContent = a.title;
  $("meta").textContent = a.artist;
}

/* ---------------- FRIENDS ---------------- */
function loadFriends(){
  const box = $("friendsList");
  if(!box) return;

  box.innerHTML = "";

  ["Ethan","Emma","Ciaran"].forEach(name=>{
    const div = document.createElement("div");
    div.className = "friendRow";

    div.innerHTML = `
      <span>${name}</span>
      <button>Message</button>
    `;

    box.appendChild(div);
  });
}

/* ---------------- INIT ---------------- */
window.addEventListener("DOMContentLoaded", ()=>{

  console.log("DOM READY");

  $("homeBtn").onclick = ()=>show("home");
  $("friendsBtn").onclick = ()=>show("friends");

  $("generateBtn").onclick = ()=>{
    index = Math.floor(Math.random()*albums.length);
    render(index);
  };

  render(index);
  loadFriends();
});
