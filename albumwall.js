import { supabase } from './supabase.js'

export async function loadAlbumWall() {

  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData.session?.user

  if (!user) return

  const { data, error } = await supabase
    .from("album_walls")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return
  }

  const wall = document.getElementById("albumWall")
  if (!wall) return

  wall.innerHTML = ""

  data.forEach(album => {

    const card = document.createElement("div")

    card.style.width = "180px"
    card.style.background = "#111"
    card.style.borderRadius = "12px"
    card.style.padding = "10px"
    card.style.margin = "10px"
    card.style.display = "inline-block"
    card.style.verticalAlign = "top"
    card.style.cursor = "pointer"

    card.innerHTML = `
      <div style="
        width:100%;
        height:160px;
        background:#222;
        border-radius:8px;
        margin-bottom:10px;
      "></div>

      <div style="font-weight:bold; font-size:14px;">
        ${album.title}
      </div>

      <div style="font-size:12px; color:#aaa;">
        ${album.artist}
      </div>

      <div style="font-size:11px; color:#666;">
        ${album.genre} • ${album.era}
      </div>
    `

    wall.appendChild(card)
  })
}
