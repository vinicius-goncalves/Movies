import { auth, provider } from './authAndRequests.js'
import { userNavbar } from './userExperience.js'
import { 
    signOut, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithRedirect } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"

const loginContainer = document.querySelector('[data-js="login-container"]')
const navbarContainer = document.querySelector('[data-js="nav-bar"]')
const loginWithGoogleButton = document.querySelector('#login-with-google')

loginContainer.addEventListener('submit', (event) => {
    event.preventDefault()
    
    const email = event.target.email.value
    const password = event.target.password.value

    signInWithEmailAndPassword(auth, email, password).then(() => {
        window.location = './pages/profile.html'
    })
})

navbarContainer.addEventListener('click', (event) => {
    if(event.target.dataset.logout) {
        signOut(auth)
    }
})

loginWithGoogleButton.addEventListener('click', () => {
    signInWithRedirect(auth, provider)
})

onAuthStateChanged(auth, (user) => {
    if(user) {
        userNavbar(user)
    } else {
        userNavbar(user)
    }
})
