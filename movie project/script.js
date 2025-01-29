var allMovies = [];
var permanentMovieList = {};  // mapping of movie name with the imdb id 
var favoriteList = JSON.parse(localStorage.getItem('favoriteMovies')) || []; // Load from localStorage

document.getElementById('searchButton').addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (searchInput) {
        fetchAllMovies(searchInput);
    } else {
        alert('Please enter a movie name to search!');
    }
});

function fetchAllMovies(searchTerm) {
    let page = 1;
    function fetchPage(page) {
        const url = `http://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=c2c13f13&page=${page}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Response === 'True') {
                    allMovies = allMovies.concat(data.Search);

                    if (data.totalResults > allMovies.length) {
                        fetchPage(page + 1);
                    } else {
                        displayMovies(allMovies);
                    }
                } else {
                    alert('No movies found!');
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    fetchPage(page);
}

function displayMovies(movies) {
    const homeContent = document.getElementById('homeContent'); // Target the correct section
    homeContent.innerHTML = ''; // Clear previous results

    movies.forEach(movie => {
        permanentMovieList[movie.Title] = movie; // Store movie details

        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        movieCard.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" />
            <h3 class="h3">${movie.Title}</h3>
            <h3 class="h3">(${movie.Year})</h3>
        `;

        // Create "Favorite" button
        const favoriteButton = document.createElement('button');
        favoriteButton.textContent = favoriteList.some(fav => fav.Title === movie.Title) ? "Added" : "Favorite";
        favoriteButton.classList.add('favorite-btn');

        if (favoriteList.some(fav => fav.Title === movie.Title)) {
            favoriteButton.style.backgroundColor = "pink";
        }

        favoriteButton.addEventListener('click', () => {
            if (favoriteList.some(fav => fav.Title === movie.Title)) {
                alert('Already added to your favorite list');
            } else {
                favoriteList.push(movie); // Add movie object to favorite list
                localStorage.setItem('favoriteMovies', JSON.stringify(favoriteList)); // Save to localStorage
                favoriteButton.style.backgroundColor = "pink";
                favoriteButton.textContent = "Added";
                addToFavoriteUI(movie);
            }
        });

        // Create "Detail" button
        const detailButton = document.createElement('button');
        detailButton.textContent = 'Detail';
        detailButton.classList.add('detail-btn');
        detailButton.addEventListener('click', () => { 
                                                                   // remaining part of detailing
                                                                   const detailContainer = document.querySelector('.popup-container');
                                                                   const closeButton = document.getElementById('close-detail');
                                                               
                                                                   function fetchMovieDetails(movieName) {
                                                                       const url = `http://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=c2c13f13`;
                                                                   
                                                                       fetch(url)
                                                                           .then(response => response.json())
                                                                           .then(data => {
                                                                               if (data.Response === "True") {
                                                                                   displayingMovieDetails(data);
                                                                               } else {
                                                                                   document.getElementById("detail-content").innerHTML = `<p>Details not found!</p>`;
                                                                               }
                                                                           })
                                                                           .catch(error => console.error("Error fetching movie details:", error));
                                                                   }
                                                                   
                                                                   function displayingMovieDetails(movie) {
                                                                       const detailContent = document.getElementById("detail-content");
                                                                       detailContent.innerHTML = ""; // Clear previous content
                                                               
                                                                       // Creating a list to display movie details
                                                                       const detailsList = document.createElement("ul");
                                                               
                                                                       const details = [
                                                                           `Title:     ${movie.Title}`,
                                                                           `Year:      ${movie.Year}`,
                                                                           `Genre:     ${movie.Genre}`,
                                                                           `Director:  ${movie.Director}`,
                                                                           `Actors:    ${movie.Actors}`,
                                                                           `Plot:      ${movie.Plot}`,
                                                                           `IMDB Rating: ${movie.imdbRating}`,
                                                                           `Rated:      ${movie.Rated}`,
                                                                           `imdbVotes:  ${movie.imdbVotes}`,
                                                                           `Country:    ${movie.Country}`,
                                                                           `Language:   ${movie.Language}`
                                                                       ];
                                                               
                                                                       details.forEach(detail => {
                                                                           const listItem = document.createElement("li");
                                                                           listItem.textContent = detail;
                                                                           detailsList.appendChild(listItem);
                                                                       });
                                                               
                                                                       detailContent.appendChild(detailsList);
                                                               
                                                                       // Fixing the display of the popup
                                                                       detailContainer.style.display = 'grid';
                                                                       detailContainer.style.zIndex = '999';
                                                                   }
                                                               
                                                                   document.addEventListener('click', (event) => {
                                                                       if (event.target.classList.contains('detail-btn')) {
                                                                           const movieTitle = event.target.parentElement.querySelector('.h3').innerText;
                                                                           fetchMovieDetails(movieTitle);
                                                                       }
                                                                   });
                                                               
                                                                   // Close detail popup on button click
                                                                   closeButton.addEventListener('click', () => {
                                                                       detailContainer.style.display = 'none';
                                                                       detailContainer.style.zIndex = '-1';
                                                                   });
            
        });

        // Append buttons
        movieCard.appendChild(favoriteButton);
        movieCard.appendChild(detailButton);
        homeContent.appendChild(movieCard); // Append to homeContent section
    });
}

