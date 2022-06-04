import { auth } from './authAndRequests.js'
import { signOut } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"

export const navbarContainer = document.querySelector('[data-js="nav-bar"]')

export const userNavbar = (user) => {
    const itemsNavbar = [...navbarContainer.children]

    itemsNavbar.forEach(item => {
        const userItemNavbar = item.dataset.js.includes(user ? 'logged-in' : 'logged-out')
        if(userItemNavbar) {
            item.style.display = 'block'
            return
        }
        item.style.display = 'none'
    })
}

export const signOutUser = 
    navbarContainer.addEventListener('click', (event) => {
        if(event.target.dataset.loggout) {
            signOut(auth).then(() => console.log('Deslogado'))
        }
    })