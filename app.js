console.log("APP START")

window.onload = () => {
  console.log("WINDOW LOADED")

  // =====================
  // BUTTON TESTS
  // =====================
  const ids = [
    "playBtn",
    "nextBtn",
    "prevBtn",
    "saveBtn",
    "generateBtn",
    "homeBtn",
    "profileBtn",
    "friendsBtn"
  ]

  ids.forEach(id => {
    const el = document.getElementById(id)

    if (el) {
      el.onclick = () => alert(id + " WORKS")
    }
  })

  // =====================
  // DRAWER SYSTEM
  // =====================
  const drawerBtn = document.getElementById("drawerBtn")
  const drawerBackBtn = document.getElementById("drawerBackBtn")
  const drawer = document.getElementById("drawerPanel")

  let open = false

  const openDrawer = () => {
    open = true
    drawer.style.right = "0px"
  }

  const closeDrawer = () => {
    open = false
    drawer.style.right = "-320px"
  }

  if (drawerBtn && drawer) {
    drawerBtn.onclick = (e) => {
      e.stopPropagation()
      open ? closeDrawer() : openDrawer()
    }
  }

  if (drawerBackBtn) {
    drawerBackBtn.onclick = closeDrawer
  }

  document.addEventListener("click", (e) => {
    if (!open) return
    if (!drawer.contains(e.target) && !drawerBtn.contains(e.target)) {
      closeDrawer()
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer()
  })
}
