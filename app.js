console.log("APP START")

const albums = [
  { title:"Abbey Road", artist:"The Beatles", image:"https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title:"Rumours", artist:"Fleetwood Mac", image:"https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" },
  { title:"Dark Side", artist:"Pink Floyd", image:"https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" }
]

let index = 0
let current = albums[0]

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

window.addEventListener("DOMContentLoaded", ()=>{

  const $ = (id)=>document.getElementById(id)

  // NAV
  function show(page){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
    $(page+"Page").classList.add("active")
  }

  $("homeBtn").onclick = ()=>show("home")
  $("friendsBtn").onclick = ()=>show("friends")
  $("profileBtn").onclick = ()=>show("profile")

  // ALBUM
  $("generateBtn").onclick = ()=>{
    index = Math.floor(Math.random()*albums.length)
    render(index)
  }

  // ================= PROFILE SYSTEM =================

  let username = "Guest"

  // fallback guest already shown

  const avatarInput = $("avatarInput")

  avatarInput.onchange = (e)=>{
    const file = e.target.files[0]
    if(!file) return

    const reader = new FileReader()

    reader.onload = (event)=>{
      const url = event.target.result

      $("avatarPreview").src = url
      $("usernamePreview").textContent = username
    }

    reader.readAsDataURL(file)
  }

  render(0)
})
