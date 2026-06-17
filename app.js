import {
  supabase,
  saveAlbum,
  loadAlbums,
  logout,
  getUser
} from './supabase.js'

window.addEventListener("DOMContentLoaded", async () => {

  // =========================
  // SESSION CHECK
  // =========================
  const user = await getUser()

  if (!user) {
    window.location.href = "index.html"
    return
  }

  // =========================
  // ELEMENTS
  // =========================
  const homeView = document.getElementById("homeView")
  const profileView = document.getElementById("profileView")
  const friendsView = document.getElementById("friendsView")

  const drawer = document.getElementById("drawer")

  const albumCover = document.getElementById("albumCover")
  const albumTitle = document.getElementById("albumTitle")
  const albumMeta = document.getElementById("albumMeta")

  let currentAlbum = null
  let isPlaying = false

  // =========================
  // DRAWER (☰ MENU)
  // =========================
  const menuBtn = document.getElementById("menuBtn")

  if (menuBtn) {
    menuBtn.onclick = () => {
      drawer.style.display =
        drawer.style.display === "flex" ? "none" : "flex"
    }
  }

  // =========================
  // VIEW SWITCHING
  // =========================
  document.getElementById("profileBtn").onclick = () => {
    homeView.style.display = "none"
    friendsView.style.display = "none"
    profileView.style.display = "block"
    loadAlbums()
  }

  document.getElementById("friendsBtn").onclick = () => {
    homeView.style.display = "none"
    profileView.style.display = "none"
    friendsView.style.display = "block"
  }

  // back to home when clicking logo
  document.querySelector("div").onclick = () => {
    profileView.style.display = "none"
    friendsView.style.display = "none"
    homeView.style.display = "block"
  }

  // =========================
  // LOGOUT
  // =========================
  document.getElementById("logoutBtn").onclick = async () => {
    await logout()
    window.location.href = "index.html"
  }

  // =========================
  // ALBUM GENERATION (MOCK FOR NOW)
  // =========================
  document.getElementById("generateBtn")?.addEventListener("click", async () => {

    const genre = document.getElementById("genre")?.value || "Any"
    const era = document.getElementById("era")?.value || "Any"
    const length = document.getElementById("length")?.value || "Any"

    currentAlbum = {
      title: "Random Album " + Math.floor(Math.random() * 1000),
      artist: "Unknown Artist",
      genre,
      era,
      length,
      image: "",
      spotify: ""
    }

    albumTitle.textContent = currentAlbum.title
    albumMeta.textContent = `${genre} • ${era} • ${length}`

    albumCover.style.background = "#222"

    isPlaying = false
    document.getElementById("playBtn").textContent = "▶ Play"
  })

  // =========================
  // NOW PLAYING STATE
  // =========================
  document.getElementById("playBtn").onclick = () => {

    if (!currentAlbum) return

    isPlaying = !isPlaying

    document.getElementById("playBtn").textContent =
      isPlaying ? "⏸ Playing" : "▶ Play"

    currentAlbum.spotify = "https://open.spotify.com"
  }

  // =========================
  // SAVE TO WALL (LOCKED UNTIL PLAYED)
  // =========================
  document.getElementById("saveBtn")?.addEventListener("click", async () => {

    if (!currentAlbum) return

    if (!isPlaying) {
      alert("You must play the album before saving it.")
      return
    }

    await saveAlbum({
      ...currentAlbum,
      has_listened: true
    })

    alert("Saved to album wall")
    loadAlbums()
  })

  // =========================
  // PROFILE SAVE
  // =========================
  document.getElementById("saveProfileBtn")?.addEventListener("click", async () => {

    const username = document.getElementById("username").value

    await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        username
      })

    alert("Profile updated")
  })

})
