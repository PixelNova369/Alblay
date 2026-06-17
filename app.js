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
  // DRAWER MENU (FIXED)
  // =====================
  const drawerBtn = document.getElementById("drawerBtn")
  const drawer = document.getElementById("drawerPanel")

  let open = false

  if (drawerBtn && drawer) {
    drawerBtn.onclick = () => {
      open = !open
      drawer.style.right = open ? "0px" : "-300px"
    }
  }
}
