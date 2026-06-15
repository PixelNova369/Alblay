import { supabase, saveAlbum, login, logout, getUser, loadAlbums } from './supabase.js'

// LOGIN
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value
  const { error } = await login(email)

  document.getElementById("auth-status").innerText =
    error ? error.message : "Login link sent!"
})

// SAVE ALBUM
document.getElementById("saveBtn").addEventListener("click", async () => {
  const title = document.getElementById("title").value
  const genre = document.getElementById("genre").value
  const era = document.getElementById("era").value

  await saveAlbum({ title, genre, era })
  loadAlbums()
})

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await logout()
  location.reload()
})

// AUTH CHECK ON LOAD
async function init() {
  const user = await getUser()

  if (user) {
    document.getElementById("auth-section").style.display = "none"
    document.getElementById("app-section").style.display = "block"
    loadAlbums()
  }
}

init()
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    document.getElementById("auth-section").style.display = "none"
    document.getElementById("app-section").style.display = "block"
  }
})
