console.log("🔥 APP.JS LOADED");

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
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    image: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png"
  }
];

function $(id){
  return document.getElementById(id);
}

function showPage(pageId){
  document.querySelectorAll(".page").forEach(page=>{
    page.classList.remove("active");
  });

  const page = $(pageId);
  if(page){
    page.classList.add("active");
  }
}

function renderAlbum(){
  const album = albums[Math.floor(Math.random() * albums.length)];

  if ($("albumCover")) {
    $("albumCover").style.backgroundImage = `url(${album.image})`;
  }

  if ($("title")) {
    $("title").textContent = album.title;
  }

  if ($("meta")) {
    $("meta").textContent = album.artist;
  }
}

function loadFriends(){

  const friendsList = $("friendsList");

  if(!friendsList) return;

  friendsList.innerHTML = "";

  const friends = [
    "Ethan",
    "Emma",
    "Ciaran"
  ];

  friends.forEach(name => {

    const row = document.createElement("div");

    row.className = "friendRow";

    row.innerHTML = `
      <span>${name}</span>
      <button class="messageBtn">Message</button>
    `;

    row.querySelector(".messageBtn").onclick = () => {
      alert("Chat with " + name + " coming next");
    };

    friendsList.appendChild(row);
  });
}

window.addEventListener("DOMContentLoaded", () => {

  console.log("✅ DOM READY");

  if ($("homeBtn")) {
    $("homeBtn").onclick = () => showPage("homePage");
  }

  if ($("friendsBtn")) {
    $("friendsBtn").onclick = () => showPage("friendsPage");
  }

  if ($("profileBtn")) {
    $("profileBtn").onclick = () => showPage("profilePage");
  }

  if ($("generateBtn")) {
    $("generateBtn").onclick = renderAlbum;
  }

  renderAlbum();
  loadFriends();
});
