console.log("app.js is loading")

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready")

  const testBtn = document.getElementById("testBtn")

  if (testBtn) {
    testBtn.addEventListener("click", () => {
      alert("BUTTON WORKS")
    })
  }
})
