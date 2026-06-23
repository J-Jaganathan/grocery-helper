import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import {
    getAuth,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

// ── Firebase config ────────────────────────────────────
const firebaseConfig = {
    apiKey: "AIzaSyAqiwr8zsspv_rtHKqN_i984Ab9Aji9wdU",
    authDomain: "grocery-helper-j.firebaseapp.com",
    databaseURL: "https://grocery-helper-j-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "grocery-helper-j",
    storageBucket: "grocery-helper-j.firebasestorage.app",
    messagingSenderId: "362486509864",
    appId: "1:362486509864:web:16b5c2a65bef01d554a01d",
    measurementId: "G-XBFD425Z3V"
}

const app      = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth     = getAuth(app)

const googleProvider = new GoogleAuthProvider()
const yahooProvider  = new OAuthProvider("yahoo.com")

let shoppingListInDB = null

// ── DOM refs ───────────────────────────────────────────
const authScreen        = document.getElementById("auth-screen")
const appScreen         = document.getElementById("app-screen")
const loginBtn          = document.getElementById("login-btn")
const yahooBtn          = document.getElementById("yahoo-login-btn")
const logoutBtn         = document.getElementById("logout-btn")
const menuBtn           = document.getElementById("menu-btn")
const drawer            = document.getElementById("drawer")
const overlay           = document.getElementById("overlay")
const inputFieldEl      = document.getElementById("input-field")
const addButtonEl       = document.getElementById("add-button")
const shoppingListEl    = document.getElementById("shopping-list")
const loadingMessageEl  = document.getElementById("loading-message")
const editProfileBtn    = document.getElementById("edit-profile-btn")
const editProfileModal  = document.getElementById("edit-profile-modal")
const cancelEditBtn     = document.getElementById("cancel-edit-btn")
const saveProfileBtn    = document.getElementById("save-profile-btn")
const editNameInput     = document.getElementById("edit-name-input")
const editEmailInput    = document.getElementById("edit-email-input")
const toastEl           = document.getElementById("toast")

// ── Auth ───────────────────────────────────────────────
loginBtn.addEventListener("click", async () => {
    try {
        loginBtn.disabled = true
        loginBtn.textContent = "Redirecting…"
        await signInWithPopup(auth, googleProvider)
    } catch (error) {
        console.error(error)
        alert(error.message)
    } finally {
        loginBtn.disabled = false
        loginBtn.textContent = "Login with Google"
    }
})

yahooBtn.addEventListener("click", async () => {
    try {
        yahooBtn.disabled = true
        yahooBtn.textContent = "Redirecting…"
        await signInWithPopup(auth, yahooProvider)
    } catch (error) {
        console.error(error)
        alert(error.message)
    } finally {
        yahooBtn.disabled = false
        yahooBtn.textContent = "Login with Yahoo"
    }
})

logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth)
        closeDrawer()
    } catch (error) {
        console.error(error)
    }
})

onAuthStateChanged(auth, (user) => {
    if (user) {
        authScreen.style.display = "none"
        appScreen.style.display  = "block"

        loadingMessageEl.style.display = "block"
        shoppingListEl.innerHTML = ""

        syncDrawerUserInfo(user)

        // Persist profile snapshot to DB
        set(ref(database, `users/${user.uid}/profile`), {
            name:  user.displayName || "",
            email: user.email || ""
        })

        shoppingListInDB = ref(database, `users/${user.uid}/shoppingList`)
        loadShoppingList()

    } else {
        authScreen.style.display = "flex"
        appScreen.style.display  = "none"
    }
})

function syncDrawerUserInfo(user) {
    document.getElementById("user-name").textContent  = user.displayName || "No Name"
    document.getElementById("user-email").textContent = user.email       || "No Email"
}

// ── Shopping list ──────────────────────────────────────
addButtonEl.addEventListener("click", addItem)

// Enter key support
inputFieldEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addItem()
})

function addItem() {
    const value = inputFieldEl.value.trim().toLowerCase()
    if (!value || !shoppingListInDB) return
    push(shoppingListInDB, value)
    inputFieldEl.value = ""
    inputFieldEl.focus()
}

function loadShoppingList() {
    onValue(shoppingListInDB, (snapshot) => {
        loadingMessageEl.style.display = "none"
        shoppingListEl.innerHTML = ""

        if (snapshot.exists()) {
            const items = Object.entries(snapshot.val())
            items.forEach(appendItemToList)
        } else {
            // Use a <li> so the flex container isn't broken by raw text
            const empty = document.createElement("li")
            empty.textContent = "No items here… yet"
            empty.classList.add("empty-state")
            shoppingListEl.append(empty)
        }
    })
}

function appendItemToList([itemID, itemValue]) {
    const li = document.createElement("li")
    li.textContent = itemValue
    li.addEventListener("click", () => {
        remove(ref(database, `users/${auth.currentUser.uid}/shoppingList/${itemID}`))
    })
    shoppingListEl.append(li)
}

// ── Drawer ─────────────────────────────────────────────
menuBtn.addEventListener("click", () => {
    drawer.classList.contains("open") ? closeDrawer() : openDrawer()
})

overlay.addEventListener("click", closeDrawer)

function openDrawer() {
    drawer.classList.add("open")
    overlay.classList.add("show")
}

function closeDrawer() {
    drawer.classList.remove("open")
    overlay.classList.remove("show")
}

// ── Edit Profile ───────────────────────────────────────
editProfileBtn.addEventListener("click", () => {
    const user = auth.currentUser
    if (!user) return
    editNameInput.value  = user.displayName || ""
    editEmailInput.value = user.email       || ""
    closeDrawer()
    openModal()
})

cancelEditBtn.addEventListener("click", closeModal)

// Click outside modal box to dismiss
editProfileModal.addEventListener("click", (e) => {
    if (e.target === editProfileModal) closeModal()
})

saveProfileBtn.addEventListener("click", async () => {
    const user    = auth.currentUser
    const newName = editNameInput.value.trim()

    if (!user) return

    if (!newName) {
        editNameInput.focus()
        return
    }

    saveProfileBtn.disabled     = true
    saveProfileBtn.textContent  = "Saving…"

    try {
        await updateProfile(user, { displayName: newName })

        // Keep DB profile in sync
        await set(ref(database, `users/${user.uid}/profile`), {
            name:  newName,
            email: user.email || ""
        })

        syncDrawerUserInfo(auth.currentUser)
        closeModal()
        showToast("Profile updated ✓")

    } catch (error) {
        console.error(error)
        alert("Failed to update profile: " + error.message)
    } finally {
        saveProfileBtn.disabled    = false
        saveProfileBtn.textContent = "Save Changes"
    }
})

function openModal() {
    editProfileModal.classList.add("show")
}

function closeModal() {
    editProfileModal.classList.remove("show")
}

// ── Toast ──────────────────────────────────────────────
let toastTimer = null

function showToast(message, duration = 2800) {
    toastEl.textContent = message
    toastEl.classList.add("show")
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), duration)
}