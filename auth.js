import { supabase } from './supabase.js'

window.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn")
  const signupBtn = document.getElementById("signupBtn")

  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")

  if (!loginBtn || !signupBtn || !emailInput || !passwordInput) {
    console.error("Missing DOM elements")
    return
  }

  // =====================
  // LOGIN
  // =====================
  loginBtn.onclick = async () => {

    const email = emailInput.value.trim()
    const password = passwordInput.value

    if (!email || !password) {
      alert("Please enter email and password")
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
      return
    }

    window.location.href = "app.html"
  }


  // =====================
  // SIGNUP
  // =====================
  signupBtn.onclick = async () => {

    const email = emailInput.value.trim()
    const password = passwordInput.value

    if (!email || !password) {
      alert("Please enter email and password")
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert(error.message)
      return
    }

    alert("Account created — check your email if confirmation is enabled")
  }

})
