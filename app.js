console.log("APP START")

let albums = []
let index = 0
let current = null

window.onload = () => {
  console.log("WINDOW LOADED")

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")
  const bg = document.getElementById("bg")

  const nextBtn = document.getElementById("nextBtn")
  const prevBtn = document.getElementById("prevBtn")
  const playBtn = document.getElementById("playBtn")
  const generateBtn = document.getElementById("generateBtn")

  // =====================
  // MOCK LAST.FM DATA (safe fallback)
  // =====================
  albums = Array.from({ length: 20 }).map((_, i) => ({
    title: "Album " + (i + 1),
    artist: "Artist " + (i + 1),
    image: `https://picsum.photos/seed/${i}/600/600`
  }))

  function render(i) {
    current = albums[i]

    if (!current) return

    // card update
    cover.style.backgroundImage = `url(${current.image})`
    title.textContent = current.title
    meta.textContent = current.artist

    // background update (Spotify style)
    bg.style.backgroundImage = `url(${current.image})`

    // smooth fade effect
    cover.style.opacity = 0
    setTimeout(() => cover.style.opacity = 1, 150)
  }

  render(0)

  // =====================
  // CONTROLS
  // =====================
  nextBtn.onclick = () => {
    index = (index + 1) % albums.length
    render(index)
  }

  prevBtn.onclick = () => {
    index = (index - 1 + albums.length) % albums.length
    render(index)
  }

  generateBtn.onclick = () => {
    index = Math.floor(Math.random() * albums.length)
    render(index)
  }

  playBtn.onclick = () => {
    alert("Would open Spotify track for: " + current.title)
  }

  // =====================
  // DRAWER
  // =====================
  const drawer = document.getElementById("drawerPanel")
  const drawerBtn = document.getElementById("drawerBtn")
  const drawerBackBtn = document.getElementById("drawerBackBtn")

  let open = false

  const openDrawer = () => {
    open = true
    drawer.style.right = "0px"
  }

  const closeDrawer = () => {
    open = false
    drawer.style.right = "-320px"
  }

  drawerBtn.onclick = (e) => {
    e.stopPropagation()
    open ? closeDrawer() : openDrawer()
  }

  drawerBackBtn.onclick = closeDrawer

  document.addEventListener("click", (e) => {
    if (!open) return
    if (!drawer.contains(e.target) && !drawerBtn.contains(e.target)) {
      closeDrawer()
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer()
  })
}
