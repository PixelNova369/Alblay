console.log("ALBLAY STARTED")

const $ = (id)=>document.getElementById(id)

/* ---------------- ALBUM DATA ---------------- */
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
]

let index = 0

/* ---------------- NAV ---------------- */
function show(page){
  document.querySelectorAll(".page")
    .forEach(p=>p.classList.remove("active"))

  $(page+"Page").classList.add("active")
}

/* ---------------- ALBUM RENDER ---------------- */
function render(i){

  const a = albums[i]

  const cover = $("albumCover")

  if(cover){
    cover.style.opacity = 0

    setTimeout(()=>{
      cover.style.backgroundImage = `url(${a.image})`
      cover.style.opacity = 1
    },150)
  }

  $("title").textContent = a.title
  $("meta").textContent = a.artist
}

/* ---------------- CONTROLS ---------------- */
function next(){
  index = (index + 1) % albums.length
  render(index)
}

function prev(){
  index = (index - 1 + albums.length) % albums.length
  render(index)
}

/* ---------------- FRIENDS ---------------- */
function loadFriends(){

  const box = $("friendsList")
  if(!box) return

  const friends = ["Ethan","Emma","Ciaran"]

  box.innerHTML = ""

  friends.forEach(name=>{

    const div = document.createElement("div")
    div.className = "friendRow"

    div.innerHTML = `
      <span>${name}</span>
      <button>Message</button>
    `

    box.appendChild(div)
  })
}

/* ---------------- INIT ---------------- */
window.addEventListener("DOMContentLoaded", ()=>{

  console.log("DOM READY")

  /* NAV */
  $("homeBtn").onclick = ()=>show("home")
  $("friendsBtn").onclick = ()=>show("friends")

  /* HOME */
  $("generateBtn").onclick = ()=>{
    index = Math.floor(Math.random()*albums.length)
    render(index)
  }

  $("nextBtn").onclick = next
  $("prevBtn").onclick = prev

  $("playBtn").onclick = ()=>{
    const a = albums[index]
    window.open(
      `https://open.spotify.com/search/${encodeURIComponent(a.title + " " + a.artist)}`,
      "_blank"
    )
  }

  /* INIT */
  render(index)
  loadFriends()
})
