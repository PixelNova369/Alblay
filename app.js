console.log("APP START")

const LASTFM_KEY = "47339b6a3625cb91d909eedbf7fda6ad"

let albums = []
let index = 0
let current = null

window.onload = () => {
  console.log("WINDOW LOADED")

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")
  const bg = document.getElementById("bg")

  const nextBtn = document.getElementById("nextBtn")
  const prevBtn = document.getElementById("prevBtn")
  const playBtn = document.getElementById("playBtn")
  const generateBtn = document.getElementById("generateBtn")

  // =========================
  // FILTER ELEMENTS (SAFE)
  // =========================
  const eraFilter = document.getElementById("eraFilter")
  const genreFilter = document.getElementById("genreFilter")
  const lengthFilter = document.getElementById("lengthFilter")

  // =========================
  // LOAD LAST.FM DATA
  // =========================
  async function loadAlbums() {
    try {
      const res = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=chart.gettopalbums&api_key=${LASTFM_KEY}&format=json`
      )

      const data = await res.json()
      const raw = data?.albums?.album || []

      albums = raw.map(a => ({
        title: a.name || "Unknown Album",
        artist: a.artist?.name || a.artist || "Unknown Artist",
        image:
          a.image?.[3]?.["#text"] ||
          a.image?.[2]?.["#text"] ||
          a.image?.[1]?.["#text"] ||
          ""
      }))

      console.log("Albums loaded:", albums.length)

      render(0)

    } catch (err) {
      console.error("Last.fm failed:", err)

      albums = [{
        title: "Offline Mode",
        artist: "No connection",
        image: ""
      }]

      render(0)
    }
  }

  // =========================
  // SAFE RENDER
  // =========================
  function render(i) {
    if (!albums.length) return

    current = albums[i]

    if (!current) return

    if (cover) cover.style.backgroundImage = `url(${current.image})`
    if (title) title.textContent = current.title
    if (meta) meta.textContent = current.artist

    if (bg) bg.style.backgroundImage = `url(${current.image})`

    cover.style.opacity = 0
    setTimeout(() => {
      cover.style.opacity = 1
    }, 120)
  }

  // =========================
  // CONTROLS
  // =========================
  nextBtn?.addEventListener("click", () => {
    index = (index + 1) % albums.length
    render(index)
  })

  prevBtn?.addEventListener("click", () => {
    index = (index - 1 + albums.length) % albums.length
    render(index)
  })

  generateBtn?.addEventListener("click", () => {
    index = Math.floor(Math.random() * albums.length)
    render(index)
  })

  playBtn?.addEventListener("click", () => {
    if (!current) return
    window.open(`https://open.spotify.com/search/${encodeURIComponent(current.title)}`, "_blank")
  })

  // =========================
  // DRAWER SYSTEM (SAFE)
  // =========================
  const drawer = document.getElementById("drawerPanel")
  const drawerBtn = document.getElementById("drawerBtn")
  const drawerBackBtn = document.getElementById("drawerBackBtn")

  let open = false

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
    if (!drawer.contains(e.target) && !drawerBtn.contains(e.target)) {
      closeDrawer()
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer()
  })

  // =========================
  // FILTERS (SAFE - NON-BREAKING)
  // =========================
  function applyFilters(list) {
    if (!list) return []

    let filtered = [...list]

    const genre = genreFilter?.value
    const era = eraFilter?.value

    // SAFE PLACEHOLDERS (no breaking logic)
    if (genre && genre !== "Any") {
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(genre.toLowerCase())
      )
    }

    if (era && era !== "Any") {
      filtered = filtered // placeholder (safe, no crash)
    }

    return filtered.length ? filtered : list
  }

  // hook filters safely
  eraFilter?.addEventListener("change", () => {
    albums = applyFilters(albums)
    render(0)
  })

  genreFilter?.addEventListener("change", () => {
    albums = applyFilters(albums)
    render(0)
  })

  // =========================
  // START APP
  // =========================
  loadAlbums()
}
