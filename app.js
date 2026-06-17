console.log("APP START")

window.onload = () => {
  console.log("WINDOW LOADED")

  // =====================
  // BUTTON TEST BINDING
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
    console.log(id, el)

    if (el) {
      el.onclick = () => alert(id + " WORKS")
    }
  })

  // =====================
  // DRAWER MENU (FULLY INTEGRATED)
  // =====================
  const drawerBtn = document.getElementById("drawerBtn")
  const drawer = document.getElementById("drawerPanel")

  let open = false

  if (drawerBtn && drawer) {

    // OPEN / CLOSE TOGGLE
    drawerBtn.onclick = (e) => {
      e.stopPropagation()

      open = !open
      drawer.style.right = open ? "0px" : "-320px"
    }

    // CLOSE WHEN CLICKING OUTSIDE
    document.addEventListener("click", (e) => {
      if (!open) return

      const clickedInsideDrawer = drawer.contains(e.target)
      const clickedButton = drawerBtn.contains(e.target)

      if (!clickedInsideDrawer && !clickedButton) {
        open = false
        drawer.style.right = "-320px"
      }
    })

    // ESC KEY CLOSE (mobile-friendly bonus)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        open = false
        drawer.style.right = "-320px"
      }
    })
  }
}
