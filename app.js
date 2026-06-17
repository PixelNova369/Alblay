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
  },
  {
    title: "Born in the U.S.A.",
    artist: "Bruce Springsteen",
    image: "https://upload.wikimedia.org/wikipedia/en/0/0c/Born_in_the_U.S.A._album.jpg"
  }
]

let index = 0
let current = null

// =====================
// BACKGROUND UPDATE
// =====================
function updateBackground(img) {
  document.body.style.setProperty(
    "--bg",
    `url(${img})`
  )
  document.body.style.backgroundImage = `url(${img})`
  document.body.style.backgroundSize = "cover"
  document.body.style.backgroundPosition = "center"
}

// =====================
// RENDER ALBUM
// =====================
function render(i) {
  current = albums[i]

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")

  if (!current) return

  cover.style.opacity = 0
  cover.style.transform = "scale(0.95)"

  setTimeout(() => {
    cover.style.backgroundImage = `url(${current.image})`
    title.textContent = current.title
    meta.textContent = current.artist

    updateBackground(current.image)

    cover.style.opacity = 1
    cover.style.transform = "scale(1)"
  }, 150)
}

// =====================
// MAIN APP
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

  // =====================
  // LOAD FRIEND DATA
  // =====================
  await loadFriendRequests()
  await loadFriends()
  await loadInbox()

  // =====================
  // NAV SYSTEM
  // =====================
  function show(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"))
    $(page + "Page").classList.add("active")
  }

  $("homeBtn")?.addEventListener("click", () => show("home"))
  $("friendsBtn")?.addEventListener("click", () => show("friends"))
  $("profileBtn")?.addEventListener("click", () => show("profile"))

  // =====================
  // START
  // =====================
  render(0)
})
