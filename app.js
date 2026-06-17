console.log("APP START")

import { supabase } from "./supabase.js"

let albums = []
let index = 0
let current = null

window.onload = async () => {
  console.log("WINDOW LOADED")

  const cover = document.getElementById("albumCover")
  const title = document.getElementById("title")
  const meta = document.getElementById("meta")
  const bg = document.body

  const nextBtn = document.getElementById("nextBtn")
  const prevBtn = document.getElementById("prevBtn")
  const playBtn = document.getElementById("playBtn")
  const generateBtn = document.getElementById("generateBtn")

  const drawer = document.getElementById("drawerPanel")
  const drawerBtn = document.getElementById("drawerBtn")
  const drawerBackBtn = document.getElementById("drawerBackBtn")

  let open = false

  // =========================
  // LOAD FROM SUPABASE
  // =========================
  async function loadAlbums() {
    const { data, error } = await supabase
      .from("albums_master")
      .select("*")

    if (error) {
      console.error("Supabase error:", error)
      title.textContent = "Failed to load albums"
      return
    }

    albums = data || []

    if (!albums.length) {
      title.textContent = "No albums found"
      return
    }

    render(0)
  }

  // =========================
  // RENDER
  // =========================
  function render(i) {
    if (!albums.length) return

    current = albums[i]
    if (!current) return

    cover.style.opacity = 0
    cover.style.transform = "scale(0.98)"

    setTimeout(() => {
      cover.style.backgroundImage = `url(${current.cover_url})`
      title.textContent = current.title
      meta.textContent = `${current.artist} • ${current.genre}`

      bg.style.backgroundImage = `url(${current.cover_url})`

      cover.style.opacity = 1
      cover.style.transform = "scale(1)"
    }, 150)
  }

  // =========================
  // CONTROLS
  // =========================
  nextBtn?.addEventListener("click", () => {
    if (!albums.length) return
    index = (index + 1) % albums.length
    render(index)
  })

  prevBtn?.addEventListener("click", () => {
    if (!albums.length) return
    index = (index - 1 + albums.length) % albums.length
    render(index)
  })

  generateBtn?.addEventListener("click", () => {
    if (!albums.length) return
    index = Math.floor(Math.random() * albums.length)
    render(index)
  })

  playBtn?.addEventListener("click", () => {
    if (!current?.spotify_url) return
    window.open(current.spotify_url, "_blank")
  })

  // =========================
  // DRAWER
  // =========================
  const openDrawer = () => {
    open = true
    if (drawer) drawer.style.right = "0px"
  }

  const closeDrawer = () => {
    open = false
    if (drawer) drawer.style.right = "-300px"
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
  // START
  // =========================
  loadAlbums()
}
