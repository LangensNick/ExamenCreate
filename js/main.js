var movieArray = [];
var movieFavoriteArray = [];
var movieArrayIndex = -1;
var similarMovies = [];
var StopButton;
var movieById = [];
const GetNowPlaying = function(){
    fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=dc4bf92c0c9671569c1ba1be6b740fc9&language=en-US&page=1")
    .then((resp) => resp.json())
    .then(function(data) {
      movieArray = data.results;
      ShowMovie();
      })
      
}

const LoadSimilarMovies = function(id){
    fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=dc4bf92c0c9671569c1ba1be6b740fc9&language=en-US&page=1`)
    .then((resp) => resp.json())
    .then(function(data){
        let index = 0;
        similarMovies = [];
        for(let item of data.results){
            if(index == 3){
                break;
            }
            else{
                similarMovies.push(item);
                index = index +1;
            }
        }
        detailPageSimilar
        let html = "";
        for(let movie of similarMovies){
            html = html + `
            <div id="similarMovieItem" data-id="${movie.id}" class="c-detailPage__similarMovie--item">
                <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" alt="" class="c-detailPage__similarMovie--itemPicture">
                <div class="o-layout u-1-of-1 c-detailPage__similarMovie--itemInfoFrame o-layout--justify-center">
                    <p class="o-layout__item u-align-text-center u-pt-sm u-margin-reset u-padding-clear-force u-font-sz-s c-detailPage-similarTitle">${movie.title}</p>
                    <p class="o-layout__item u-align-text-center c-movieCard__rating--stars u-color-gold u-pt-sm u-margin-reset u-padding-clear-force" style="background:linear-gradient(to right, gold ${movie.vote_average * 10}%, black ${(10 - movie.vote_average) * 10}%)">★★★★★</p>
                </div>
            </div>`;
        }
        document.querySelector("#detailPageSimilar").innerHTML = html;
        const similarItems = document.querySelectorAll("#similarMovieItem");
        for(let similarItem of similarItems){
            similarItem.addEventListener("click",LoadMovieInfo);
        }
    })
}
const GetMovieByIdAndLoad = function(id){
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=dc4bf92c0c9671569c1ba1be6b740fc9&language=en-US`)
    .then((resp) => resp.json())
    .then(function(data){
        LoadMovieVideo(data.id);
        LoadSimilarMovies(data.id);
        document.querySelector("#detailPoster").src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
        document.querySelector("#detailTitle").innerHTML = data.title;
        document.querySelector("#detailScore").innerHTML = `<p class="u-margin-reset">${data.vote_average}</p>`;
        document.querySelector("#detailOverview").innerHTML = data.overview;
        const detailDiv = document.querySelector("#detailPage");
        detailDiv.classList.remove("u-display-none"); 
    })
}
const LoadMovieVideo = function(id){
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=dc4bf92c0c9671569c1ba1be6b740fc9`)
    .then((resp) => resp.json())
    .then(function(data){
        let possibleArray = [];
        for(let item of data.results){
            if(item.type === "Trailer"){

                if((item.name.includes("Official")) && (item.name.includes("Trailer"))){
                    possibleArray.push(item);
                }
            }
        }
        try{
            document.querySelector("#detailPageTrailer").innerHTML = `<iframe width="560" class="c-detailVideo" id="detailMovie" height="315" src="" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            document.querySelector("#detailMovie").src = `https://www.youtube.com/embed/${possibleArray[0].key}`;
        }
        catch(ex){
            document.querySelector("#detailPageTrailer").innerHTML = "<p>Trailer not available</p>";
        }
    })
}

