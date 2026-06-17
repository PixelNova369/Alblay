import { supabase } from './supabase.js'

window.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn")
  const signupBtn = document.getElementById("signupBtn")

  loginBtn.onclick = async () => {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) return alert(error.message)

    window.location.href = "app.html"
  }

  signupBtn.onclick = async () => {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) return alert(error.message)

    alert("Account created")
  }

})
