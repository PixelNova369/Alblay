console.log("APP JS LOADED")

const LASTFM_KEY = "47339b6a3625cb91d909eedbf7fda6ad"

let albums = []
let index = 0
let current = null
let canSave = false

async function getUser() {
  return null
}

async function saveAlbum(album) {
  console.log("SAVE (mock):", album)
}

window.addEventListener("DOMContentLoaded", () => {

  console.log("DOM READY")

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")

  const nextBtn = document.getElementById("nextBtn")
  const prevBtn = document.getElementById("prevBtn")
  const playBtn = document.getElementById("playBtn")
  const saveBtn = document.getElementById("saveBtn")
  const generateBtn = document.getElementById("generateBtn")

  const homeBtn = document.getElementById("homeBtn")
  const profileBtn = document.getElementById("profileBtn")
  const friendsBtn = document.getElementById("friendsBtn")

  async function loadAlbums() {
    try {
      const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopalbums&api_key=${LASTFM_KEY}&format=json`)
      const data = await res.json()

      albums = data?.albums?.album || []
      console.log("Albums loaded:", albums.length)

      render(0)

    } catch (e) {
      console.error("Last.fm failed:", e)
    }
  }

  function render(i) {
    if (!albums.length) return

    const a = albums[i]

    current = {
      title: a.name,
      artist: a.artist?.name || "Unknown",
      image: a.image?.at(-1)?.["#text"] || "",
      spotify: `https://open.spotify.com/search/${encodeURIComponent(a.name)}`
    }

    if (cover) cover.style.backgroundImage = `url(${current.image})`
    if (title) title.textContent = current.title
    if (meta) meta.textContent = current.artist

    canSave = false
  }

  nextBtn?.addEventListener("click", () => {
    index = (index + 1) % albums.length
    render(index)
  })

  prevBtn?.addEventListener("click", () => {
    index = (index - 1 + albums.length) % albums.length
    render(index)
  })

  generateBtn?.addEventListener("click", () => {
    index = Math.floor(Math.random() * albums.length)
    render(index)
  })

  playBtn?.addEventListener("click", () => {
    if (!current) return
    window.open(current.spotify, "_blank")
    canSave = true
  })

  saveBtn?.addEventListener("click", () => {
    if (!current) return
    if (!canSave) return alert("Play first")

    saveAlbum(current)
  })

  homeBtn?.addEventListener("click", () => console.log("HOME"))
  profileBtn?.addEventListener("click", () => console.log("PROFILE"))
  friendsBtn?.addEventListener("click", () => console.log("FRIENDS"))

  loadAlbums()
})
