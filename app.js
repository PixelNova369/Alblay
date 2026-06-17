console.log("APP START")

import { supabase } from "./supabase.js"
import {
  sendFriendRequest,
  loadFriendRequests,
  loadFriends
} from "./friends.js"

window.onload = async () => {

  console.log("WINDOW LOADED")

  // =====================
  // FRIEND UI
  // =====================
  const friendInput = document.getElementById("friendIdInput")
  const sendFriendBtn = document.getElementById("sendFriendBtn")

  const shareInput = document.getElementById("shareFriendId")
  const shareBtn = document.getElementById("shareAlbumBtn")

  sendFriendBtn.onclick = async () => {
    if (!friendInput.value) return
    await sendFriendRequest(friendInput.value)
    friendInput.value = ""
  }

  // =====================
  // FRIEND SYSTEM LOAD
  // =====================
  await loadFriendRequests()
  await loadFriends()

  // =====================
  // SHARE ALBUM (placeholder for next phase)
  // =====================
  shareBtn.onclick = () => {
    alert("Album sharing system coming next phase")
  }
}
