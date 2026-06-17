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
  const bg = document.getElementById("bg")

  const nextBtn = document.getElementById("nextBtn")
  const prevBtn = document.getElementById("prevBtn")
  const playBtn = document.getElementById("playBtn")
  const generateBtn = document.getElementById("generateBtn")

  const genreFilter = document.getElementById("genreFilter")

  // =========================
  // LOAD REAL LAST.FM ALBUMS
  // =========================
  async function loadAlbums() {
    try {
      const res = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=chart.gettopalbums&api_key=${LASTFM_KEY}&format=json`
      )

      const data = await res.json()

      const raw = data?.albums?.album || []

      albums = raw.map(a => ({
        title: a.name,
        artist: a.artist?.name || a.artist,
        image: a.image?.[3]?.["#text"] || a.image?.[2]?.["#text"] || "",
        genre: [] // will be filled later if needed
      }))

      filtered = [...albums]

      render(0)

    } catch (err) {
      console.error("Last.fm failed", err)
    }
  }

  // =========================
  // REAL GENRE FETCH (LAST.FM TAGS)
  // =========================
  async function fetchGenreTags(artist, album) {
    try {
      const res = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${LASTFM_KEY}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`
      )

      const data = await res.json()
      const tags = data?.album?.tags?.tag || []

      return tags.map(t => t.name.toLowerCase())
    } catch {
      return []
    }
  }

  // =========================
  // FILTER SYSTEM
  // =========================
  async function applyGenreFilter(genre) {
    if (!genre || genre === "Any") {
      filtered = [...albums]
      render(0)
      return
    }

    const results = []

    for (let a of albums) {
      const tags = await fetchGenreTags(a.artist, a.title)

      if (tags.includes(genre.toLowerCase())) {
        results.push({ ...a, genre: tags })
      }
    }

    filtered = results.length ? results : albums
    index = 0
    render(0)
  }

  genreFilter?.addEventListener("change", (e) => {
    applyGenreFilter(e.target.value)
  })

  // =========================
  // RENDER WITH ANIMATION
  // =========================
  function render(i) {
    if (!filtered.length) return

    current = filtered[i]

    if (!current) return

    // fade animation
    cover.style.opacity = 0
    cover.style.transform = "scale(0.98)"

    setTimeout(() => {
      cover.style.backgroundImage = `url(${current.image})`
      title.textContent = current.title
      meta.textContent = current.artist

      bg.style.backgroundImage = `url(${current.image})`

      cover.style.opacity = 1
      cover.style.transform = "scale(1)"
    }, 180)
  }

  // =========================
  // CONTROLS
  // =========================
  nextBtn.onclick = () => {
    index = (index + 1) % filtered.length
    render(index)
  }

  prevBtn.onclick = () => {
    index = (index - 1 + filtered.length) % filtered.length
    render(index)
  }

  generateBtn.onclick = () => {
    index = Math.floor(Math.random() * filtered.length)
    render(index)
  }

  playBtn.onclick = () => {
    if (!current) return
    window.open(
      `https://open.spotify.com/search/${encodeURIComponent(current.title + " " + current.artist)}`,
      "_blank"
    )
  }

  // =========================
  // DRAWER (UNCHANGED SAFE)
  // =========================
  const drawer = document.getElementById("drawerPanel")
  const drawerBtn = document.getElementById("drawerBtn")
  const drawerBackBtn = document.getElementById("drawerBackBtn")

  let open = false

  const openDrawer = () => {
    open = true
    drawer.style.right = "0px"
  }

  const closeDrawer = () => {
    open = false
    drawer.style.right = "-320px"
  }

  drawerBtn.onclick = (e) => {
    e.stopPropagation()
    open ? closeDrawer() : openDrawer()
  }

  drawerBackBtn.onclick = closeDrawer

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
  // START
  // =========================
  loadAlbums()
}
