console.log("APP START SAFE MODE")

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

  document.querySelectorAll(".page")
    .forEach(p=>p.classList.remove("active"))

  $(page+"Page").classList.add("active")
}

/* ---------------- ALBUM ---------------- */
function render(){

  const a = albums[Math.floor(Math.random()*albums.length)]

  $("albumCover").style.backgroundImage = `url(${a.image})`
  $("title").textContent = a.title
  $("meta").textContent = a.artist
}

/* ---------------- FRIENDS (STATIC SAFE) ---------------- */
function loadFriends(){

  const box = $("friendsList")
  if(!box) return

  box.innerHTML = ""

  const friends = ["Ethan","Emma","Ciaran"]

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

/* ---------------- INIT (CRASH PROTECTED) ---------------- */
window.addEventListener("DOMContentLoaded", ()=>{

  try{

    $("homeBtn").onclick = ()=>show("home")
    $("friendsBtn").onclick = ()=>show("friends")

    $("generateBtn").onclick = render

    render()
    loadFriends()

  }catch(err){
    console.log("CRASH BLOCKED:", err)
  }

})
