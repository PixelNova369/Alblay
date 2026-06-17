console.log("APP START")

window.onload = () => {
  console.log("WINDOW LOADED")

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
}
