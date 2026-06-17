import { supabase, saveAlbum, getUser } from './supabase.js'

const LASTFM_KEY = "47339b6a3625cb91d909eedbf7fda6ad"

let currentAlbum = null
let canSave = false
let albumList = []
let index = 0

window.addEventListener("DOMContentLoaded", async () => {

  const user = await getUser()
  if (!user) location.href = "index.html"

  const bg = document.getElementById("bg")
  const cover = document.getElementById("albumCover")
  const title = document.getElementById("albumTitle")
  const meta = document.getElementById("albumMeta")

  const home = document.getElementById("homeView")
  const profile = document.getElementById("profileView")
  const friends = document.getElementById("friendsView")

  // LOAD ALBUMS
  const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopalbums&api_key=${LASTFM_KEY}&format=json`)
  const data = await res.json()
  albumList = data.albums.album

  function render(i) {
    const a = albumList[i]

    currentAlbum = {
      title: a.name,
      artist: a.artist.name,
      image: a.image.at(-1)["#text"],
      spotify: `https://open.spotify.com/search/${encodeURIComponent(a.name)}`
    }

    // ANIMATED TRANSITION
    cover.style.opacity = 0

    setTimeout(() => {
      cover.style.backgroundImage = `url(${currentAlbum.image})`
      bg.style.backgroundImage = `url(${currentAlbum.image})`

      title.textContent = currentAlbum.title
      meta.textContent = currentAlbum.artist

      cover.style.opacity = 1
    }, 200)

    canSave = false
  }

  render(index)

  // NEXT / PREV (edge behavior)
  document.getElementById("nextBtn")?.addEventListener("click", () => {
    index = (index + 1) % albumList.length
    render(index)
  })

  document.getElementById("prevBtn")?.addEventListener("click", () => {
    index = (index - 1 + albumList.length) % albumList.length
    render(index)
  })

  // PLAY
  document.getElementById("playBtn").onclick = () => {
    window.open(currentAlbum.spotify, "_blank")
    setTimeout(() => canSave = true, 180000)
  }

  // SAVE
  document.getElementById("saveBtn").onclick = async () => {
    if (!canSave) return alert("Wait 3 minutes after playing")

    await saveAlbum({
      title: currentAlbum.title,
      artist: currentAlbum.artist,
      image_url: currentAlbum.image,
      spotify_url: currentAlbum.spotify
    })

    alert("Saved")
  }

  // DRAWER
  document.getElementById("menuBtn").onclick = () => {
    const d = document.getElementById("drawer")
    d.style.display = d.style.display === "block" ? "none" : "block"
  }

  // NAV FIXED
  document.getElementById("homeBtn").onclick = () => {
    home.style.display = "flex"
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

})
