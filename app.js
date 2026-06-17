console.log("APP JS LOADED")

import { getUser, saveAlbum } from './supabase.js'

const LASTFM_KEY = "47339b6a3625cb91d909eedbf7fda6ad"

let albums = []
let index = 0
let current = null
let canSave = false

window.addEventListener("DOMContentLoaded", async () => {

  console.log("DOM READY")

  // =====================
  // SAFE USER LOAD
  // =====================
  try {
    const user = await getUser()
    console.log("USER:", user)
  } catch (e) {
    console.log("User load failed (non-blocking)")
  }

  // =====================
  // ELEMENTS
  // =====================
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

  // =====================
  // LAST.FM LOAD
  // =====================
  async function loadAlbums() {
    try {
      const res = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=chart.gettopalbums&api_key=${LASTFM_KEY}&format=json`
      )

      const data = await res.json()
      albums = data?.albums?.album || []

      console.log("Albums loaded:", albums.length)

      render(0)

    } catch (err) {
      console.error("Last.fm error:", err)
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

  // =====================
  // CONTROLS
  // =====================
  if (nextBtn) nextBtn.onclick = () => {
    index = (index + 1) % albums.length
    render(index)
  }

  if (prevBtn) prevBtn.onclick = () => {
    index = (index - 1 + albums.length) % albums.length
    render(index)
  }

  if (generateBtn) generateBtn.onclick = () => {
    index = Math.floor(Math.random() * albums.length)
    render(index)
  }

  if (playBtn) playBtn.onclick = () => {
    if (!current) return
    window.open(current.spotify, "_blank")
    canSave = true
  }

  if (saveBtn) saveBtn.onclick = async () => {
    if (!current) return
    if (!canSave) return alert("Play first")

    try {
      await saveAlbum({
        title: current.title,
        artist: current.artist,
        image_url: current.image,
        spotify_url: current.spotify
      })

      alert("Saved")
    } catch (e) {
      console.error("Save error:", e)
    }
  }

  // =====================
  // BOTTOM NAV (FIXED)
  // =====================
  if (homeBtn) {
    homeBtn.onclick = () => {
      console.log("HOME")
    }
  }

  if (profileBtn) {
    profileBtn.onclick = () => {
      console.log("PROFILE")
    }
  }

  if (friendsBtn) {
    friendsBtn.onclick = () => {
      console.log("FRIENDS")
    }
  }

  // =====================
  // INIT
  // =====================
  loadAlbums()
})
