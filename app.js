alert("APP JS FILE IS LOADING")
console.log("APP JS STARTED")

const LASTFM_KEY = "47339b6a3625cb91d909eedbf7fda6ad"

let albums = []
let index = 0
let current = null
let canSave = false

// -------------------------
// SAFE STARTUP (NEVER BREAKS UI)
// -------------------------
window.addEventListener("DOMContentLoaded", () => {

  console.log("DOM READY")

  const el = (id) => document.getElementById(id)

  const cover = el("albumCover")
  const title = el("title")
  const meta = el("meta")

  const nextBtn = el("nextBtn")
  const prevBtn = el("prevBtn")
  const playBtn = el("playBtn")
  const saveBtn = el("saveBtn")
  const generateBtn = el("generateBtn")

  const homeBtn = el("homeBtn")
  const profileBtn = el("profileBtn")
  const friendsBtn = el("friendsBtn")

  // -------------------------
  // LAST.FM (SAFE LOADER)
  // -------------------------
  async function loadAlbums() {
    try {
      const res = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=chart.gettopalbums&api_key=${LASTFM_KEY}&format=json`
      )

      const data = await res.json()
      albums = data?.albums?.album || []

      console.log("Albums loaded:", albums.length)

      render(0)

    } catch (err) {
      console.log("Last.fm failed, using fallback")
      albums = [{
        name: "Fallback Album",
        artist: { name: "Unknown Artist" },
        image: [{ "#text": "" }]
      }]
      render(0)
    }
  }

  // -------------------------
  // RENDER
  // -------------------------
  function render(i) {
    const a = albums[i]
    if (!a) return

    current = {
      title: a.name,
      artist: a.artist?.name || "Unknown",
      image: a.image?.at(-1)?.["#text"] || "",
      spotify: `https://open.spotify.com/search/${encodeURIComponent(a.name)}`
    }

    if (cover) cover.style.backgroundImage = `url(${current.image})`
    if (title) title.textContent = current.title
    if (meta) meta.textContent = current.artist

    canSave = false
  }

  // -------------------------
  // CONTROLS (SAFE BINDING)
  // -------------------------
  const ids = [
  "albumCover",
  "title",
  "meta",
  "nextBtn",
  "prevBtn",
  "playBtn",
  "saveBtn",
  "generateBtn",
  "homeBtn",
  "profileBtn",
  "friendsBtn"
]

const el = {}
ids.forEach(id => {
  el[id] = document.getElementById(id)
  console.log(id, "=", el[id])
})

// HARD FAIL IF CORE BUTTONS MISSING
if (!el.playBtn || !el.nextBtn || !el.prevBtn) {
  alert("CRITICAL UI ERROR: buttons missing from HTML")
}

// SAFE BINDING
el.playBtn?.addEventListener("click", () => alert("PLAY WORKS"))
el.nextBtn?.addEventListener("click", () => alert("NEXT WORKS"))
el.prevBtn?.addEventListener("click", () => alert("PREV WORKS"))
el.generateBtn?.addEventListener("click", () => alert("GENERATE WORKS"))
el.saveBtn?.addEventListener("click", () => alert("SAVE WORKS"))

el.homeBtn?.addEventListener("click", () => console.log("HOME"))
el.profileBtn?.addEventListener("click", () => console.log("PROFILE"))
el.friendsBtn?.addEventListener("click", () => console.log("FRIENDS"))
  // -------------------------
  // BOTTOM NAV (SAFE)
  // -------------------------
  homeBtn?.addEventListener("click", () => console.log("HOME"))
  profileBtn?.addEventListener("click", () => console.log("PROFILE"))
  friendsBtn?.addEventListener("click", () => console.log("FRIENDS"))

  // -------------------------
  // START APP
  // -------------------------
  loadAlbums()
})
