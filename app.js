import { supabase, saveAlbum, logout } from './supabase.js'

window.addEventListener("DOMContentLoaded", () => {

  // =====================
  // STATE
  // =====================
  let albumQueue = []
  let currentIndex = -1
  let currentAlbum = null
  let isAnimating = false

  const card = document.getElementById("albumCard")
  const titleEl = document.getElementById("albumTitle")
  const artistEl = document.getElementById("albumArtist")
  const metaEl = document.getElementById("albumMeta")
  const coverEl = document.getElementById("albumCover")

  // =====================
  // MENU
  // =====================
  document.getElementById("menuBtn").addEventListener("click", () => {
    const panel = document.getElementById("filterPanel")
    panel.style.display = panel.style.display === "flex" ? "none" : "flex"
  })

  // =====================
  // GENERATE
  // =====================
  document.getElementById("generateBtn").addEventListener("click", () => {

    const genre = document.getElementById("genre").value
    const era = document.getElementById("era").value
    const length = document.getElementById("length").value

    const album = generateAlbum(genre, era, length)

    albumQueue.push(album)
    currentIndex = albumQueue.length - 1

    renderAlbum(true)
  })

  // =====================
  // SAVE
  // =====================
  document.getElementById("saveBtn").addEventListener("click", async () => {

    if (!currentAlbum) return alert("Generate first")

    const { data } = await supabase.auth.getSession()
    const user = data.session?.user

    if (!user) return alert("Not logged in")

    const { error } = await supabase
      .from("album_walls")
      .insert([
        {
          user_id: user.id,
          title: currentAlbum.title,
          artist: currentAlbum.artist,
          genre: currentAlbum.genre,
          era: currentAlbum.era
        }
      ])

    if (error) {
      alert(error.message)
    } else {
      alert("Saved")
      loadWall()
    }
  })

  // =====================
  // NAV
  // =====================
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentIndex < albumQueue.length - 1) {
      currentIndex++
      animate()
      setTimeout(() => renderAlbum(), 150)
    }
  })

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--
      animate()
      setTimeout(() => renderAlbum(), 150)
    }
  })

  // =====================
  // LOGOUT
  // =====================
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await logout()
    window.location.href = "/"
  })

  // =====================
  // INIT
  // =====================
  init()

  async function init() {
    const { data } = await supabase.auth.getSession()
    if (!data.session) window.location.href = "/"
    loadWall()
  }

  // =====================
  // RENDER
  // =====================
  function renderAlbum() {
    currentAlbum = albumQueue[currentIndex]

    titleEl.textContent = currentAlbum.title
    artistEl.textContent = currentAlbum.artist
    metaEl.textContent = `${currentAlbum.genre} • ${currentAlbum.era}`
  }

  // =====================
  // ANIMATION
  // =====================
  function animate() {
    card.style.opacity = "0"
    card.style.transform = "translateX(40px)"

    setTimeout(() => {
      card.style.opacity = "1"
      card.style.transform = "translateX(0)"
    }, 150)
  }

  // =====================
  // WALL
  // =====================
  async function loadWall() {

    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData.session?.user

    if (!user) return

    const { data } = await supabase
      .from("album_walls")
      .select("*")
      .eq("user_id", user.id)

    const wall = document.getElementById("albumWall")
    wall.innerHTML = ""

    data.forEach(a => {
      const div = document.createElement("div")
      div.style.margin = "10px"
      div.style.padding = "10px"
      div.style.background = "#111"
      div.style.borderRadius = "10px"
      div.style.width = "180px"

      div.innerHTML = `
        <b>${a.title}</b><br>
        <small>${a.artist}</small><br>
        <small>${a.genre} • ${a.era}</small>
      `

      wall.appendChild(div)
    })
  }

})

// =====================
// GENERATOR
// =====================
function generateAlbum(genre, era, length) {

  const genres = ["Rock", "Pop", "Hip Hop", "Electronic"]

  const artists = {
    "Rock": ["Arctic Monkeys", "Oasis", "The Strokes"],
    "Pop": ["Taylor Swift", "Dua Lipa", "The Weeknd"],
    "Hip Hop": ["Kendrick Lamar", "Drake", "J. Cole"],
    "Electronic": ["Daft Punk", "Calvin Harris", "Disclosure"]
  }

  const eras = ["1960s","1970s","1980s","1990s","2000s","2010s","2020s"]

  const titles = [
    "Midnight Signals",
    "Echoes in the Static",
    "Neon Drift",
    "Lost Frequency",
    "Digital Heartbreak",
    "Parallel Nights"
  ]

  const finalGenre = genre || genres[Math.floor(Math.random() * genres.length)]
  const finalEra = era || eras[Math.floor(Math.random() * eras.length)]

  const finalArtist = artists[finalGenre][Math.floor(Math.random() * artists[finalGenre].length)]

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    artist: finalArtist,
    genre: finalGenre,
    era: finalEra
  }
}
