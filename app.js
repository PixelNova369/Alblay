console.log("APP START")

import {
  sendFriendRequest,
  loadFriendRequests,
  loadFriends,
  sendAlbumToFriend,
  loadInbox
} from "./friends.js"

const albums = [
  { title: "Abbey Road", artist: "The Beatles", image: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg" },
  { title: "Dark Side of the Moon", artist: "Pink Floyd", image: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png" },
  { title: "Rumours", artist: "Fleetwood Mac", image: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG" }
]

let index = 0
let current = null

function render(i) {
  current = albums[i]

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")

  cover.style.opacity = 0

  setTimeout(() => {
    cover.style.backgroundImage = `url(${current.image})`
    title.textContent = current.title
    meta.textContent = current.artist
    cover.style.opacity = 1
  }, 150)
}

window.addEventListener("DOMContentLoaded", async () => {

  const $ = (id) => document.getElementById(id)

  // NAV
  function show(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"))
    $(page + "Page").classList.add("active")
  }

  $("homeBtn").onclick = () => show("home")
  $("friendsBtn").onclick = () => show("friends")
  $("profileBtn").onclick = () => show("profile")

  // DRAWER
  $("drawerBtn").onclick = () => document.getElementById("drawer").classList.add("open")
  $("closeDrawer").onclick = () => document.getElementById("drawer").classList.remove("open")

  // ALBUM CONTROLS
  $("nextBtn").onclick = () => { index = (index + 1) % albums.length; render(index) }
  $("prevBtn").onclick = () => { index = (index - 1 + albums.length) % albums.length; render(index) }
  $("generateBtn").onclick = () => { index = Math.floor(Math.random() * albums.length); render(index) }

  $("playBtn").onclick = () => {
    window.open(`https://open.spotify.com/search/${current.title + " " + current.artist}`)
  }

  // SEND FRIEND REQUEST
  $("sendFriendBtn").onclick = async () => {
    await sendFriendRequest($("friendIdInput").value)
    $("friendIdInput").value = ""
    loadFriendRequests()
    loadFriends()
  }

  // REAL ALBUM SEND
  $("sendAlbumBtn").onclick = async () => {
    const friendId = $("shareFriendId").value
    if (!friendId || !current) return

    await sendAlbumToFriend(friendId, current)
    alert("Album sent")
  }

  // PROFILE
  const saved = JSON.parse(localStorage.getItem("profile") || "{}")

  if (saved.username) $("namePreview").textContent = saved.username
  if (saved.avatar) $("avatarPreview").src = saved.avatar

  $("saveProfileBtn").onclick = () => {
    const profile = {
      username: $("usernameInput").value,
      avatar: $("avatarInput").value
    }

    localStorage.setItem("profile", JSON.stringify(profile))
    alert("Saved")
  }

  // LOAD
  await loadFriendRequests()
  await loadFriends()
  await loadInbox()

  render(0)
})
