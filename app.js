console.log("APP START")

const LASTFM_KEY = "47339b6a3625cb91d909eedbf7fda6ad"

let albums = []
let filtered = []
let index = 0
let current = null

window.onload = () => {
  console.log("WINDOW LOADED")

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")

  // FIX: bg might not exist → prevents crash
  const bg = document.getElementById("bg") || document.body

  const nextBtn = document.getElementById("nextBtn")
  const prevBtn = document.getElementById("prevBtn")
  const playBtn = document.getElementById("playBtn")
  const generateBtn = document.getElementById("generateBtn")

  const genreFilter = document.getElementById("genreFilter")

  const drawer = document.getElementById("drawerPanel")
  const drawerBtn = document.getElementById("drawerBtn")
  const drawerBackBtn = document.getElementById("drawerBackBtn")

  let open = false

  // =========================
  // LOAD LAST.FM ALBUMS
  // =========================
  async function loadAlbums() {
    try {
      const res = await console.log("LASTFM KEY:", LASTFM_KEY)fetch(
        `https://ws.audioscrobbler.com/2.0/?method=chart.gettopalbums&api_key=${LASTFM_KEY}&format=json`
      )

      const data = await res.json()
      const raw = data?.albums?.album || []

      albums = raw.map(a => ({
        title: a.name || "Unknown",
        artist: a.artist?.name || a.artist || "Unknown Artist",
        image:
          a.image?.[3]?.["#text"] ||
          a.image?.[2]?.["#text"] ||
          a.image?.[1]?.["#text"] ||
          ""
      }))

      filtered = [...albums]
      render(0)

    } catch (err) {
      console.error("Last.fm failed", err)
    }
  }

  // =========================
  // RENDER (SAFE)
  // =========================
  function render(i) {
    if (!filtered.length) return

    current = filtered[i]
    if (!current) return

    cover.style.opacity = 0
    cover.style.transform = "scale(0.98)"

    setTimeout(() => {
      cover.style.backgroundImage = `url(${current.image})`
      title.textContent = current.title
      meta.textContent = current.artist

      bg.style.backgroundImage = `url(${current.image})`

      cover.style.opacity = 1
      cover.style.transform = "scale(1)"
    }, 150)
  }

  // =========================
  // CONTROLS (SAFE GUARDS)
  // =========================
  nextBtn?.addEventListener("click", () => {
    if (!filtered.length) return
    index = (index + 1) % filtered.length
    render(index)
  })

  prevBtn?.addEventListener("click", () => {
    if (!filtered.length) return
    index = (index - 1 + filtered.length) % filtered.length
    render(index)
  })

  generateBtn?.addEventListener("click", () => {
    if (!filtered.length) return
    index = Math.floor(Math.random() * filtered.length)
    render(index)
  })

  playBtn?.addEventListener("click", () => {
    if (!current) return
    window.open(
      `https://open.spotify.com/search/${encodeURIComponent(
        current.title + " " + current.artist
      )}`,
      "_blank"
    )
  })

  // =========================
  // DRAWER (FIXED + SAFE)
  // =========================
  const openDrawer = () => {
    open = true
    if (drawer) drawer.style.right = "0px"
  }

  const closeDrawer = () => {
    open = false
    if (drawer) drawer.style.right = "-320px"
  }

  drawerBtn?.addEventListener("click", (e) => {
    e.stopPropagation()
    open ? closeDrawer() : openDrawer()
  })

  drawerBackBtn?.addEventListener("click", closeDrawer)

  document.addEventListener("click", (e) => {
    if (!open) return
    if (drawer && !drawer.contains(e.target) && !drawerBtn.contains(e.target)) {
      closeDrawer()
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer()
  })

  // =========================
  // START APP
  // =========================
  loadAlbums()
}
