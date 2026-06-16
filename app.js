import { supabase, logout } from './supabase.js'

const LASTFM_API_KEY = "47339b6a3625cb91d909eedbf7fda6ad"

let currentAlbum = null
let canSave = true

window.addEventListener("DOMContentLoaded", () => {

  const titleEl = document.getElementById("albumTitle")
  const artistEl = document.getElementById("albumArtist")
  const metaEl = document.getElementById("albumMeta")
  const coverEl = document.getElementById("albumCover")

  const saveBtn = document.getElementById("saveBtn")

  // LOGIN (FIXED)
  const loginBtn = document.getElementById("loginBtn")
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) alert(error.message)
      else window.location.href = "app.html"
    })
  }

  // LOGOUT
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await logout()
      window.location.href = "index.html"
    })
  }

  // GENERATE
  document.getElementById("generateBtn").addEventListener("click", async () => {
    currentAlbum = await generateAlbum()
    renderAlbum()
  })

  // PLAY
  document.getElementById("playBtn").addEventListener("click", () => {

    if (!currentAlbum) return

    const q = encodeURIComponent(`${currentAlbum.artist} ${currentAlbum.title}`)
    window.open(`https://open.spotify.com/search/${q}`, "_blank")

    startTimer()
  })

  // SAVE
  saveBtn.addEventListener("click", async () => {

    if (!currentAlbum) return
    if (!canSave) return alert("Wait until listening finishes")

    const { data } = await supabase.auth.getSession()
    const user = data.session?.user

    if (!user) return alert("Not logged in")

    await supabase.from("album_walls").insert([
      {
        user_id: user.id,
        ...currentAlbum
      }
    ])

    alert("Saved!")
  })

})

// =====================
// GENERATE ALBUM
// =====================
async function generateAlbum() {

  const genres = ["Rock", "Pop", "Hip Hop", "Electronic"]
  const artists = {
    Rock: ["Arctic Monkeys", "Oasis"],
    Pop: ["Dua Lipa", "The Weeknd"],
    "Hip Hop": ["Drake", "Kendrick Lamar"],
    Electronic: ["Daft Punk", "Calvin Harris"]
  }

  const titles = ["Neon Drift", "Midnight Signals", "Echoes"]

  const genre = genres[Math.floor(Math.random() * genres.length)]
  const artist = artists[genre][Math.floor(Math.random() * artists[genre].length)]
  const title = titles[Math.floor(Math.random() * titles.length)]

  const image = await fetchImage(artist, title)

  return { genre, artist, title, image }
}

// =====================
// LAST.FM IMAGE
// =====================
async function fetchImage(artist, album) {

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(album)}&api_key=${LASTFM_API_KEY}&format=json`
    )

    const data = await res.json()

    const match = data?.results?.albummatches?.album?.[0]

    return match?.image?.at(-1)?.["#text"] || ""

  } catch {
    return ""
  }
}

// =====================
// RENDER
// =====================
function renderAlbum() {

  const titleEl = document.getElementById("albumTitle")
  const artistEl = document.getElementById("albumArtist")
  const metaEl = document.getElementById("albumMeta")
  const coverEl = document.getElementById("albumCover")

  titleEl.textContent = currentAlbum.title
  artistEl.textContent = currentAlbum.artist
  metaEl.textContent = currentAlbum.genre

  coverEl.style.backgroundImage = currentAlbum.image
    ? `url(${currentAlbum.image})`
    : ""
  coverEl.style.backgroundSize = "cover"
  coverEl.style.backgroundPosition = "center"
}

// =====================
// TIMER (3 MIN LOCK)
// =====================
function startTimer() {

  canSave = false
  const saveBtn = document.getElementById("saveBtn")

  saveBtn.style.opacity = "0.5"

  setTimeout(() => {
    canSave = true
    saveBtn.style.opacity = "1"
  }, 180000)
}
