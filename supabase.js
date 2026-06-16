import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = "https://imsevturnvlegnmszuyx.supabase.co"
const supabaseKey = "YOUR_ANON_KEY_HERE"

export const supabase = createClient(supabaseUrl, supabaseKey)


// =====================
// AUTH
// =====================

export async function login(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  })
}

export async function signup(email, password) {
  return await supabase.auth.signUp({
    email,
    password
  })
}

export async function logout() {
  return await supabase.auth.signOut()
}

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

  return await supabase
    .from('album_walls')
    .insert([
      {
        user_id: user.id,
        title: album.title,
        genre: album.genre,
        era: album.era,
        image_url: album.image || "",
        spotify_url: album.spotify || "",
        has_listened: album.has_listened || false
      }
    ])
}


// LOAD ALBUMS
export async function loadAlbums() {
  const user = await getUser()

  if (!user) return

  const { data, error } = await supabase
    .from('album_walls')
    .select("*")
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return
  }

  const wall = document.getElementById("albumWall")
  if (!wall) return

  wall.innerHTML = ""

  data.forEach(album => {
    const div = document.createElement("div")

    div.style.border = "1px solid #333"
    div.style.padding = "12px"
    div.style.margin = "10px"
    div.style.borderRadius = "10px"
    div.style.maxWidth = "260px"
    div.style.background = "#111"

    div.innerHTML = `
      ${album.image_url ? `<img src="${album.image_url}" style="width:100%; border-radius:6px;">` : ""}
      <h3>${album.title}</h3>
      <p>${album.artist || ""}</p>
      <p>${album.genre} • ${album.era}</p>
    `

    wall.appendChild(div)
  })
}
