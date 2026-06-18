const $ = (id)=>document.getElementById(id);

let currentUser = null;

/* USERS DB */
function getUsers(){
  return JSON.parse(localStorage.getItem("users") || "{}");
}

function saveUsers(u){
  localStorage.setItem("users", JSON.stringify(u));
}

/* PAGE SYSTEM (FIXED — NO BREAKS) */
function showPage(page){

  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active");
  });

  const target = document.getElementById(page + "Page");

  if(target){
    target.classList.add("active");
  }
}

/* LOGIN */
function login(){

  const u = $("user").value.trim();
  const p = $("pass").value.trim();

  const users = getUsers();

  if(!users[u] || users[u].password !== p){
    alert("Invalid login");
    return;
  }

  currentUser = u;

  // 🔥 GUARANTEED TRANSITION FIX
  showPage("home");

  render();
}

/* SIGNUP */
function signup(){

  const u = $("user").value.trim();
  const p = $("pass").value.trim();

  if(!u || !p){
    alert("Fill all fields");
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

/* NAVIGATION */
function go(page){

  if(!currentUser) return;

  showPage(page);

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
  },
  {
    title:"Blonde",
    artist:"Frank Ocean",
    image:"https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg"
  }
];

let index = 0;

function render(){
  const a = albums[index];

  $("albumCover").style.backgroundImage = `url(${a.image})`;
  $("title").textContent = a.title;
  $("meta").textContent = a.artist;
}

/* FRIENDS (USER ONLY) */
function loadFriends(){

  const box = $("friendsList");
  box.innerHTML = "";

  let list = JSON.parse(localStorage.getItem("friends") || "[]");

  if(list.length === 0){
    box.innerHTML = "<p>No friends added yet</p>";
    return;
  }

  list.forEach(name=>{
    const div = document.createElement("div");
    div.className = "friendBox";
    div.textContent = name;
    box.appendChild(div);
  });
}

/* ADD FRIEND */
function addFriend(){

  const input = $("addFriend");
  const name = input.value.trim();

  if(!name) return;

  let list = JSON.parse(localStorage.getItem("friends") || "[]");

  list.push(name);

  localStorage.setItem("friends", JSON.stringify(list));

  input.value = "";

  loadFriends();
}

/* INIT */
window.addEventListener("DOMContentLoaded", ()=>{

  $("loginBtn").onclick = login;
  $("signupBtn").onclick = signup;

  $("homeBtn").onclick = ()=>go("home");
  $("friendsBtn").onclick = ()=>go("friends");

  $("addBtn").onclick = addFriend;

  render();
});
