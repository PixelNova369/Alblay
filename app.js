const $ = (id)=>document.getElementById(id);

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
  },
  {
    title:"Blonde",
    artist:"Frank Ocean",
    image:"https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg"
  }
];

let index = 0;

/* NAV */
function show(page){
  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active");
  });

  $(page+"Page").classList.add("active");
}

/* RENDER */
function render(i){
  const a = albums[i];

  const cover = $("albumCover");
  if(cover){
    cover.style.backgroundImage = `url(${a.image})`;
  }

  $("title").textContent = a.title;
  $("meta").textContent = a.artist;
}

/* FRIENDS SYSTEM (FIXED) */
function loadFriends(){

  const friendsBox = $("friendsList");
  const inboxBox = $("inboxList");

  if(!friendsBox || !inboxBox) return;

  const friends = ["Ethan","Emma","Ciaran"];
  const requests = ["Alex","Jamie"];

  /* INBOX */
  inboxBox.innerHTML = "";

  requests.forEach(name=>{
    const div = document.createElement("div");
    div.className = "friendRow";

    div.innerHTML = `
      <span>${name}</span>
      <button>Accept</button>
    `;

    inboxBox.appendChild(div);
  });

  /* FRIENDS */
  friendsBox.innerHTML = "";

  friends.forEach(name=>{
    const div = document.createElement("div");
    div.className = "friendRow";

    div.innerHTML = `
      <span>${name}</span>
      <div>
        <button>Message</button>
        <button>Send Album</button>
      </div>
    `;

    friendsBox.appendChild(div);
  });
}

/* CONTROLS */
function next(){
  index = (index + 1) % albums.length;
  render(index);
}

function prev(){
  index = (index - 1 + albums.length) % albums.length;
  render(index);
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

  $("homeBtn").onclick = ()=>show("home");
  $("friendsBtn").onclick = ()=>show("friends");

  $("generateBtn").onclick = ()=>{
    index = Math.floor(Math.random()*albums.length);
    render(index);
  };

  $("nextBtn").onclick = next;
  $("prevBtn").onclick = prev;

  $("playBtn").onclick = ()=>{
    const a = albums[index];
    window.open(
      `https://open.spotify.com/search/${encodeURIComponent(a.title+" "+a.artist)}`
    );
  };

  $("drawerBtn").onclick = toggleDrawer;
  $("closeDrawer").onclick = toggleDrawer;

  render(index);
  loadFriends();
});
