import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = "https://imsevturnvlegnmszuyx.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imltc2V2dHVybnZsZWdubXN6dXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MjA5NTEsImV4cCI6MjA5NzA5Njk1MX0.1auc5wncmyL7OukXaP13lmuhl_PuPCAIXAqADnztiGg"

export const supabase = createClient(supabaseUrl, supabaseKey)


// LOGIN
export async function login(email) {
  const res = await supabase.auth.signInWithOtp({ email })
  console.log(res)
  return res
}

// LOGOUT
export async function logout() {
  return await supabase.auth.signOut()
}

// GET USER
export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

// SAVE ALBUM
export async function saveAlbum(album) {
  const user = await getUser()

  return await supabase.from('albums').insert([
    {
      user_id: user.id,
      title: album.title,
      genre: album.genre,
      era: album.era,
      image_url: album.image
    }
  ])
}

// LOAD ALBUMS
export async function loadAlbums() {
  const { data } = await supabase
    .from('albums')
    .select("*")

  const wall = document.getElementById("albumWall")
  wall.innerHTML = ""

  data.forEach(a => {
    const div = document.createElement("div")

    div.style.border = "1px solid #ccc"
    div.style.padding = "10px"
    div.style.margin = "10px"
    div.style.borderRadius = "8px"
    div.style.maxWidth = "250px"

    div.innerHTML = `
      <img src="${a.image_url}" style="width:100%; border-radius:6px;" />
      <h3>${a.title}</h3>
      <p>${a.genre} • ${a.era}</p>
    `

    wall.appendChild(div)
  })
}
