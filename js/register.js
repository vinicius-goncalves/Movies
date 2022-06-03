import { auth } from './authAndRequests.js'
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"
import { userNavbar } from './userExperience.js'

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"

onAuthStateChanged(auth, (user) => {
    if(user) {

    }
})

const registerContainer = document.querySelector('[data-js="register-container"]')
