import { auth, db, apiKeyMovieDB } from './authAndRequests.js'
import { userNavbar } from './userExperience.js'

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"
import { doc, addDoc, setDoc, updateDoc, getDoc, arrayUnion, arrayRemove, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js"

// Input here your API key from moviedb.org
const urlToRequest = (movieId) => {
   return `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKeyMovieDB}`
}

const posterPath = (imageLocation) => {
    return `https://image.tmdb.org/t/p/w500/${imageLocation}`
}

const ulMovieLibrary = document.querySelector('#ul-movies-library')

// const getMoviesFromDatabase = (user) => {
//     if() {
//         console.log('a')
//     }else {
//         console.log('b')
//     }
// }fetch(urlToRequest(moviesId)).then((a) => console.log(a))

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