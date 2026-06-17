console.log("APP JS STARTED")

import { supabase, getUser, saveAlbum } from './supabase.js'

const LASTFM_KEY = "47339b6a3625cb91d909eedbf7fda6ad"

let albums = []
let index = 0
let current = null
let canSave = false

window.addEventListener("DOMContentLoaded", async () => {

  console.log("DOM READY")

  const user = await getUser().catch(err => {
    console.error("Supabase error:", err)
    return null
  })

  if (!user) {
    console.log("No user found")
    // optional redirect
    // location.href = "index.html"
  }

  // SAFE ELEMENT GETTER
  const get = (id) => document.getElementById(id)

  const cover = get("albumCover")
  const title = get("title")
  const meta = get("meta")

  const nextBtn = get("nextBtn")
  const prevBtn = get("prevBtn")
  const playBtn = get("playBtn")
  const saveBtn = get("saveBtn")
  const generateBtn = get("generateBtn")

  console.log("Buttons loaded:", {
    nextBtn, prevBtn, playBtn, saveBtn, generateBtn
  })

  // LOAD ALBUMS
  async function loadAlbums() {
    try {
      const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopalbums&api_key=${LASTFM_KEY}&format=json`)
      const data = await res.json()

      albums = data?.albums?.album || []

      console.log("Albums loaded:", albums.length)

      render(0)

    } catch (err) {
      console.error("Album load failed:", err)
    }
  }

  function render(i) {
    if (!albums.length) return

    const a = albums[i]

    if (!a) return

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

    console.log("Rendered:", current)
  }

  // BUTTON SAFETY BINDING
  if (nextBtn) {
    nextBtn.onclick = () => {
      index = (index + 1) % albums.length
      render(index)
    }
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      index = (index - 1 + albums.length) % albums.length
      render(index)
    }
  }

  if (generateBtn) {
    generateBtn.onclick = () => {
      index = Math.floor(Math.random() * albums.length)
      render(index)
    }
  }

  if (playBtn) {
    playBtn.onclick = () => {
      if (!current) return
      window.open(current.spotify, "_blank")
      canSave = true
    }
  }

  if (saveBtn) {
    saveBtn.onclick = async () => {
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
      } catch (err) {
        console.error(err)
      }
    }
  }

  await loadAlbums()

})
