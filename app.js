console.log("APP START")

import {
  sendFriendRequest,
  loadFriendRequests,
  loadFriends,
  sendAlbumToFriend,
  loadInbox
} from "./friends.js"

window.addEventListener("DOMContentLoaded", async () => {

  console.log("WINDOW LOADED")

  const $ = (id) => document.getElementById(id)

  // =====================
  // FRIEND REQUEST
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
  // ALBUM SHARE BUTTON
  // =====================
  $("shareAlbumBtn")?.addEventListener("click", async () => {
    const friendId = $("shareFriendId").value
    if (!friendId) return

    // TEMP MOCK ALBUM (we will connect real album later)
    const album = {
      title: "Sample Album",
      artist: "Alblay System",
      image: ""
    }

    await sendAlbumToFriend(friendId, album)
    alert("Album sent!")
  })

  // =====================
  // LOAD EVERYTHING
  // =====================
  await loadFriendRequests()
  await loadFriends()
  await loadInbox()

})
