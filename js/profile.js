import { auth, storage } from './authAndRequests.js'
import { userNavbar, navbarContainer } from './userExperience.js'

import { onAuthStateChanged, signOut, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-storage.js"

const imageProfileConfiguration = document.querySelector('#send-new-photo')
const userImage = document.querySelector('#user-image')

const userMessageInformation = document.querySelector('#user-message-information')

const userLoreContainer = document.querySelector('[data-js="user-lore"]')

const loader = document.querySelector('#loader-content')
const profileLoader = document.querySelector('#loader-profile')

const username = document.querySelector('#username')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const profile = document.querySelector('#user-image-profile-navbar')

const customErrors = (errorType) => ({
    'auth/internal-error': 'Um erro interno aconteceu',
    'auth/weak-password': "Senha fraca, tente novamnete",
})[errorType] || 'Um erro aconteceu'

window.addEventListener('load', () => {

    setTimeout(() => {
        userImage.setAttribute('src', auth.currentUser.photoURL)

        username.placeholder = auth.currentUser.displayName
        email.placeholder = auth.currentUser.email
        profile.setAttribute('src', auth.currentUser.photoURL)
        
        loader.style.display = 'none'

    }, 2 * 1000)

    setTimeout(() => {
        profileLoader.style.display = 'none'

    }, 3 * 1000)
})

userLoreContainer.addEventListener('click', async (event) => {

    if(event.target.dataset.user === "confirm-details") {

        // const credentials = EmailAuthProvider.credential(auth.currentUser.email)
        // await reauthenticateWithCredential(auth.currentUser, credentials).then(() => {
        //     console.log('Autenticado', credentials)
        // })

        updatePassword(auth.currentUser, password.value).then(() => {
            userMessageInformation.textContent = 'Senha alterada com sucesso.'
        }).catch(e => console.log(customErrors(e.code)))
    }
})

navbarContainer.addEventListener('click', (event) => {
    if(event.target.dataset.search) {
        window.location = './search.html'
    }

    if(event.target.dataset.loggout) {
        signOut(auth)
        window.location = '../login.html'
    }
})

onAuthStateChanged(auth, (user) => {
    if(user) {
        userNavbar(user)
    } else {
        userNavbar(user)
    }
})

const acceptFiles = [
    'image/jpg', 
    'image/jpeg', 
    'image/png',
    'image/gif']

imageProfileConfiguration.addEventListener('change', () => {
    const typeFile = acceptFiles.join(', ').replace(/image\//g, '')
    const sentImage = imageProfileConfiguration.files
    
    
    if(acceptFiles.includes(sentImage[0].type)) {

        const photoURL = auth.currentUser.photoURL.toString()

        userMessageInformation.textContent = ''
        const newImage = URL.createObjectURL(sentImage[0])
        userImage.setAttribute('src', newImage)

        const usersProfilePictureReference = ref(storage, 'usersProfilePicture/' + auth.currentUser.uid)
        uploadBytes(usersProfilePictureReference, sentImage[0]).then(() => {
            getDownloadURL(usersProfilePictureReference).then((response) => {
                updateProfile(auth.currentUser, {
                    photoURL: response.toString()
                }).then(() => {
                    userImage.setAttribute('src', photoURL)
                 })
        })
    })

    }else {
        userMessageInformation.textContent = 'O tipo de imagem inserido não é válido. Os tipos aceitos são: ' + typeFile
    }
})


