console.log("APP START")

import {
  sendFriendRequest,
  loadFriendRequests,
  loadFriends
} from "./friends.js"

window.addEventListener("DOMContentLoaded", () => {

  console.log("WINDOW LOADED")

  // =====================
  // SAFE ELEMENT GETTER
  // =====================
  const $ = (id) => document.getElementById(id)

  // =====================
  // TAB SYSTEM
  // =====================
  const pages = {
    home: $("homePage"),
    friends: $("friendsPage"),
    profile: $("profilePage")
  }

  function show(page) {
    Object.values(pages).forEach(p => p.classList.remove("active"))
    pages[page].classList.add("active")
  }

  $("homeBtn")?.addEventListener("click", () => show("home"))
  $("friendsBtn")?.addEventListener("click", () => show("friends"))
  $("profileBtn")?.addEventListener("click", () => show("profile"))

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
  loadFriendRequests()
  loadFriends()

  // =====================
  // BASIC BUTTON TESTS (SAFE)
  // =====================
  $("playBtn")?.addEventListener("click", () => alert("Play"))
  $("nextBtn")?.addEventListener("click", () => alert("Next"))
  $("prevBtn")?.addEventListener("click", () => alert("Prev"))
  $("generateBtn")?.addEventListener("click", () => alert("Generate"))

})
