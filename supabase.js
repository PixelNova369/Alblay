import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = "https://imsevturnvlegnmszuyx.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltc2V2dHVybnZsZWdubXN6dXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MjA5NTEsImV4cCI6MjA5NzA5Njk1MX0.1auc5wncmyL7OukXaP13lmuhl_PuPCAIXAqADnztiGg"

export const supabase = createClient(supabaseUrl, supabaseKey)


// =====================
// AUTH (EMAIL + PASSWORD)
// =====================

// LOGIN
export async function login(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  })
}

// SIGN UP
export async function signup(email, password) {
  return await supabase.auth.signUp({
    email,
    password
  })
}

// LOGOUT
export async function logout() {
  return await supabase.auth.signOut()
}

// GET USER
export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}


// =====================
// ALBUMS
// =====================

// SAVE ALBUM
export async function saveAlbum(album) {
  const user = await getUser()

  if (!user) {
    console.error("No user logged in")
    return
  }

  return await supabase.from('albums').insert([
    {
      user_id: user.id,
      title: album.title,
      genre: album.genre,
      era: album.era,
      image_url: album.image || ""
    }
  ])
}


// LOAD ALBUMS
export async function loadAlbums() {
  const { data, error } = await supabase
    .from('albums')
    .select("*")

  if (error) {
    console.error(error)
    return
  }

  const wall = document.getElementById("albumWall")
  if (!wall) return

  wall.innerHTML = ""

  data.forEach(a => {
    const div = document.createElement("div")

    div.style.border = "1px solid #333"
    div.style.padding = "12px"
    div.style.margin = "10px"
    div.style.borderRadius = "10px"
    div.style.maxWidth = "260px"
    div.style.background = "#111"

    div.innerHTML = `
      <img src="${a.image_url || ''}" style="width:100%; border-radius:6px
