//API fetch code - using local api for now

let allDrinks;
let allDrinkNames;
let allDrinkIngredients = [];
let allDrinkNamesAndIngredients;

fetch(`cocktaildb_api_clone_local.txt`)
.then((result) => result.json())
.then((json) => {
    allDrinks = json.drinks;
    return allDrinks;
    }
)
.then(() => {
    //populate arrays for searching and filter populating
    allDrinkNames = allDrinks.map(item => item.strDrink.toUpperCase());

    allDrinks.forEach(item => {
        for (let i = 1; i <= 15; i++) {
            const objKey = "strIngredient" + i;
            if (item[objKey] && !allDrinkIngredients.includes(item[objKey].toUpperCase())) {
                allDrinkIngredients.push(item[objKey].toUpperCase());
            }
        }
    });

    allDrinkNamesAndIngredients = allDrinkNames.concat(allDrinkIngredients);

    // sort array in alphabetcial order
    allDrinkNames.sort();
    allDrinkIngredients.sort();
    allDrinkNamesAndIngredients.sort();

    //console logs for testing
    console.log(allDrinks);
    console.log(allDrinkNames);
    console.log(allDrinkIngredients);
    console.log(allDrinkNamesAndIngredients);

    // stop displaying loading screen and show main content.
    setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.querySelector("main").style.display = "flex";

        if(window.location.pathname === "/browse.html") {
            displayCocktails(allDrinks);
            addFilterBtnEvntListener();
        } else if(window.location.pathname === "/details.html") {
            displayCurrentCocktail();
        }
        
    },1000);
})    
.catch((error) => console.log(error));



// Displaying the images on the page
const displayCocktails= list =>{
    const cocktailsContainer = document.getElementById("cocktail-container");
     const allCards = list.map(item=>{
        return `
            <a class="cards" href="details.html?id=${item.idDrink}" style="background-image:linear-gradient(to bottom, rgba(34, 40, 49, 0) 50%, rgba(34, 40, 49, 1) 100%), url(${item.strDrinkThumb});">
                <h2>${item.strDrink}</h2>
            </a>
    `;})
    cocktailsContainer.innerHTML= allCards.join("");
   }

// Details Page - Displaying the images
    
let currentId;
    
function displayCurrentCocktail () {
    const urlParams = new URLSearchParams(window.location.search);
    currentId = urlParams.get("id");
    
    const currentDrink = allDrinks.filter(item => item.idDrink == currentId)[0];
    console.log(currentDrink);

    const image = 
    `<div class="current-image">
    <img src=${currentDrink.strDrinkThumb} alt="${currentDrink.strDrink}" class="current-new-image" />
    <div class="current-image-info">
    <h2 class="current-image-name">${currentDrink.strDrink}</h2>
    <div class = "ingredients">
        <h3>Ingredients</h3>
        <a href="" id="ingredient1">${currentDrink.strIngredient1}</a>
        <a href="" id="ingredient2">${currentDrink.strIngredient2}</a>
        <a href="" id="ingredient3">${currentDrink.strIngredient3}</a>
        <a href="" id="ingredient4">${currentDrink.strIngredient4}</a>
        <a href="" id="ingredient5">${currentDrink.strIngredient5}</a>
        <a href="" id="ingredient6">${currentDrink.strIngredient6}</a>
        
        </div>
        <div class="cocktail-instructions">
        <h3>Method</h3>
        <p id="cocktail-method">${currentDrink.strInstructions}</p>
        </div>
        <div class="serve">
        <h3>Serve</h3>
        <p id="serve-glass">${currentDrink.strGlass}</p>
        </div>
        </div>
        </div>`;
        const imageContainer = document.querySelector(".current-cocktail-display");
        imageContainer.innerHTML = image;
      
    };

// FILTER RESULTS FUNCTION
function addFilterBtnEvntListener() {
    const dropdownArrows = document.querySelector(".down-arrows");
    const filterBtns = document.querySelector(".filter-btns");

    dropdownArrows.addEventListener('click', () => {
        dropdownArrows.classList.toggle('active');
        filterBtns.classList.toggle('active');
    })
}

///////NAV BAR SEARCH FEATURES///////
const searchInput = document.getElementById("nav-search-input");
const searchBtn = document.getElementById("nav-search-btn");
const predictiveSearchContainer = document.getElementById("predictive-search-results");

searchInput.oninput = () =>{
    if(searchInput.value !== ""){
        predictiveSearchContainer.style.display="block";
        const predictiveSearchList = allDrinkNamesAndIngredients.filter(item => item.includes(searchInput.value.toUpperCase()));
        
        const firstFiveResults = predictiveSearchList.filter((item, index) => index < 5);

        const resultHTML = firstFiveResults.map(item => {
            return `<p class="predictive-search-item" onclick="search('${item}')">${item}</p>`;
        });

        if(predictiveSearchList.length > 5) {
            resultHTML.push('<p class="predictive-search-item">...</p>');
        }

        if(firstFiveResults.length === 0){
            predictiveSearchContainer.innerHTML = '<p class="predictive-search-item">SORRY, NO RESULTS</p>'
        } else {
            predictiveSearchContainer.innerHTML = resultHTML.join("");
        }
        
    } else {
        predictiveSearchContainer.style.display="none";
        predictiveSearchContainer.innerHTML = "";
    }
};

searchBtn.onclick = e => {
    e.preventDefault();
    if(allDrinkNamesAndIngredients.includes(searchInput.value.toUpperCase())) {
        search(searchInput.value.toUpperCase());
    }
};

const mainSearchInput = document.getElementById("main-search-input");
const mainSearchBtn = document.getElementById("main-search-btn");
const mainPredictiveSearchContainer = document.getElementById("main-predictive-search-results");


if(window.location.pathname === "/index.html"){
    mainSearchInput.oninput = () =>{
        if(mainSearchInput.value !== ""){
            mainPredictiveSearchContainer.style.display="block";
            const predictiveSearchList = allDrinkNamesAndIngredients.filter(item => item.includes(mainSearchInput.value.toUpperCase()));
            
            const firstFiveResults = predictiveSearchList.filter((item, index) => index < 5);

            const resultHTML = firstFiveResults.map(item => {
                return `<p class="predictive-search-item" onclick="search('${item}')">${item}</p>`;
            });

            if(predictiveSearchList.length > 5) {
                resultHTML.push('<p class="predictive-search-item">...</p>');
            }

            if(firstFiveResults.length === 0){
                mainPredictiveSearchContainer.innerHTML = '<p class="predictive-search-item">SORRY, NO RESULTS</p>'
            } else {
                mainPredictiveSearchContainer.innerHTML = resultHTML.join("");
            }
            
        } else {
            mainPredictiveSearchContainer.style.display="none";
            mainPredictiveSearchContainer.innerHTML = "";
        }
    };

    mainSearchBtn.onclick = e => {
        e.preventDefault();
        if(allDrinkNamesAndIngredients.includes(mainSearchInput.value.toUpperCase())) {
            search(mainSearchInput.value.toUpperCase());
        }
    };
};


function search(searchString) {
    console.log(searchInput.value.toUpperCase());
    const isSearchingForCocktail = allDrinkNames.some(item => item === searchString);

    if(isSearchingForCocktail) {
        const cocktail = allDrinks.find(item => item.strDrink.toUpperCase() === searchString);
        window.location.href = `./details.html?id=${cocktail.idDrink}`;
    } else {
        window.location.href = `./browse.html?id=${searchString}`;
    }
}