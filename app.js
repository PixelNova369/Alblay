console.log("JS FILE STARTED")

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM LOADED")

  document.body.style.background = "green"

  const btn = document.getElementById("playBtn")

  console.log("playBtn exists?", btn)

  if (btn) {
    btn.onclick = () => {
      alert("BUTTON WORKS")
    }
  }
})
