import { supabase, getUser, saveAlbum } from './supabase.js'

const LASTFM_KEY = "47339b6a3625cb91d909eedbf7fda6ad"

let albums = []
let index = 0
let current = null
let canSave = false

window.addEventListener("DOMContentLoaded", async () => {

  const user = await getUser()
  if (!user) location.href = "index.html"

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")

  // LOAD DATA
  async function load() {
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopalbums&api_key=${LASTFM_KEY}&format=json`)
    const data = await res.json()
    albums = data.albums.album
    render(0)
  }

  function render(i) {
    const a = albums[i]

    current = {
      title: a.name,
      artist: a.artist.name,
      image: a.image.at(-1)["#text"],
      spotify: `https://open.spotify.com/search/${encodeURIComponent(a.name)}`
    }

    cover.style.backgroundImage = `url(${current.image})`
    title.textContent = current.title
    meta.textContent = current.artist

    canSave = false
  }

  await load()

  // NEXT / PREV (CRITICAL FIXED)
  document.getElementById("nextBtn").onclick = () => {
    index = (index + 1) % albums.length
    render(index)
  }

  document.getElementById("prevBtn").onclick = () => {
    index = (index - 1 + albums.length) % albums.length
    render(index)
  }

  // PLAY
  document.getElementById("playBtn").onclick = () => {
    if (!current) return
    window.open(current.spotify, "_blank")
    setTimeout(() => canSave = true, 180000)
  }

  // SAVE
  document.getElementById("saveBtn").onclick = async () => {
    if (!canSave) return alert("Play for 3 minutes first")

    await saveAlbum({
      title: current.title,
      artist: current.artist,
      image_url: current.image,
      spotify_url: current.spotify
    })

    alert("Saved")
  }

  // NAV (PLACEHOLDER SAFE)
  document.getElementById("homeBtn").onclick = () => alert("Home loaded")
  document.getElementById("profileBtn").onclick = () => alert("Profile next step")
  document.getElementById("friendsBtn").onclick = () => alert("Friends next step")

  // LOGOUT
  document.getElementById("logoutBtn").onclick = async () => {
    await supabase.auth.signOut()
    location.href = "index.html"
  }

})
