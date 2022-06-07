import { auth, db, apiKeyMovieDB } from './authAndRequests.js'
import { userNavbar } from './userExperience.js'

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"
import { doc, getDoc, deleteDoc, updateDoc, arrayRemove } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js"

const urlToRequest = (movieId) => {
   return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKeyMovieDB}`
}

const posterPath = (imageLocation) => {
    return `https://image.tmdb.org/t/p/w500/${imageLocation}`
}

const userProfileAtNavbar = document.querySelector('#user-image-profile-navbar')

const ulMovieLibrary = document.querySelector('#ul-movies-library')
const lastDateMovieAdded = document.querySelector('.last-date-movie-added')

setTimeout(() => {
    userProfileAtNavbar.src = auth.currentUser.photoURL
}, 1000)

onAuthStateChanged(auth, async (user) => {
    if(user) {
        userNavbar(user)

        await getDoc(doc(db, "users", auth.currentUser.uid)).then((fromDatabase) => {

            const { lastChange } = fromDatabase.data()
            const correctLastMovieAddedDate = lastChange.toDate().toLocaleDateString('pt-BR', {
                second: 'numeric',
                minute: 'numeric',
                hour: 'numeric',
                day: 'numeric',
                month: 'long',
                year: '2-digit',
            })

            lastDateMovieAdded.textContent = `${correctLastMovieAddedDate}`

            const moviesId = fromDatabase.data().moviesId
            moviesId.map((id) => { 
                fetch(urlToRequest(id)).then((moviesReceivedFromMovieDb) => { 
                    return moviesReceivedFromMovieDb.json()
                }).then((movie) => {
                    ulMovieLibrary.innerHTML += 
                    `<li data-li="${movie.id}">
                            <div class="movie-informations">
                                <img src="${posterPath(movie.poster_path)}" class="movie-poster">
                                <i class="fas fa-trash" data-remove="${movie.id}"></i>
                            </div>
                        </li>`
                    // ulMovieLibrary.innerHTML += 
                    // `
                    // <li data-li="${id}">
                    //     <img src="${posterPath(movie.poster_path)}" class="movie-poster">
                    // </li>`

                    })
                })
            })
    } else {
        userNavbar(user)
    }
})

ulMovieLibrary.addEventListener('click', event => {
    const clickedDataRemove = event.target.dataset.remove
    if(clickedDataRemove) {
        document.querySelector(`[data-li="${clickedDataRemove}"]`).remove()
        updateDoc(doc(db, "users", auth.currentUser.uid), {
            moviesId: arrayRemove(clickedDataRemove)
        }).then(() => console.log('Removido'))
    }
})