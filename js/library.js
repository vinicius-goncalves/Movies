import { auth, db, apiKeyMovieDB } from './authAndRequests.js'
import { userNavbar } from './userExperience.js'

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js"

const urlToRequest = (movieId) => {
   return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKeyMovieDB}`
}

const posterPath = (imageLocation) => {
    return `https://image.tmdb.org/t/p/w500/${imageLocation}`
}

const userProfileAtNavbar = document.querySelector('#user-image-profile-navbar')

const ulMovieLibrary = document.querySelector('#ul-movies-library')

setTimeout(() => {
    userProfileAtNavbar.src = auth.currentUser.photoURL
}, 1000)

onAuthStateChanged(auth, (user) => {
    if(user) {
        userNavbar(user)
        getDoc(doc(db, "users", auth.currentUser.uid)).then((fromDatabase) => {
          const moviesId = fromDatabase.data().moviesId
          moviesId.map((id) => { 
              fetch(urlToRequest(id)).then((moviesReceivedFromMovieDb) => { 
                  return moviesReceivedFromMovieDb.json()
              }).then((movie) => {

                console.log(movie)

                ulMovieLibrary.innerHTML += 
                `
                <li data-li="${movie}">
                    <img src="${posterPath(movie.poster_path)}" class="movie-poster">
                </li>`

              })
          })
        })
    }else {
        userNavbar(user)
    }
})