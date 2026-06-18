const $ = (id)=>document.getElementById(id);

let currentUser = null;

/* USERS DB (localStorage) */
function getUsers(){
  return JSON.parse(localStorage.getItem("users") || "{}");
}

function saveUsers(u){
  localStorage.setItem("users", JSON.stringify(u));
}

/* SIGN UP */
function signup(){

  const u = $("user").value.trim();
  const p = $("pass").value.trim();

  if(!u || !p){
    alert("Fill in all fields");
    return;
  }

  let users = getUsers();

  if(users[u]){
    alert("User already exists");
    return;
  }

  users[u] = { password:p };

  saveUsers(users);

  alert("Account created — now log in");
}

/* LOGIN */
function login(){

  const u = $("user").value.trim();
  const p = $("pass").value.trim();

  let users = getUsers();

  if(!users[u] || users[u].password !== p){
    alert("Invalid login");
    return;
  }

  currentUser = u;

  go("home");
  render();
}

/* NAV */
function go(page){

  if(!currentUser) return;

  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active");
  });

  $(page+"Page").classList.add("active");

  if(page === "friends"){
    loadFriends();
  }
}

/* HOME */
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

function render(){
  const a = albums[index];
  $("albumCover").style.backgroundImage = `url(${a.image})`;
  $("title").textContent = a.title;
  $("meta").textContent = a.artist;
}

/* FRIENDS (EMPTY ONLY USER ADDED) */
function loadFriends(){

  const box = $("friendsList");
  box.innerHTML = "";

  let list = JSON.parse(localStorage.getItem("friends") || "[]");

  if(list.length === 0){
    box.innerHTML = "<p>No friends added</p>";
    return;
  }

  list.forEach(name=>{
    const div = document.createElement("div");
    div.textContent = name;
    div.style.padding = "10px";
    div.style.margin = "6px 0";
    div.style.background = "rgba(255,255,255,0.06)";
    div.style.borderRadius = "10px";

    box.appendChild(div);
  });
}

/* INIT */
window.addEventListener("DOMContentLoaded", ()=>{

  $("loginBtn").onclick = login;
  $("signupBtn").onclick = signup;

  $("homeBtn").onclick = ()=>go("home");
  $("friendsBtn").onclick = ()=>go("friends");

  render();
});
