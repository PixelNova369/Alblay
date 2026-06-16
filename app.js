import { supabase, saveAlbum, logout, loadAlbums } from './supabase.js'

window.addEventListener("DOMContentLoaded", () => {

  // MENU TOGGLE (safe single version)
  const menuBtn = document.getElementById("menuBtn")
  const panel = document.getElementById("filterPanel")

  if (menuBtn && panel) {
    menuBtn.addEventListener("click", () => {
      panel.style.display = panel.style.display === "flex" ? "none" : "flex"
    })
  }

  // LOGIN (MAGIC LINK AUTH — Supabase OTP)
  const loginBtn = document.getElementById("loginBtn")

  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: "https://pixelnova369.github.io/Alblay/app.html"
        }
      })

      if (error) {
        alert(error.message)
      } else {
        alert("Check your email to log in")
      }
    })
  }

  // LOGOUT
  const logoutBtn = document.getElementById("logoutBtn")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await logout()
      window.location.href = "/"
    })
  }

  // SAVE ALBUM
  const saveBtn = document.getElementById("saveBtn")

  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {

      const title = document.getElementById("title")?.value
      const genre = document.getElementById("genre")?.value
      const era = document.getElementById("era")?.value
      const image = document.getElementById("image")?.value
      const spotify = document.getElementById("spotify")?.value

      if (!title || !genre) {
        alert("Missing required fields")
        return
      }

      await saveAlbum({
        title,
        genre,
        era,
        image,
        spotify,
        has_listened: false
      })

      loadAlbums()
    })
  }

  init()
})

async function init() {
  const { data } = await supabase.auth.getSession()

  const onAppPage = window.location.pathname.includes("app.html")

  // Redirect rules
  if (!data.session && onAppPage) {
    window.location.href = "/"
    return
  }

  if (data.session && onAppPage) {
    loadAlbums()
  }
}
