import { supabase, saveAlbum, getUser } from './supabase.js'

const LASTFM_KEY = "47339b6a3625cb91d909eedbf7fda6ad"

let currentAlbum = null
let playing = false

window.addEventListener("DOMContentLoaded", async () => {

  const user = await getUser()
  if (!user) location.href = "index.html"

  // NAV
  const home = document.getElementById("homeView")
  const profile = document.getElementById("profileView")
  const friends = document.getElementById("friendsView")

  document.getElementById("homeBtn").onclick = () => {
    home.style.display = "block"
    profile.style.display = "none"
    friends.style.display = "none"
  }

  document.getElementById("profileBtn").onclick = () => {
    home.style.display = "none"
    profile.style.display = "block"
    friends.style.display = "none"
  }

  document.getElementById("friendsBtn").onclick = () => {
    home.style.display = "none"
    profile.style.display = "none"
    friends.style.display = "block"
  }

  // GENERATE ALBUM (LAST.FM)
  document.getElementById("generateBtn").onclick = async () => {

    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=album.search&album=love&api_key=${LASTFM_KEY}&format=json`)
    const data = await res.json()

    const album = data.results.albummatches.album[0]

    currentAlbum = {
      title: album.name,
      artist: album.artist,
      image: album.image.at(-1)["#text"],
      spotify: `https://open.spotify.com/search/${encodeURIComponent(album.name)}`
    }

    document.getElementById("albumTitle").textContent = album.name
    document.getElementById("albumMeta").textContent = album.artist
    document.getElementById("albumCover").style.backgroundImage = `url(${currentAlbum.image})`
    document.getElementById("albumCover").style.backgroundSize = "cover"
  }

  // PLAY
  document.getElementById("playBtn").onclick = () => {
    if (!currentAlbum) return
    window.open(currentAlbum.spotify, "_blank")
    playing = true
  }

  // SAVE (locked until played)
  document.getElementById("saveBtn").onclick = async () => {
    if (!playing) return alert("Play first")

    await saveAlbum({
      title: currentAlbum.title,
      artist: currentAlbum.artist,
      image_url: currentAlbum.image,
      spotify_url: currentAlbum.spotify
    })

    alert("Saved")
  }

})