// Function to Add Movie to Favorite UI
function addToFavoriteUI(movie) {
    const favoriteContent = document.getElementById('favoriteContent');
    const myFavoriteMovie = document.createElement('div');
    myFavoriteMovie.classList.add('fav-movieCard');
    myFavoriteMovie.innerHTML = `
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" />
        <h3 class="h3">${movie.Title}</h3>
        <h3 class="h3">(${movie.Year})</h3>
    `;

    // Create "Remove" button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-btn');

    removeButton.addEventListener('click', () => {
        // Remove from favoriteList
        favoriteList = favoriteList.filter(item => item.Title !== movie.Title);
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteList)); // Update localStorage

        // Remove from UI
        myFavoriteMovie.remove();

        // Reset favorite button in home content
        const homeContent = document.getElementById('homeContent').getElementsByClassName('movie-card');
        for (let card of homeContent) {
            let movieTitle = card.getElementsByTagName('h3')[0].innerText;
            if (movieTitle === movie.Title) {
                let favButton = card.getElementsByClassName('favorite-btn')[0];
                favButton.textContent = "Favorite";
                favButton.style.backgroundColor = "";
            }
        }
    });

    myFavoriteMovie.appendChild(removeButton);
    favoriteContent.appendChild(myFavoriteMovie);
}

// Load favorite movies when page refreshes
function loadFavoriteMovies() {
    favoriteList.forEach(movie => {
        addToFavoriteUI(movie);
    });
}
loadFavoriteMovies(); // Call function on page load

// Section Switching
document.getElementById('home').addEventListener('click', () => {
    document.getElementById('homeContent').style.display = 'flex';
    document.getElementById('favoriteContent').style.display = 'none';
    document.getElementById('home').style.backgroundColor = "rgba(105, 178, 241, 0.1)";
    document.getElementById('home').style.color = "rgb(180, 182, 183)";
    document.getElementById('favourite').style.backgroundColor = "";
    document.getElementById('favourite').style.color = "";
});

document.getElementById('favourite').addEventListener('click', () => {
    document.getElementById('homeContent').style.display = 'none';
    document.getElementById('favoriteContent').style.display = 'flex';
    document.getElementById('favourite').style.backgroundColor = "rgba(105, 178, 241, 0.1)";
    document.getElementById('favourite').style.color = "rgb(180, 182, 183)";
    document.getElementById('home').style.backgroundColor = "";
    document.getElementById('home').style.color = "";
});