const toggleNavFavorite = function(){
    const hamburgerMenu = document.querySelector("#hamburgerMenu");
    const nav = document.querySelector("#nav");
    hamburgerMenu.classList.toggle("nav-hamburger--open");
    nav.classList.toggle("c-favorites-mobile--open")

}
const ShowMovie = function(){
    movieArrayIndex += 1
    document.querySelector("#mainScreenImage").src = "https://image.tmdb.org/t/p/original/"+movieArray[movieArrayIndex].poster_path;
    document.querySelector("#mainScreenTitle").innerHTML = movieArray[movieArrayIndex].original_title;
    document.querySelector("#movieCard").setAttribute("data-movie-id",movieArray[movieArrayIndex].id);
    document.querySelector(".c-movieCard__rating--stars").style.background = "linear-gradient(to right, var(--global-color-gold) "+String(movieArray[movieArrayIndex].vote_average * 10)+"%, var(--global-color-black) "+ String((10 - movieArray[movieArrayIndex].vote_average) * 10) +"%)"

}
const RejectMovie = function(){
    if(!StopButton){
        StopButton = true;                          
        setTimeout(function() {
            movieCard.classList.add("Reject");
            setTimeout(function() {
              setTimeout(function() {
                ShowMovie();
                setTimeout(function(){
                    setTimeout(function(){
                        movieCard.classList.remove("Reject");
                        StopButton = false;
                    },200)
                },300)
              }, 800);
            }, 100);
        }, 0);
    }
}
const LoadMovieInfo = function(){
    hideMainPage();
    showDetailPage(this.getAttribute("data-id"));
}
const DeleteItemFromList = function(){
    this.classList.add()
    let newFavoritesList = [];
    let index = 0;
    let skipindex = this.getAttribute("data-index")
    for(let i of movieFavoriteArray){
        if(index != skipindex){
            newFavoritesList.push(i);
        }
        index = index + 1;
    }
    movieFavoriteArray = newFavoritesList;
    //movieFavoriteArray.pop(this.getAttribute("data-index"));
    LoadFavorites();
}
const LoadFavorites = function(){
    html = "";
    let index = 0;
    for(let movie of movieFavoriteArray){
        html = html + `<li class="c-favorites__item"><div class="c-favorites__item--top"><img src="image/cross.png" id="deleteFavorite" data-index=${index} alt="delete" class="c-favorites__item--cross"><img id="MovieItem" data-id="${movie.id}" src="https://image.tmdb.org/t/p/original/${movie.poster_path}" alt="" class="c-favorites__image"></div><p class="c-favorites__image--tag">${movie.title}</p></li>`
        index = index + 1;
        
    }
        
    favoritesList = document.querySelector("#favoritesList");
    favoritesList.innerHTML = html;
    favoritesListDeleteItems = document.querySelectorAll("#deleteFavorite");
    favoritesListItems = document.querySelectorAll("#MovieItem");
    for(let i of favoritesListItems){
        i.addEventListener("click",LoadMovieInfo);
    }
    for(let j of favoritesListDeleteItems){
        j.addEventListener("click",DeleteItemFromList);
    }

}
const FavoriteMovie = function(){
    if(!StopButton){
        StopButton = true;   
        movieFavoriteArray.push(movieArray[movieArrayIndex]);         
        LoadFavorites();

        setTimeout(function() {
            movieCard.classList.add("favorite");
            setTimeout(function() {
            setTimeout(function() {
                ShowMovie();
                setTimeout(function(){
                    setTimeout(function(){
                        movieCard.classList.remove("favorite");
                        StopButton = false;
                    },200)
                },300)
            }, 800);
            }, 100);
        }, 0);
    }
}

const hideMainPage = function(){
    const mainDiv = document.querySelector("#mainPage");
    mainDiv.classList.add("u-display-none");
}
const hideDetailPage = function(){
    const detailDiv = document.querySelector("#detailPage");
    detailDiv.classList.add("u-display-none");
    document.querySelector("#detailMovie").src = "";
}
const showMainPage = function(){
    const mainDiv = document.querySelector("#mainPage");
    mainDiv.classList.remove("u-display-none");
    
}
const showDetailPage = function(id){
    let item = movieArray.filter(function(x) { return x.id == id })[0];
    if(item === undefined){
        GetMovieByIdAndLoad(id);
        return;
    }
    LoadMovieVideo(item.id);
    LoadSimilarMovies(item.id);
    document.querySelector("#detailPoster").src = `https://image.tmdb.org/t/p/original/${item.poster_path}`;
    document.querySelector("#detailTitle").innerHTML = item.title;
    document.querySelector("#detailScore").innerHTML = `<p class="u-margin-reset">${item.vote_average}</p>`;
    document.querySelector("#detailOverview").innerHTML = item.overview;
    const detailDiv = document.querySelector("#detailPage");
    detailDiv.classList.remove("u-display-none");
}
const closeDetailPage = function(){
    hideDetailPage();
    showMainPage();
}
const openDetailPage = function(){
    hideMainPage();
    showDetailPage(this.getAttribute("data-movie-id"));
}

const init = function(){
    hideDetailPage();
    GetNowPlaying();
    const closeDetailPageButton = document.querySelector("#closeDetailPage");
    const movieCard = document.querySelector("#movieCard");
    movieCard.addEventListener("click",openDetailPage);
    const rejectButton = document.querySelector("#c-divReject");
    rejectButton.addEventListener("click",RejectMovie)
    closeDetailPageButton.addEventListener("click",closeDetailPage);
    const FavoriteButton = document.querySelector("#c-divFavorite");
    FavoriteButton.addEventListener("click",FavoriteMovie)
    const favoriteToggleButton = document.querySelector("#hamburgerMenu");
    favoriteToggleButton.addEventListener("click",toggleNavFavorite);
    LoadSimilarMovies(330457);
}



document.addEventListener("DOMContentLoaded",init)