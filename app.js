console.log("APP START")

const albums = [
  { title:"Abbey Road", artist:"The Beatles", image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title:"Rumours", artist:"Fleetwood Mac", image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" },
  { title:"Dark Side of the Moon", artist:"Pink Floyd", image:"https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" }
]

let index = 0
let current = albums[0]

// =====================
// RENDER
// =====================
function render(i){
  current = albums[i]

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")

  cover.style.opacity = 0

  setTimeout(()=>{
    cover.style.backgroundImage = `url(${current.image})`
    title.textContent = current.title
    meta.textContent = current.artist
    cover.style.opacity = 1
  },150)
}

// =====================
// NAV SYSTEM (FIXED)
// =====================
function setPage(page){

  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
  document.getElementById(page+"Page").classList.add("active")

  document.querySelectorAll(".navBtn").forEach(b=>b.classList.remove("active"))

  if(page==="home") document.getElementById("homeBtn").classList.add("active")
  if(page==="friends") document.getElementById("friendsBtn").classList.add("active")
  if(page==="profile") document.getElementById("profileBtn").classList.add("active")
}

// =====================
// INIT
// =====================
window.addEventListener("DOMContentLoaded", ()=>{

  // NAV BUTTONS
  document.getElementById("homeBtn").onclick = ()=>setPage("home")
  document.getElementById("friendsBtn").onclick = ()=>setPage("friends")
  document.getElementById("profileBtn").onclick = ()=>setPage("profile")

  // DRAWER FIX
  const drawer = document.getElementById("drawerPanel")

  document.getElementById("drawerBtn").onclick = ()=>{
    drawer.classList.add("open")
  }

  document.getElementById("closeDrawerBtn").onclick = ()=>{
    drawer.classList.remove("open")
  }

  // PLAYER CONTROLS
  document.getElementById("nextBtn").onclick = ()=>{
    index = (index + 1) % albums.length
    render(index)
  }

  document.getElementById("prevBtn").onclick = ()=>{
    index = (index - 1 + albums.length) % albums.length
    render(index)
  }

  document.getElementById("generateBtn").onclick = ()=>{
    index = Math.floor(Math.random()*albums.length)
    render(index)
  }

  document.getElementById("playBtn").onclick = ()=>{
    window.open(
      `https://open.spotify.com/search/${encodeURIComponent(current.title+" "+current.artist)}`,
      "_blank"
    )
  }

  render(0)
})
