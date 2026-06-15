import { saveAlbum } from './supabase.js'

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("saveBtn").addEventListener("click", saveAlbum)
})
