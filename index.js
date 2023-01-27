// consts 

const apiKey = "2a79bf5fb579f2c9b5a0cf1e55c7db6c"
const apiEndPoint = "https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original";


const apiPaths = {
    fetchAllCategories : `${apiEndPoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList : (id) => `${apiEndPoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending: `${apiEndPoint}/trending/all/day?api_key=${apiKey}`, 
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyCAszlGmBjHmnz0-GLr4dXfEIrN_gtJB9I`
}


// boots up the app 

function init() {
    fetchTrendingMovies();
   fetchAndBuildAllSections();
}

function fetchTrendingMovies(){
    fetchAndbuildMovieSection(apiPaths.fetchTrending, 'Trending Now')
    .then(list=>{
        const randomIndex = parseInt(Math.random() * list.length);
        buildBannerSection(list[randomIndex])
        
    }).catch(err=>{
        console.error(err);
    })
}

function buildBannerSection(movie){
    const bannerCont = document.getElementById("banner-section");
    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

    const div = document.createElement("div");
    div.innerHTML = `
    <h2 class="banner_title">${movie.title}</h2>
    <p class="banner_info">Trending in movies | Releasing on - ${movie.release_date}</p>
    <p class="banner_overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+ '...' : movie.overview}</p>
  <div class="action-buttons-cont">
    <button class="action-button"><i class="ri-play-fill"> &nbsp; </i>Play</button>
    <button class="action-button"><i class="ri-information-line"></i> &nbsp; More Info</button>
  </div>`

  div.className = "banner-content container"
    bannerCont.append(div);
}

function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if(Array.isArray(categories) && categories.length){
            categories.forEach(category => {
                fetchAndbuildMovieSection(
                    apiPaths.fetchMoviesList(category.id) ,category.name)
            })
        }
        // console.table(movies)
    })
    .catch(err=>console.error(err));
}

function fetchAndbuildMovieSection(fetchUrl, categoryName){
     console.log(fetchUrl, categoryName)
    return fetch(fetchUrl)
     .then(res=>res.json())
     .then(res=> {
        //  console.table(res.results);
         const movies = res.results;
         if(Array.isArray(movies) && movies.length){
             buildMoviesSection(movies.slice(0,8), categoryName)
         }
         return movies;
    })
        
     .catch(err=>console.error(err))
    
}

function buildMoviesSection(list, categoryName){
    console.log(list, categoryName)

    const moviesCont = document.getElementById("movies-cont");

    const moviesListHTML = list.map(item => {
        return `
        <div class="movie-item"  onmouseover="searchMovieTrailer('${item.title}', 'yt${item.id}')">
        <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}">
        <iframe width="245px" height="150px" 
    src="" id="yt${item.id}">
</iframe>
        </div>
        `;
    }).join('');

    const moviesSectionHTML = `
    <h2 class="movie-section-heading"> ${categoryName} <span class="explore-nudge">Explore All</span></h2>
    <div class="movies-row">
    ${moviesListHTML}
    </div>`

    console.log(moviesSectionHTML)

    const div = document.createElement("div")
    div.className = "movies-section"
    div.innerHTML = moviesSectionHTML

   // append html into container

   moviesCont.append(div)
     
}

// function searchMovieTrailer(movieName, iframeId){
//     if(!movieName) return;

//     fetch(apiPaths.searchOnYoutube(movieName))
//     .then(res=>res.json())
//     .then(res=>{
//         const bestResult = res.items[0];
//         const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
//         console.log(youtubeUrl);
//         const elements = document.getElementById(iframeId)
//     })
//     .catch(err=>console.log(err));
// }

function searchMovieTrailer(movieName, iframId) {
    if (!movieName) return;

    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res => {
        const bestResult = res.items[0];
        
        const elements = document.getElementById(iframId);
        console.log(elements, iframId);

        const div = document.createElement('div');
        div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`

        elements.append(div);
        
    })
    .catch(err=>console.log(err));
}

window.addEventListener("load", function(){
    init();
    window.addEventListener("scroll", function(){
        //header ui update
        const header = this.document.getElementById("header")
        if(window.scrollY > 5) header.classList.add("black-bg")
        else header.classList.remove("black-bg")
    })
})