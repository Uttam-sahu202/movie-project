//export{history};

var allMovies = [];
var permanentMovieList = {};  // mapping of movie name with the imdb id 
var favoriteList = JSON.parse(localStorage.getItem('favoriteMovies')) || []; // Load from localStorage 
const history = JSON.parse(localStorage.getItem('history')) || [];


export default history;

//  taking inpute from user and send to search 
document.getElementById('searchButton').addEventListener('click', () => {     
    const searchInput = document.getElementById('searchInput').value.trim();
    allMovies = [];
    if (searchInput) {
        fetchAllMovies(searchInput);
    } else {
        alert('Please enter a movie name to search!');  // in case inpute section is vacant
    }

    if (history.indexOf(searchInput) === -1 && searchInput) {  
        history.push(searchInput); 
        localStorage.setItem('history', JSON.stringify(history));  
        let temp = document.createElement("li");            // appending current searched element into history list
        temp.textContent = searchInput;
        document.querySelector('.history-ul').appendChild(temp);
    }  
});



//  fetching the data from API using "s=" in URL to fetch all the result from each page which is equal to 10 
//  note  "t="  means you want that particular movie's all detail by title
//        "i=" get full detail exact by IMDB id 
function fetchAllMovies(searchTerm) {
    let page = 1;
    function fetchPage(page) {
        const url = `http://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=c2c13f13&page=${page}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Response === 'True') {
                    allMovies = allMovies.concat(data.Search);    // storing the search relult into the array 

                    if (data.totalResults > allMovies.length) {
                        fetchPage(page + 1);
                    } else {
                        displayMovies(allMovies);
                    }
                } else if(page === 1){
                    alert('No movies found!');         // handling wrong movie name 
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                 alert('error in fetching movie try again!'); 
            });  // handling the server error in case of any 
    }

    fetchPage(page);  // fetching result from each page 
}




// now displaying the moveis inside home dive 
function displayMovies(movies) {
    const homeContent = document.getElementById('homeContent');    // Target the correct section to append these result
    homeContent.innerHTML = ''; // Clear previous results
    


    //  creating div and appending it into the home with two button as favorite and detail into it 
    //  also adding the content of each movie in each div 
    movies.forEach(movie => {
        const movieCard = document.createElement('div');    // creating div box with name movie-card 
        movieCard.classList.add('movie-card');
        

        // adding movie content in each div created above 
        movieCard.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" />
            <h3 class="h3">${movie.Title}</h3>
            <h3 class="h3">(${movie.Year})</h3>
        `;
        



        // Create "Favorite" button
        const favoriteButton = document.createElement('button');

        // seee at the time of creating button if it already exist in favorite list or local storage 
        // text content should be Added else Favorite   
        favoriteButton.textContent = favoriteList.some(fav => fav.Title === movie.Title) ? "Added" : "Favorite";
        favoriteButton.classList.add('favorite-btn');

        if (favoriteList.some(fav => fav.Title === movie.Title)) {  // giving pink color in case movie has been added to favorite
            favoriteButton.style.backgroundColor = "pink";
        }


        //  now on button click added the div box into the favorite list and also local storage for reload in case
        // of refrece the page 

        favoriteButton.addEventListener('click', () => {
            if (favoriteList.some(fav => fav.Title === movie.Title)) {
                alert('Already added to your favorite list');
            } else {
                favoriteList.push(movie); // Add movie object to favorite list
                localStorage.setItem('favoriteMovies', JSON.stringify(favoriteList)); // Save to localStorage as key value pair here key is favoriteMovies and other is value
                favoriteButton.style.backgroundColor = "pink";
                favoriteButton.textContent = "Added";

                // make function call to append this div box into the favorite section as well
                addToFavoriteUI(movie);   
            }
        });



        // Create one more button "Detail" button
        const detailButton = document.createElement('button');
        detailButton.textContent = 'Detail';
        detailButton.classList.add('detail-btn');

        // on click showing modal pop-up
        detailButton.addEventListener('click', () => { 

            const detailContainer = document.querySelector('.popup-container');
            const closeButton = document.getElementById('close-detail');
            
            //fetching that movie all details using "t=" in URL 
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
            
            
            // adding movies detail into the pop-up modal 
            function displayingMovieDetails(movie) {
                const detailContent = document.getElementById("detail-content");
                detailContent.innerHTML = ""; // Clear previous content
                                                               
                // Creating a list to append  movie details as list item
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
                // appending each key value as a list item in unorder list                                                
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
             
            // handling the case when modal pop-up is showing and user click another detail button
            // searching that clicked button and replaceing the latest detail clicked button movie information in pop -up
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





// Function to Add Movie to Favorite which has been called when favorite button is clicked 
// inside the home section 
function addToFavoriteUI(movie) {
    const favoriteContent = document.getElementById('favoriteContent'); // targeting section to append 
    const myFavoriteMovie = document.createElement('div');  // create div box
    myFavoriteMovie.classList.add('fav-movieCard');

    // adding movie content inside the dcreated div box
    myFavoriteMovie.innerHTML = `
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" />
        <h3 class="h3">${movie.Title}</h3>
        <h3 class="h3">(${movie.Year})</h3>
    `;
    


    // Create "Remove" button to remove from the favoriteList
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-btn');
     

    // event listner when the button will be clicked so that we can remove that div from the 
    // favorite section 
    removeButton.addEventListener('click', () => {

        // Remove from favoriteList
        favoriteList = favoriteList.filter(item => item.Title !== movie.Title);
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteList)); // Update localStorage

        // Remove the existing div from favorite section
        myFavoriteMovie.remove();   
        

        // now reset that favorite button in home section 
        // logic is to find that div box which has that movie and then reset it's button
        const homeContent = document.getElementById('homeContent').getElementsByClassName('movie-card');  // store all the child div

        // iterating  the each div and finding the target div 
        for (let card of homeContent) {
            let movieTitle = card.getElementsByTagName('h3')[0].innerText; // get movie title of current div

            if (movieTitle === movie.Title) {  // if it is the target div then selecting favorite button and reset it
                let favButton = card.getElementsByClassName('favorite-btn')[0];
                favButton.textContent = "Favorite";
                favButton.style.backgroundColor = "";
            }
        }
    });
    

    // added remove button and append the box to the favoriteContent section
    myFavoriteMovie.appendChild(removeButton);
    favoriteContent.appendChild(myFavoriteMovie);
}



// Load favorite movies when page refreshes 
// favoriteList already loaded from local storage above so call that fucntion to append this in favoriteContent section
function loadFavoriteMovies() {
    favoriteList.forEach(movie => {
        addToFavoriteUI(movie);
    });
}



loadFavoriteMovies(); // Call function on page load



// making combined listner of home and favourite both the content 

document.getElementById('sec-switching').addEventListener('click', (event) => {
    if (event.target.id === 'home') {  
        document.getElementById('homeContent').classList.remove('content-disabled');
        document.getElementById('favoriteContent').classList.add('content-disabled');
        document.getElementById('favourite').classList.remove('active');
        document.getElementById('home').classList.add('active');
    } else if (event.target.id === 'favourite') {
        document.getElementById('favoriteContent').classList.remove('content-disabled');
        document.getElementById('homeContent').classList.add('content-disabled');
        document.getElementById('home').classList.remove('active');
        document.getElementById('favourite').classList.add('active');
    }
});


// const searchHistoryModal = document.querySelector(".searchHistoryModal");
// const searchedContent = document.getElementById("history-content");
// searchedContent.innerHTML = "";

// const detailsList = document.createElement("ul");
// detailsList.classList.add('history-ul');

// // Ensure `searchedDetail` is an array before iterating
// if (Array.isArray(history)) {
//     history.forEach(detail => {
//         const listItem = document.createElement("li");
//         listItem.textContent = detail;
//         detailsList.appendChild(listItem);
//     });
// }

// searchedContent.appendChild(detailsList);

// // Corrected modal display property
// document.getElementById('history').addEventListener('click', () => {

//     searchHistoryModal.style.display = 'grid';
//     searchHistoryModal.style.zIndex = '999';
// });

// // Close button functionality
// document.getElementById('history-close-detail').addEventListener('click', () => {
//     searchHistoryModal.style.display = 'none';
//     searchHistoryModal.style.zIndex = '-1';
// });

