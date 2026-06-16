import { supabase, saveAlbum, logout, loadAlbums } from './supabase.js'

window.addEventListener("DOMContentLoaded", () => {

  // LOGIN
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
        alert("Check your email")
      }
    })
  }

  // SAVE ALBUM
  const saveBtn = document.getElementById("saveBtn")
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {

      const genre = document.getElementById("genre").value
      const era = document.getElementById("era").value
      const image = document.getElementById("image").value

      await saveAlbum({ title, genre, era, image })
      loadAlbums()
    })
  }

  // LOGOUT
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await logout()
      location.href = "/"
    })
  }
document.getElementById("menuBtn").addEventListener("click", () => {
  const panel = document.getElementById("filterPanel")
  panel.style.display = panel.style.display === "none" ? "flex" : "none"
})
const hasListened = false
 {
  title,
  genre,
  era,
  image,
  spotify,
  has_listened: false
} 
  // SESSION CHECK
  init()
})

async function init() {
  const { data } = await supabase.auth.getSession()

  const onAppPage = window.location.pathname.includes("app.html")

  if (data.session && onAppPage) {
    loadAlbums()
  }

  if (!data.session && onAppPage) {
    window.location.href = "/"
  }
}
