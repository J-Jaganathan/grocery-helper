import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import {
    getAuth,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"

const yahooProvider =
    new OAuthProvider("yahoo.com")

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqiwr8zsspv_rtHKqN_i984Ab9Aji9wdU",
  authDomain: "grocery-helper-j.firebaseapp.com",
  databaseURL: "https://grocery-helper-j-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "grocery-helper-j",
  storageBucket: "grocery-helper-j.firebasestorage.app",
  messagingSenderId: "362486509864",
  appId: "1:362486509864:web:16b5c2a65bef01d554a01d",
  measurementId: "G-XBFD425Z3V"
};



const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const loadingMessageEl = document.getElementById("loading-message")
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const authScreen = document.getElementById("auth-screen")
const appScreen = document.getElementById("app-screen")
const loginBtn = document.getElementById("login-btn")
const logoutBtn = document.getElementById("logout-btn")
const userInfo = document.getElementById("user-info")
const yahooBtn = document.getElementById("yahoo-login-btn")

yahooBtn.addEventListener(
    "click",
    async () => {

        try {

            await signInWithPopup(
                auth,
                yahooProvider
            )

        }
        catch(error) {

            console.error(error)
        }
    }
)
loginBtn.addEventListener("click", async () => {

    try {

        loginBtn.disabled = true

        loginBtn.textContent =
            "Signing In..."

        await signInWithPopup(auth, provider)

    }
    catch(error) {

        console.error(error)

        alert(error.message)

    }
    finally {

        loginBtn.disabled = false

        loginBtn.textContent =
            "Login with Google"
    }
})


logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth)

    }
    catch(error) {

        console.error(error)
    }
})


onAuthStateChanged(auth, (user) => {

    if (user) {

        authScreen.style.display = "none"

        appScreen.style.display = "block"

        userInfo.textContent =
        `Welcome, ${
            user.displayName ||
            user.email ||
            "User"
        }`

    } else {

        authScreen.style.display = "flex"

        appScreen.style.display = "none"
    }
})

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value.trim()
    inputValue = inputValue.trim().toLowerCase()

    if (!inputValue) {
        return
    }

    push(shoppingListInDB, inputValue)

    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    
    loadingMessageEl.style.display = "none"

    clearShoppingListEl()

    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        
        for (let i = 0; i < itemsArray.length; i++) {
            appendItemToShoppingListEl(itemsArray[i])
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}