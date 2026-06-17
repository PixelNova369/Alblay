import { supabase, getUser, saveAlbum } from './supabase.js'

const LASTFM_KEY = "47339b6a3625cb91d909eedbf7fda6ad"

let albums = []
let index = 0
let current = null
let canSave = false

window.addEventListener("DOMContentLoaded", async () => {

  const user = await getUser()
  if (!user) location.href = "index.html"

  // ELEMENTS
  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")

  const home = document.getElementById("homeView")
  const profile = document.getElementById("profileView")
  const friends = document.getElementById("friendsView")

  // LOAD ALBUMS
  async function loadAlbums() {
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

  await loadAlbums()

  // NEXT / PREV (NOW FIXED)
  document.getElementById("nextBtn").onclick = () => {
    index = (index + 1) % albums.length
    render(index)
  }

  document.getElementById("prevBtn").onclick = () => {
    index = (index - 1 + albums.length) % albums.length
    render(index)
  }

  // GENERATE (reshuffle)
  document.getElementById("generateBtn").onclick = () => {
    index = Math.floor(Math.random() * albums.length)
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
    if (!canSave) return alert("Play 3 minutes first")

    await saveAlbum({
      title: current.title,
      artist: current.artist,
      image_url: current.image,
      spotify_url: current.spotify
    })

    alert("Saved")
  }

  // DRAWER (NOW WORKING AGAIN)
  document.getElementById("menuBtn").onclick = () => {
    const d = document.getElementById("drawer")
    d.style.display = d.style.display === "block" ? "none" : "block"
  }

  // NAV (WORKING)
  document.getElementById("homeBtn").onclick = () => {
    home.style.display = "block"
    profile.style.display = "none"
    friends.style.display = "none"
  }

  document.getElementById("profileBtn").onclick = async () => {
    home.style.display = "none"
    profile.style.display = "block"
    friends.style.display = "none"

    loadWall()
  }

  document.getElementById("friendsBtn").onclick = () => {
    home.style.display = "none"
    profile.style.display = "none"
    friends.style.display = "block"
  }

  // WALL
  async function loadWall() {
    const { data } = await supabase
      .from("album_walls")
      .select("*")

    const wall = document.getElementById("albumWall")
    wall.innerHTML = ""

    data.forEach(a => {
      const div = document.createElement("div")
      div.style = "background:#111; margin:10px; padding:10px; border-radius:10px;"

      div.innerHTML = `
        <img src="${a.image_url}" style="width:100%; border-radius:10px;">
        <p>${a.title}</p>
        <p>${a.artist}</p>
      `

      wall.appendChild(div)
    })
  }

})
