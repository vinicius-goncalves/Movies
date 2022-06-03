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