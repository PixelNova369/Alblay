import { supabase, saveAlbum, logout, getUser, loadAlbums } from './supabase.js'

// LOGIN BUTTON
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value

  await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "https://pixelnova369.github.io/Alblay/app.html"
    }
  })
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

  const onAppPage = window.location.pathname.includes("app.html")

  if (data.session && onAppPage) {
    loadAlbums()
  }

  if (!data.session && onAppPage) {
    window.location.href = "/"
  }
}

init()
