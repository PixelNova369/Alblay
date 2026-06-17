console.log("APP START")

import {
  sendFriendRequest,
  loadFriendRequests,
  loadFriends,
  loadInbox
} from "./friends.js"

// =====================
// ALBUM DATABASE
// =====================
const albums = [
  {
    title: "Abbey Road",
    artist: "The Beatles",
    image: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg"
  },
  {
    title: "Led Zeppelin IV",
    artist: "Led Zeppelin",
    image: "https://upload.wikimedia.org/wikipedia/en/1/1f/Led_Zeppelin_-_Led_Zeppelin_IV.jpg"
  },
  {
    title: "Dark Side of the Moon",
    artist: "Pink Floyd",
    image: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png"
  },
  {
    title: "Hotel California",
    artist: "Eagles",
    image: "https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg"
  },
  {
    title: "Rumours",
    artist: "Fleetwood Mac",
    image: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG"
  }
]

let index = 0
let current = null

// =====================
// RENDER ALBUM (SPOTIFY STYLE)
// =====================
function render(i) {
  current = albums[i]

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")

  if (!current) return

  // OUT animation
  cover.style.opacity = "0"
  cover.style.transform = "translateY(10px) scale(0.96)"

  setTimeout(() => {

    // UPDATE CONTENT
    cover.style.backgroundImage = `url(${current.image})`
    title.textContent = current.title
    meta.textContent = current.artist

    // IN animation
    cover.style.opacity = "1"
    cover.style.transform = "translateY(0px) scale(1)"

    // BACKGROUND BLUR
    document.body.style.backgroundImage = `url(${current.image})`
    document.body.style.backgroundSize = "cover"
    document.body.style.backgroundPosition = "center"

  }, 180)
}

// =====================
// APP START
// =====================
window.addEventListener("DOMContentLoaded", async () => {

  console.log("WINDOW LOADED")

  const $ = (id) => document.getElementById(id)

  // =====================
  // ALBUM CONTROLS
  // =====================
  $("nextBtn")?.addEventListener("click", () => {
    index = (index + 1) % albums.length
    render(index)
  })

  $("prevBtn")?.addEventListener("click", () => {
    index = (index - 1 + albums.length) % albums.length
    render(index)
  })

  $("generateBtn")?.addEventListener("click", () => {
    index = Math.floor(Math.random() * albums.length)
    render(index)
  })

  $("playBtn")?.addEventListener("click", () => {
    if (!current) return
    window.open(
      `https://open.spotify.com/search/${encodeURIComponent(current.title + " " + current.artist)}`,
      "_blank"
    )
  })

  // =====================
  // FRIEND SYSTEM
  // =====================
  $("sendFriendBtn")?.addEventListener("click", async () => {
    const id = $("friendIdInput").value
    if (!id) return

    await sendFriendRequest(id)
    $("friendIdInput").value = ""

    await loadFriendRequests()
    await loadFriends()
  })

  await loadFriendRequests()
  await loadFriends()
  await loadInbox()

  // =====================
  // NAVIGATION
  // =====================
  function show(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"))
    $(page + "Page").classList.add("active")
  }

  $("homeBtn")?.addEventListener("click", () => show("home"))
  $("friendsBtn")?.addEventListener("click", () => show("friends"))
  $("profileBtn")?.addEventListener("click", () => show("profile"))

  // =====================
  // PROFILE SYSTEM
  // =====================
  const usernameInput = $("usernameInput")
  const avatarInput = $("avatarInput")

  const namePreview = $("namePreview")
  const avatarPreview = $("avatarPreview")

  const saved = JSON.parse(localStorage.getItem("profile") || "{}")

  if (saved.username) namePreview.textContent = saved.username
  if (saved.avatar) avatarPreview.src = saved.avatar

  usernameInput?.addEventListener("input", () => {
    namePreview.textContent = usernameInput.value || "Guest"
  })

  avatarInput?.addEventListener("input", () => {
    avatarPreview.src = avatarInput.value
  })

  $("saveProfileBtn")?.addEventListener("click", () => {
    const profile = {
      username: usernameInput.value,
      avatar: avatarInput.value
    }

    localStorage.setItem("profile", JSON.stringify(profile))
    alert("Profile saved")
  })

  // =====================
  // INIT
  // =====================
  render(0)
})
