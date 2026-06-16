import { supabase, logout } from './supabase.js'

const LASTFM_API_KEY = "47339b6a3625cb91d909eedbf7fda6ad"

window.addEventListener("DOMContentLoaded", () => {

  // =====================
  // STATE
  // =====================
  let albumQueue = []
  let currentIndex = -1
  let currentAlbum = null

  let canSave = true
  let listenTimer = null
  const LISTEN_DURATION = 180

  const card = document.getElementById("albumCard")
  const titleEl = document.getElementById("albumTitle")
  const artistEl = document.getElementById("albumArtist")
  const metaEl = document.getElementById("albumMeta")
  const coverEl = document.getElementById("albumCover")

  const playBtn = document.getElementById("playBtn")
  const saveBtn = document.getElementById("saveBtn")

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
  document.getElementById("generateBtn").addEventListener("click", async () => {

    const genre = document.getElementById("genre").value
    const era = document.getElementById("era").value
    const length = document.getElementById("length").value

    const album = await generateAlbum(genre, era, length)

    albumQueue.push(album)
    currentIndex = albumQueue.length - 1

    renderAlbum()
    animate()
  })

  // =====================
  // SAVE
  // =====================
  saveBtn.addEventListener("click", async () => {

    if (!currentAlbum) return alert("Generate an album first")

    if (!canSave) return alert("Finish listening first")

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
          era: currentAlbum.era,
          image_url: currentAlbum.image
        }
      ])

    if (error) alert(error.message)
    else alert("Saved")
  })

  // =====================
  // PLAY (SPOTIFY SEARCH + TIMER START)
  // =====================
  playBtn.addEventListener("click", () => {

    if (!currentAlbum) return

    const query = encodeURIComponent(`${currentAlbum.artist} ${currentAlbum.title}`)

    window.open(`https://open.spotify.com/search/${query}`, "_blank")

    startListening()
  })

  // =====================
  // NAV
  // =====================
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentIndex < albumQueue.length - 1) {
      currentIndex++
      renderAlbum()
      animate()
    }
  })

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--
      renderAlbum()
      animate()
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
  }

  // =====================
  // RENDER
  // =====================
  function renderAlbum() {

    currentAlbum = albumQueue[currentIndex]

    titleEl.textContent = currentAlbum.title
    artistEl.textContent = currentAlbum.artist
    metaEl.textContent = `${currentAlbum.genre} • ${currentAlbum.era}`

    if (currentAlbum.image) {
      coverEl.style.backgroundImage = `url(${currentAlbum.image})`
      coverEl.style.backgroundSize = "cover"
      coverEl.style.backgroundPosition = "center"
    } else {
      coverEl.style.background = "#222"
      coverEl.style.backgroundImage = "none"
    }
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
  // LISTENING TIMER
  // =====================
  function startListening() {

    canSave = false
    saveBtn.style.opacity = "0.4"
    saveBtn.style.pointerEvents = "none"

    clearInterval(listenTimer)

    let timeLeft = LISTEN_DURATION

    listenTimer = setInterval(() => {

      timeLeft--

      if (timeLeft <= 0) {
        clearInterval(listenTimer)
        canSave = true

        saveBtn.style.opacity = "1"
        saveBtn.style.pointerEvents = "auto"
      }

    }, 1000)
  }

})


// =====================
// GENERATOR + LAST.FM IMAGES
// =====================
async function generateAlbum(genre, era, length) {

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

  const finalArtist =
    artists[finalGenre][Math.floor(Math.random() * artists[finalGenre].length)]

  const finalTitle =
    titles[Math.floor(Math.random() * titles.length)]

  const image = await fetchAlbumImage(finalArtist, finalTitle)

  return {
    title: finalTitle,
    artist: finalArtist,
    genre: finalGenre,
    era: finalEra,
    image
  }
}

async function fetchAlbumImage(artist, album) {

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(album)}&api_key=${LASTFM_API_KEY}&format=json`
    )

    const data = await res.json()

    const match = data?.results?.albummatches?.album?.[0]

    const img =
      match?.image?.find(i => i.size === "extralarge") ||
      match?.image?.at(-1)

    return img?.["#text"] || ""

  } catch (e) {
    return ""
  }
}
