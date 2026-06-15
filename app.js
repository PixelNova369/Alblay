import { supabase, saveAlbum, logout, getUser, loadAlbums } from './supabase.js'

// LOGIN BUTTON
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value
  await supabase.auth.signInWithOtp({ email })
})

// SAVE ALBUM
document.getElementById("saveBtn").addEventListener("click", async () => {
  const title = document.getElementById("title").value
  const genre = document.getElementById("genre").value
  const era = document.getElementById("era").value
  const image = document.getElementById("image").value

  await saveAlbum({ title, genre, era, image })
  loadAlbums()
})

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await logout()
  location.reload()
})

// SESSION CHECK ON LOAD
async function init() {
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    document.getElementById("auth-section").style.display = "none"
    document.getElementById("app-section").style.display = "block"
    loadAlbums()
  } else {
    document.getElementById("auth-section").style.display = "flex"
    document.getElementById("app-section").style.display = "none"
  }
}

init()
