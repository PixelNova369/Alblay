console.log("APP JS LOADED")

import { supabase, getUser, saveAlbum } from './supabase.js'

window.addEventListener("DOMContentLoaded", async () => {

  console.log("DOM READY")

  try {
    const user = await getUser()
    console.log("USER:", user)
  } catch (e) {
    console.error("GET USER FAILED:", e)
  }

  const el = (id) => document.getElementById(id)

  const cover = el("albumCover")
  const title = el("title")
  const meta = el("meta")

  const nextBtn = el("nextBtn")
  const prevBtn = el("prevBtn")
  const playBtn = el("playBtn")
  const saveBtn = el("saveBtn")
  const generateBtn = el("generateBtn")

  console.log("ELEMENT CHECK:", {
    cover, title, meta,
    nextBtn, prevBtn, playBtn, saveBtn, generateBtn
  })

  if (nextBtn) nextBtn.onclick = () => console.log("NEXT CLICK")
  if (prevBtn) prevBtn.onclick = () => console.log("PREV CLICK")
  if (playBtn) playBtn.onclick = () => console.log("PLAY CLICK")
  if (saveBtn) saveBtn.onclick = () => console.log("SAVE CLICK")
  if (generateBtn) generateBtn.onclick = () => console.log("GENERATE CLICK")

})
