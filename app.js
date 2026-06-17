console.log("APP JS LOADED")

import { supabase, getUser, saveAlbum } from './supabase.js'

window.addEventListener("DOMContentLoaded", async () => {

  console.log("DOM READY")

  let user = null

  try {
    user = await getUser()
    console.log("USER:", user)
  } catch (err) {
    console.error("Supabase failed:", err)
  }

  const playBtn = document.getElementById("playBtn")

  if (playBtn) {
    playBtn.onclick = () => {
      alert("Play works with Supabase loaded")
    }
  }

})
