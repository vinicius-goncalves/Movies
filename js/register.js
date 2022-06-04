import { auth } from './authAndRequests.js'
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"
import { userNavbar, signOutUser } from './userExperience.js'

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"

const navbarContainer = document.querySelector('[data-js="nav-bar"]')

onAuthStateChanged(auth, (user) => {
    if(user) {
        userNavbar(user)
    }else {
        userNavbar(user)
    }
})

const registerContainer = document.querySelector('[data-js="register-container"]')

registerContainer.addEventListener('submit', (event) => {
    event.preventDefault()

    const email = event.target.email.

    createUserWithEmailAndPassword(auth, )
})

signOutUser