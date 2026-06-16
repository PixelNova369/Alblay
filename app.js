import { supabase, saveAlbum, logout, loadAlbums } from './supabase.js'

window.addEventListener("DOMContentLoaded", () => {

  // =====================
  // STATE
  // =====================
  let currentAlbum = null

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
  const result = document.getElementById("result")

  if (generateBtn) {
    generateBtn.addEventListener("click", () => {

      const genre = document.getElementById("genre").value
      const era = document.getElementById("era").value
      const length = document.getElementById("length").value

      currentAlbum = generateAlbum(genre, era, length)

      result.innerHTML = `
        <div style="padding:20px; background:#1a1a1a; border-radius:12px;">
          <h2>${currentAlbum.title}</h2>
          <p>${currentAlbum.artist}</p>
          <p>${currentAlbum.genre} • ${currentAlbum.era}</p>
        </div>
      `
    })
  }

  // =====================
  // SAVE TO SUPABASE
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
            spotify_url: currentAlbum.spotify || "",
            has_listened: false
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
  // SESSION CHECK
  // =====================
  init()

  async function init() {
    const { data } = await supabase.auth.getSession()

    const onAppPage = window.location.pathname.includes("app.html")

    if (!data.session && onAppPage) {
      window.location.href = "/"
      return
    }

    if (data.session && onAppPage) {
      loadAlbums()
    }
  }

})


// =====================
// ALBUM GENERATOR
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
