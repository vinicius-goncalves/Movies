import { auth, storage } from './authAndRequests.js'
import { userNavbar, navbarContainer, getCurrentUser, extractPropFromCurrentUser, updateInformation } from './userExperience.js'

import { onAuthStateChanged, signOut, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-storage.js"

const imageProfileConfiguration = document.querySelector('#send-new-photo')

const userImage = document.querySelector('#user-image')
const userMessageInformation = document.querySelector('#user-message-information')
const userLoreContainer = document.querySelector('[data-js="user-lore"]')

const loader = document.querySelector('#loader-content')
const loaderImageProfile = document.querySelector('#loader-profile')

const username = document.querySelector('#username')
const email = document.querySelector('#email')
const password = document.querySelector('#password')

const profile = document.querySelector('#user-image-profile-navbar')
const loaderProfile = document.querySelector('#loader-profile-navbar')

const customErrors = (errorType) => ({
    'auth/internal-error': 'Um erro interno aconteceu',
    'auth/weak-password': "Senha fraca, tente novamnete",
})[errorType] || 'Um erro aconteceu'

userLoreContainer.addEventListener('click', async (event) => {

    if(event.target.dataset.user === "confirm-details") {

        const credentials = EmailAuthProvider.credential(auth.currentUser.email)
        await reauthenticateWithCredential(auth.currentUser, credentials).then(() => {
            console.log('Autenticado', credentials)
        })

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

      updateInformation(
          getCurrentUser(auth),
          (
            userImage.src = extractPropFromCurrentUser(auth, 'photoURL'), 
            profile.src = getCurrentUser(auth).photoURL
          ), 
          null,
          (
            loaderProfile.style.display = 'none',
            loaderImageProfile.style.display = 'none'
        ))

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


