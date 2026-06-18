console.log("APP START")

// =====================
// ALBUM DATA
// =====================
const albums = [
  {
    title:"Abbey Road",
    artist:"The Beatles",
    image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
    genre:"rock",
    color:"29,185,84"
  },
  {
    title:"Rumours",
    artist:"Fleetwood Mac",
    image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG",
    genre:"rock",
    color:"255,59,48"
  },
  {
    title:"Dark Side of the Moon",
    artist:"Pink Floyd",
    image:"https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
    genre:"rock",
    color:"10,132,255"
  }
]

let index = 0
let current = albums[0]

// =====================
// WRAPPED TRANSITION SYSTEM
// =====================
function render(i){

  const album = albums[i]
  current = album

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")
  const bg = document.getElementById("bg")

  // 🎞 WRAPPED EXIT ANIMATION
  cover.style.transform = "translateY(20px) scale(0.96)"
  cover.style.opacity = "0"

  title.style.opacity = "0"
  meta.style.opacity = "0"

  setTimeout(()=>{

    // update content
    cover.style.backgroundImage = `url(${album.image})`
    title.textContent = album.title
    meta.textContent = album.artist

    // 🎨 dynamic wrapped background glow
    bg.style.background = `
      radial-gradient(circle at 20% 20%, rgba(${album.color},0.22), transparent 40%),
      radial-gradient(circle at 80% 10%, rgba(255,255,255,0.05), transparent 45%),
      radial-gradient(circle at 40% 90%, rgba(${album.color},0.15), transparent 45%)
    `

    // 🎞 ENTER ANIMATION
    cover.style.transform = "translateY(0px) scale(1)"
    cover.style.opacity = "1"

    title.style.opacity = "1"
    meta.style.opacity = "1"

  },180)
}

// =====================
// NAV
// =====================
function show(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
  document.getElementById(page+"Page").classList.add("active")
}

// =====================
// DRAWER
// =====================
document.getElementById("drawerBtn").onclick = ()=>{
  const d = document.getElementById("drawerPanel")
  d.style.right = d.style.right === "0px" ? "-300px" : "0px"
}

// =====================
// CONTROLS
// =====================
document.getElementById("nextBtn").onclick = ()=>{
  index = (index + 1) % albums.length
  render(index)
}

document.getElementById("prevBtn").onclick = ()=>{
  index = (index - 1 + albums.length) % albums.length
  render(index)
}

document.getElementById("generateBtn").onclick = ()=>{
  const genre = document.getElementById("genreFilter").value

  let pool = albums

  if (genre !== "Any") {
    pool = albums.filter(a => a.genre === genre)
  }

  index = Math.floor(Math.random() * pool.length)
  render(index)
}

// =====================
// PLAY BUTTON (Spotify)
// =====================
document.getElementById("playBtn").onclick = ()=>{
  window.open(
    `https://open.spotify.com/search/${encodeURIComponent(current.title + " " + current.artist)}`,
    "_blank"
  )
}

// =====================
// NAV
// =====================
document.getElementById("homeBtn").onclick = ()=>show("home")
document.getElementById("friendsBtn").onclick = ()=>show("friends")
document.getElementById("profileBtn").onclick = ()=>show("profile")

// =====================
// INIT
// =====================
render(0)
