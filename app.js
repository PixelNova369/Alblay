console.log("APP START - STABLE MODE")

const $ = (id)=>document.getElementById(id)

/* ---------------- ALBUMS ---------------- */
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

/* ---------------- NAV ---------------- */
function show(page){

  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active")
  })

  const target = $(page + "Page")
  if(target) target.classList.add("active")
}

/* ---------------- ALBUM ---------------- */
function renderAlbum(){

  const a = albums[Math.floor(Math.random()*albums.length)]

  const cover = $("albumCover")
  const title = $("title")
  const meta = $("meta")

  if(cover){
    cover.style.backgroundImage = `url(${a.image})`
  }

  if(title) title.textContent = a.title
  if(meta) meta.textContent = a.artist
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

/* ---------------- INIT SAFE ---------------- */
window.addEventListener("DOMContentLoaded", ()=>{

  try{

    if($("homeBtn")) $("homeBtn").onclick = ()=>show("home")
    if($("friendsBtn")) $("friendsBtn").onclick = ()=>show("friends")

    if($("generateBtn")) $("generateBtn").onclick = renderAlbum

    renderAlbum()
    loadFriends()

  }catch(e){
    console.log("ERROR BLOCKED:", e)
  }

})
