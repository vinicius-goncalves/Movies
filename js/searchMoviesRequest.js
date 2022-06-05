import { auth, db, apiKeyMovieDB } from "./authAndRequests.js"
import { userNavbar } from "./userExperience.js"

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js"

import { doc, addDoc, setDoc, updateDoc, getDoc, arrayUnion, arrayRemove, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js"

const formSearchContainer = document.querySelector('[data-js="form-search-container"]')
const ulMoviesSearchRresult = document.querySelector('#ul-movies-search-result')
const recentSearchContainer = document.querySelector('#recent-search')

const userProfileAtNavbar = document.querySelector('#user-image-profile-navbar')

setTimeout(() => {
    userProfileAtNavbar.src = auth.currentUser.photoURL
}, 2000)

const currentUser = (user) => {
    return user.currentUser.uid
}

onAuthStateChanged(auth, async (user) => {
    if(user) {
        await verifyIfUserExistsInDb(currentUser(auth))
        userNavbar(user)
    }else {
        userNavbar(user)
    }
})

// Input here your API key from moviedb.org
const urlToRequest = (termToSearch) => {
   return `https://api.themoviedb.org/3/search/movie?api_key=${apiKeyMovieDB}&language=pt-BR&query=${termToSearch}&page=1&include_adult=false`
}

const posterPath = (imageLocation) => {
    return `https://image.tmdb.org/t/p/w500/${imageLocation}`
}

const verifyIfUserExistsInDb = async (user) => {
    getDoc(doc(db, "users", user)).then((dataSnapshot) => {
        if(dataSnapshot.exists()) {
            return
        }else {
            setDoc(doc(db, "users", user), {
                lastChange: serverTimestamp(),
                moviesId: [],
                recentSearchs: []
            })
        }
    })
}

/* Code refactoring [done] */
const fetchResult = async (searchedTerm) => { 
    
    ulMoviesSearchRresult.innerHTML = ''

    const requestToMovieAPI = await fetch(urlToRequest(searchedTerm))
    const responseFromMovieAPI = await requestToMovieAPI.json()
    const resultsMoviesByResponse = await responseFromMovieAPI.results

    const reduceToLi = resultsMoviesByResponse.reduce((accumulator, movieInformation) => {
        const { id, title, overview, release_date } = movieInformation
        
        const formattedReleaseDate = new Date(release_date).toLocaleDateString('pt-BR', { 
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })

        const verifyImagePath = 
            posterPath(movieInformation.poster_path) === posterPath('null') 
            ? 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg' 
            : posterPath(movieInformation.poster_path)

        accumulator +=
            `<li data-li="${id}">
                <img src="${verifyImagePath}" class="movie-poster">
                <article>
                    <aside class="movie-details-container">
                        <h2 class="movie-name">${title}</h2>
                        <h5 class="release-date">Data de lançamento: ${formattedReleaseDate}</h5>
                        <h6 class="movie-id">${id}</h6>
                    </aside>
                    <p class="movie-description">${overview}</p>
                    <button class="add-to-library" data-js="${id}">
                        <span class="text-add-to-library" data-js="${id}">Adicionar a biblioteca</span>
                        <span class="added-into-library" data-js="${id}">Conteúdo adicionado</span>
                    </button>
                </article>
            </li>`
        return accumulator   
    }, '')

    ulMoviesSearchRresult.innerHTML += reduceToLi
  
}

formSearchContainer.addEventListener('submit', (event) => {
    event.preventDefault()

    const termSearchContainer = event.target['search-movie-term']
    const termToSearch = termSearchContainer.value

    if(termToSearch === '') {
        console.log('aaa')
        return
    }

    fetchResult(termToSearch)

    updateDoc(doc(db, "users", currentUser(auth)), {
        recentSearchs: arrayUnion(termToSearch)
    })

    getDoc(doc(db, "users", currentUser(auth))).then((recentSearchs) => {
        recentSearchContainer.innerHTML = ''
        const recentSearchsFromDatabase = recentSearchs.data().recentSearchs
        recentSearchsFromDatabase.map((value) => {
            const newElementOption = document.createElement('option')
            newElementOption.value = value
            recentSearchContainer.appendChild(newElementOption)
        })
    })

    termSearchContainer.focus()
    termSearchContainer.value = ''

})

ulMoviesSearchRresult.addEventListener('click', async (event) => {

    const movieIdFromDataJs = event.target.dataset.js
    if(movieIdFromDataJs) {
        updateDoc(doc(db, "users", currentUser(auth)), {
            lastChange: serverTimestamp(),
            moviesId: arrayUnion(movieIdFromDataJs)
        }).then(() => {
            console.log('O filme ' + movieIdFromDataJs + ' foi adicionado ao banco de dados do usuário: ' + currentUser(auth))
        })
    }
})