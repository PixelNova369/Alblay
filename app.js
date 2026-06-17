console.log("APP JS RUNNING")

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM READY")

  const ids = [
    "albumCover",
    "title",
    "meta",
    "nextBtn",
    "prevBtn",
    "playBtn",
    "saveBtn",
    "generateBtn"
  ]

  const elements = {}

  ids.forEach(id => {
    elements[id] = document.getElementById(id)
  })

  console.log("ELEMENTS:", elements)

  if (elements.playBtn) {
    elements.playBtn.onclick = () => alert("PLAY WORKS")
  }

  if (elements.nextBtn) {
    elements.nextBtn.onclick = () => alert("NEXT WORKS")
  }

  if (elements.prevBtn) {
    elements.prevBtn.onclick = () => alert("PREV WORKS")
  }

  if (elements.generateBtn) {
    elements.generateBtn.onclick = () => alert("GENERATE WORKS")
  }

  if (elements.saveBtn) {
    elements.saveBtn.onclick = () => alert("SAVE WORKS")
  }
})
