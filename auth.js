import { supabase } from './supabase.js'

window.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn")
  const signupBtn = document.getElementById("signupBtn")

  // =====================
  // LOGIN
  // =====================
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        alert(error.message)
      } else {
        window.location.href = "app.html"
      }
    })
  }

  // =====================
  // SIGNUP
  // =====================
  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      const { error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        alert(error.message)
      } else {
        alert("Account created. Now log in.")
      }
    })
  }

})
