import { supabase, saveAlbum, getUser } from './supabase.js'

const LASTFM_KEY = "47339b6a3625cb91d909eedbf7fda6ad"

let currentAlbum = null
let playStart = null
let canSave = false
let albumIndex = 0
let albumList = []

window.addEventListener("DOMContentLoaded", async () => {

  const user = await getUser()
  if (!user) location.href = "index.html"

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("albumTitle")
  const meta = document.getElementById("albumMeta")

  // LOAD ALBUMS (seed list)
  async function loadAlbums() {
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopalbums&api_key=${LASTFM_KEY}&format=json`)
    const data = await res.json()
    albumList = data.albums.album
  }

  await loadAlbums()

  function render(album) {
    currentAlbum = {
      title: album.name,
      artist: album.artist.name,
      image: album.image.at(-1)["#text"],
      spotify: `https://open.spotify.com/search/${encodeURIComponent(album.name)}`
    }

    cover.style.backgroundImage = `url(${currentAlbum.image})`
    cover.style.backgroundSize = "cover"
    title.textContent = currentAlbum.title
    meta.textContent = currentAlbum.artist

    canSave = false
  }

  render(albumList[0])

  // NAV NEXT / PREV
  document.getElementById("nextBtn").onclick = () => {
    albumIndex = (albumIndex + 1) % albumList.length
    render(albumList[albumIndex])
  }

  document.getElementById("prevBtn").onclick = () => {
    albumIndex = (albumIndex - 1 + albumList.length) % albumList.length
    render(albumList[albumIndex])
  }

  // PLAY
  document.getElementById("playBtn").onclick = () => {
    if (!currentAlbum) return
    window.open(currentAlbum.spotify, "_blank")

    playStart = Date.now()
    canSave = false

    setTimeout(() => {
      canSave = true
    }, 180000) // 3 minutes
  }

  // SAVE
  document.getElementById("saveBtn").onclick = async () => {
    if (!currentAlbum) return
    if (!canSave) return alert("Wait 3 minutes after playing")

    await saveAlbum({
      title: currentAlbum.title,
      artist: currentAlbum.artist,
      image_url: currentAlbum.image,
      spotify_url: currentAlbum.spotify,
      has_listened: true
    })

    alert("Saved to Album Wall")
  }

  // DRAWER
  document.getElementById("menuBtn").onclick = () => {
    const d = document.getElementById("drawer")
    d.style.display = d.style.display === "block" ? "none" : "block"
  }

})
