import { supabase, saveAlbum, logout, loadAlbums } from './supabase.js'

window.addEventListener("DOMContentLoaded", () => {

  // =====================
  // STATE (QUEUE SYSTEM)
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
  // MENU TOGGLE
  // =====================
  const menuBtn = document.getElementById("menuBtn")
  const panel = document.getElementById("filterPanel")

  if (menuBtn && panel) {
    menuBtn.addEventListener("click", () => {
      panel.style.display = panel.style.display === "flex" ? "none" : "flex"
    })
  }

  // =====================
  // GENERATE ALBUM
  // =====================
  const generateBtn = document.getElementById("generateBtn")

  if (generateBtn) {
    generateBtn.addEventListener("click", () => {

      const genre = document.getElementById("genre").value
      const era = document.getElementById("era").value
      const length = document.getElementById("length").value

      const album = generateAlbum(genre, era, length)

      albumQueue.push(album)
      currentIndex = albumQueue.length - 1

      renderAlbum(true)
    })
  }

  // =====================
  // SAVE ALBUM
  // =====================
  const saveBtn = document.getElementById("saveBtn")

  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {

      if (!currentAlbum) {
        alert("Generate an album first")
        return
      }

      const { data } = await supabase.auth.getSession()
      const user = data.session?.user

      if (!user) {
        alert("You must be logged in")
        return
      }

      const { error } = await supabase
        .from("album_walls")
        .insert([
          {
            user_id: user.id,
            title: currentAlbum.title,
            artist: currentAlbum.artist,
            genre: currentAlbum.genre,
            era: currentAlbum.era,
            image_url: currentAlbum.image || "",
            spotify_url: currentAlbum.spotify || ""
          }
        ])

      if (error) {
        alert(error.message)
      } else {
        alert("Saved to album wall")
        loadAlbums()
      }
    })
  }

  // =====================
  // NAVIGATION
  // =====================
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (isAnimating || albumQueue.length === 0) return

    if (currentIndex < albumQueue.length - 1) {
      currentIndex++
      animateTransition("right")
      setTimeout(() => renderAlbum(), 180)
    }
  })

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (isAnimating || albumQueue.length === 0) return

    if (currentIndex > 0) {
      currentIndex--
      animateTransition("left")
      setTimeout(() => renderAlbum(), 180)
    }
  })

  // =====================
  // LOGOUT
  // =====================
  const logoutBtn = document.getElementById("logoutBtn")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await logout()
      window.location.href = "/"
    })
  }

  // =====================
  // INIT
  // =====================
  init()

  async function init() {
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
      window.location.href = "/"
      return
    }

    loadAlbums()
  }

  // =====================
  // RENDER FUNCTION (SPOTIFY STYLE)
  // =====================
  function renderAlbum(animateIn = false) {

    if (albumQueue.length === 0) return

    currentAlbum = albumQueue[currentIndex]

    if (animateIn && card) {
      card.style.opacity = "0"
      card.style.transform = "translateX(40px)"
    }

    setTimeout(() => {

      titleEl.textContent = currentAlbum.title
      artistEl.textContent = currentAlbum.artist
      metaEl.textContent = `${currentAlbum.genre} • ${currentAlbum.era}`

      coverEl.style.background = "#222"

      if (animateIn && card) {
        card.style.opacity = "1"
        card.style.transform = "translateX(0)"
      }

    }, animateIn ? 120 : 0)
  }

  // =====================
  // TRANSITION ANIMATION
  // =====================
  function animateTransition(direction) {
    if (!card) return

    isAnimating = true

    card.style.transition = "all 0.18s ease"

    if (direction === "right") {
      card.style.transform = "translateX(-60px)"
      card.style.opacity = "0"
    } else {
      card.style.transform = "translateX(60px)"
      card.style.opacity = "0"
    }

    setTimeout(() => {
      card.style.transition = "all 0.35s ease"
      card.style.transform = "translateX(0)"
      card.style.opacity = "1"
      isAnimating = false
    }, 180)
  }

})


// =====================
// GENERATOR (SMART FILL)
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

  const finalArtistList = artists[finalGenre] || ["Unknown Artist"]
  const finalArtist = finalArtistList[Math.floor(Math.random() * finalArtistList.length)]

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    artist: finalArtist,
    genre: finalGenre,
    era: finalEra,
    image: "",
    spotify: ""
  }
}
