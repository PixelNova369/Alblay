console.log("APP LOADED")

const $ = (id) => document.getElementById(id)

// --------------------
// NAV (FIXED)
// --------------------
function show(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
  $(page + "Page").classList.add("active")
}

// --------------------
// FRIENDS DATA (TEMP SAFE)
// --------------------
let friends = [
  { name:"Ethan" },
  { name:"Emma" },
  { name:"Ciaran" }
]

// --------------------
// RENDER FRIENDS
// --------------------
function renderFriends(){

  const box = $("friendsList")
  if(!box) return

  box.innerHTML = ""

  friends.forEach(f=>{

    const row = document.createElement("div")

    row.style.cssText = `
      display:flex;
      justify-content:space-between;
      padding:12px;
      margin:8px 0;
      background:#1a1a1a;
      border-radius:12px;
    `

    row.innerHTML = `
      <span>${f.name}</span>
      <button>Message</button>
    `

    box.appendChild(row)
  })
}

// --------------------
// INBOX (PLACEHOLDER SAFE)
// --------------------
function renderInbox(){

  const box = $("requestsBox")
  if(!box) return

  box.innerHTML = `
    <div style="padding:10px;background:#111;border-radius:10px;">
      No friend requests yet
    </div>
  `
}

// --------------------
// SEARCH FRIENDS
// --------------------
function setupSearch(){

  const btn = $("searchBtn")
  const input = $("searchFriend")
  const results = $("searchResults")

  if(!btn || !input || !results) return

  btn.onclick = () => {

    results.innerHTML = ""

    const fake = ["Alex", "Cathal", "Sarah"]

    fake.forEach(name=>{
      const div = document.createElement("div")

      div.style.cssText = `
        padding:10px;
        margin:6px 0;
        background:#222;
        border-radius:10px;
      `

      div.innerHTML = `${name} <button>Add</button>`

      results.appendChild(div)
    })
  }
}

// --------------------
// INIT (FORCED SAFE)
// --------------------
window.addEventListener("DOMContentLoaded", ()=>{

  console.log("DOM READY")

  // NAV FIX
  $("homeBtn")?.addEventListener("click", ()=>show("home"))
  $("friendsBtn")?.addEventListener("click", ()=>show("friends"))

  // FRIENDS
  renderFriends()
  renderInbox()
  setupSearch()
})
