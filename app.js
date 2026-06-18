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
    era:"60s",
    length:"Medium",
    color:"29,185,84"
  },
  {
    title:"Rumours",
    artist:"Fleetwood Mac",
    image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG",
    genre:"rock",
    era:"70s",
    length:"Long",
    color:"255,59,48"
  },
  {
    title:"Dark Side of the Moon",
    artist:"Pink Floyd",
    image:"https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
    genre:"rock",
    era:"70s",
    length:"Long",
    color:"10,132,255"
  }
]

let index = 0
let current = albums[0]

// =====================
// STORY TRANSITION
// =====================
function render(i, direction="next"){

  const album = albums[i]
  current = album

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")
  const bg = document.getElementById("bg")

  const exitX = direction === "next" ? -25 : 25

  cover.style.transform = `translateX(${exitX}px) scale(0.95)`
  cover.style.opacity = "0"

  title.style.opacity = "0"
  meta.style.opacity = "0"

  setTimeout(()=>{

    cover.style.backgroundImage = `url(${album.image})`
    title.textContent = album.title
    meta.textContent = album.artist

    const enterX = direction === "next" ? 25 : -25

    cover.style.transform = `translateX(${enterX}px) scale(1.05)`
    cover.style.opacity = "0"

    requestAnimationFrame(()=>{

      cover.style.transition = "0.5s cubic-bezier(.2,.8,.2,1)"
      cover.style.transform = "translateX(0px) scale(1)"
      cover.style.opacity = "1"

      title.style.opacity = "1"
      meta.style.opacity = "1"
    })

    bg.style.background = `
      radial-gradient(circle at 20% 30%, rgba(${album.color},0.22), transparent 40%),
      radial-gradient(circle at 80% 10%, rgba(255,255,255,0.04), transparent 45%),
      radial-gradient(circle at 40% 90%, rgba(${album.color},0.15), transparent 45%)
    `

  },200)
}

// =====================
// DRAWER FIX (IMPORTANT)
// =====================
const drawer = document.getElementById("drawerPanel")

document.getElementById("drawerBtn").onclick = ()=>{
  drawer.style.right = "0px"
}

document.getElementById("closeDrawerBtn").onclick = ()=>{
  drawer.style.right = "-320px"
}

// =====================
// CONTROLS
// =====================
document.getElementById("nextBtn").onclick = ()=>{
  index = (index + 1) % albums.length
  render(index,"next")
}

document.getElementById("prevBtn").onclick = ()=>{
  index = (index - 1 + albums.length) % albums.length
  render(index,"prev")
}

// =====================
// GENERATE (FILTER-AWARE)
// =====================
document.getElementById("generateBtn").onclick = ()=>{

  const genre = document.getElementById("genreFilter").value
  const era = document.getElementById("eraFilter").value
  const length = document.getElementById("lengthFilter").value

  let pool = albums

  if (genre !== "Any") pool = pool.filter(a=>a.genre===genre)
  if (era !== "Any") pool = pool.filter(a=>a.era===era)
  if (length !== "Any") pool = pool.filter(a=>a.length===length)

  if (!pool.length) pool = albums

  index = Math.floor(Math.random()*pool.length)
  render(index,"next")
}

// =====================
// PLAY BUTTON
// =====================
document.getElementById("playBtn").onclick = ()=>{
  window.open(
    `https://open.spotify.com/search/${encodeURIComponent(current.title+" "+current.artist)}`,
    "_blank"
  )
}

// =====================
// NAV
// =====================
function show(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
  document.getElementById(page+"Page").classList.add("active")
}

document.getElementById("homeBtn").onclick = ()=>show("home")
document.getElementById("friendsBtn").onclick = ()=>show("friends")
document.getElementById("profileBtn").onclick = ()=>show("profile")

// =====================
// INIT
// =====================
render(0)
