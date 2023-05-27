//API fetch code - using local api for now

let allDrinks;
let allDrinkNames;
let allDrinkIngredients = [];
let allDrinkNamesAndIngredients;
let filters = [];
let allDrinksToDisplay = [];
let complexityFilterValue = 16;

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
    // console.log(allDrinks);
    // console.log(allDrinkNames);
    // console.log(allDrinkIngredients);
    // console.log(allDrinkNamesAndIngredients);

    // stop displaying loading screen and show main content.
    setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.querySelector("main").style.display = "flex";

        if(window.location.pathname === "/browse.html") {
            addFilterBtnEvntListener();
            populateFilterBox();
            preFilterCheck();
        } else if(window.location.pathname === "/details.html") {
            displayCurrentCocktail();
        }

    },1000);
})
.catch((error) => console.log(error));

// Displaying the images on the page
const displayCocktails = () =>{
    const cocktailsContainer = document.getElementById("cocktail-container");
    const errorDisplay = document.getElementById("no-results");

    if(allDrinksToDisplay.length > 0) {
            cocktailsContainer.style.display = "grid";
            errorDisplay.style.display = "none";
            const allCards = allDrinksToDisplay.map(item=>{
                return `
                    <a class="cards" href="details.html?id=${item.idDrink}" style="background-image:linear-gradient(to bottom, rgba(34, 40, 49, 0) 50%, rgba(34, 40, 49, 1) 100%), url(${item.strDrinkThumb});">
                        <h2>${item.strDrink}</h2>
                    </a>
            `;})
        cocktailsContainer.innerHTML= allCards.join("");
   } else {
        cocktailsContainer.style.display = "none";
        document.getElementById("no-result-message").innerHTML = `SORRY, THERE ARE NO COCKTAILS IN OUR DATABASE THAT CONTAIN ${filters.join(" AND ")}. PLEASE TRY AGAIN.`;
        errorDisplay.style.display = "block";
   }
}

// Details Page - Displaying the images


function displayCurrentCocktail () {
    const urlParams = new URLSearchParams(window.location.search);
    const currentId = urlParams.get("id");

    const currentDrink = allDrinks.filter(item => item.idDrink == currentId)[0];
    console.log(currentDrink);

    const currentIngredients = [];
    for (let i = 1; i <= 15; i++) {
        const objKey = "strIngredient" + i;
        if (currentDrink[objKey] !== null) {
            currentIngredients.push(currentDrink[objKey].toUpperCase());
        }
    }

    const ingredientMeasurments = [];
    for (let i = 1; i <= currentIngredients.length; i++) {
        const objKey = "strMeasure" + i;
        ingredientMeasurments.push(currentDrink[objKey]);
    }

    const cocktailImgSrc = currentDrink.strDrinkThumb;
    const cocktailImgAlt = currentDrink.strDrink;
    const cocktailTitle = currentDrink.strDrink;
    const cocktailIngredients = currentIngredients
    .map((item, index) => {
        if(ingredientMeasurments[index] !== null) {
            return `<button onclick="search('${item}')">${ingredientMeasurments[index].toUpperCase()} ${item}</button>`;
        } else {
            return `<button onclick="search('${item}')">${item}</button>`;
        }
    })
    .join("");
    const cocktailMethod = currentDrink.strInstructions;
    const cocktailServe = currentDrink.strGlass;

    document.querySelector(".current-new-image").setAttribute("src", cocktailImgSrc);
    document.querySelector(".current-new-image").setAttribute("alt", cocktailImgAlt);
    document.querySelector(".current-image-name").innerHTML = cocktailTitle;
    document.getElementById("list-of-ingredients"). innerHTML = cocktailIngredients;
    document.getElementById("cocktail-method"). innerHTML = cocktailMethod;
    document.getElementById("serve-glass").innerHTML = cocktailServe;
    };

// FILTER RESULTS FUNCTION
function addFilterBtnEvntListener() {
    const filterBtn = document.querySelector("#filter-btn");
    const arrow1 = document.getElementById("arrow1");
    const arrow2 = document.getElementById("arrow2");
    const filterContainer = document.querySelector(".filter-container");

    document.getElementById("complexity-slider").addEventListener("input", checkComplexityFilter);
    document.getElementById("complexity-slider").addEventListener("change", updateDrinksToDisplay);

    document.getElementById("contains-alcohol").addEventListener("change", updateDrinksToDisplay);
    document.getElementById("no-contains-alcohol").addEventListener("change", updateDrinksToDisplay);

    filterBtn.addEventListener('click', () => {
        arrow1.classList.toggle('rotate-arrow');
        arrow2.classList.toggle('rotate-arrow');
        filterContainer.classList.toggle('active');
    })
}

function populateFilterBox() {
    const ingredientsBox = document.getElementById("ingreditents");

    const allIngredients = allDrinkIngredients.map(item => `<div class="ingredient-container" id="${item}" onclick="toggleFilter('${item}')"><p>${item}</p></div>`);

    ingredientsBox.innerHTML = allIngredients.join("");

    //THIS IS THE RESET BUTTON FUNCTION
    document.getElementById("reset-filters-btn").addEventListener("click", () => {
        filters.forEach(item => {
            document.getElementById(item).classList.remove("selected");
        });
        filters = [];

        complexityFilterValue = 16;
        document.getElementById("complexity-slider").value = 16;
        document.getElementById("complexity-message").innerHTML = "FILTER OFF";

        document.getElementById("contains-alcohol").checked = false;
        document.getElementById("no-contains-alcohol").checked = false;

        updateDrinksToDisplay();
    })
}

function toggleFilter (ingredient) {
    if(!filters.includes(ingredient)){
        filters.push(ingredient);
    } else {
        i = filters.indexOf(ingredient);
        filters.splice(i, 1);
    }

    const itemSelected = document.getElementById(ingredient);
    itemSelected.classList.toggle("selected");

    console.log(filters);
    console.log(filters.length)

    updateDrinksToDisplay();
}

function updateDrinksToDisplay () {
    allDrinksToDisplay = allDrinks;

    //FILTER FOR INGREDIENTS
    if(filters.length !== 0){
        filters.forEach(ingredientName => {
            const newArr = allDrinksToDisplay.filter(cocktailObj => {
                for (let i = 1; i <= 15; i++) {
                    const objKey = "strIngredient" + i;
                    if (cocktailObj[objKey] && cocktailObj[objKey].toUpperCase() === ingredientName){
                        return true;
                    }
                }
                return false;
            })
            allDrinksToDisplay = newArr;
        });
    }

    //FILTER FOR COMPLEXITY
    if(complexityFilterValue !== 16){
        const filteredForComplexity = allDrinksToDisplay.filter(cocktailObj => {
            let ingredientCounter = 0;
            for (let i = 1; i <= 15; i++) {
                const objKey = "strIngredient" + i;
                if(cocktailObj[objKey] !== null){
                    ingredientCounter++;
                }
            }
            if(ingredientCounter < complexityFilterValue){
                return true;
            } else {
                return false;
            }
        });
        allDrinksToDisplay = filteredForComplexity;
    }

    //FILTER FOR ALCOHOL
    const containsAlcoholRadio = document.getElementById("contains-alcohol");
    const noContainsAlcoholRadio = document.getElementById("no-contains-alcohol");

    if(containsAlcoholRadio.checked == true) {
        let alcoholFilteredArray = allDrinksToDisplay.filter(cocktailObj => cocktailObj.strAlcoholic === "Alcoholic");
        allDrinksToDisplay = alcoholFilteredArray;
    } else if (noContainsAlcoholRadio.checked == true) {
        let alcoholFilteredArray = allDrinksToDisplay.filter(cocktailObj => cocktailObj.strAlcoholic !== "Alcoholic");
        allDrinksToDisplay = alcoholFilteredArray;
    }

    displayCocktails();
}


function preFilterCheck () {
    const currentId = new URLSearchParams(window.location.search).get("id");
    if(currentId !== null){
        toggleFilter(currentId);
    } else {
        updateDrinksToDisplay();
    }
};

function checkComplexityFilter () {
    const complexitySlider = document.getElementById("complexity-slider");
    const complexityMessage = document.getElementById("complexity-message");

    const complexityValue = complexitySlider.value;
    complexityFilterValue = complexityValue;

    if(complexityValue == 16) {
        complexityMessage.innerHTML = "FILTER OFF";
    } else {
        complexityMessage.innerHTML = `${complexityValue} INGREDIENTS`;
    }
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
                return `<p class="predictive-search-item index-predictive-search-item" onclick="search('${item}')">${item}</p>`;
            });

            if(predictiveSearchList.length > 5) {
                resultHTML.push('<p class="predictive-search-item index-predictive-search-item">...</p>');
            }

            if(firstFiveResults.length === 0){
                mainPredictiveSearchContainer.innerHTML = '<p class="predictive-search-item index-predictive-search-item">SORRY, NO RESULTS</p>'
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

    document.getElementById("browse-index-btn").addEventListener("click", () => {window.location.href = `./browse.html`});
    document.getElementById("quiz-index-btn").addEventListener("click", () => {window.location.href = `./quiz.html`});
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

//MOBILE MENU

let mobileMenuOpen = false;

const mobileMenuBtn = document.getElementById("mobile-menu-btn");

mobileMenuBtn.addEventListener("click", () => {
    if (mobileMenuOpen) {
        mobileMenuOpen = false;
        mobileMenuBtn.innerHTML = "&#9776;";
        document.querySelector("nav").style.height = "0";
        document.querySelector(".mobile-menu-bg-screen").style.opacity = "0";
    } else {
        mobileMenuOpen = true;
        mobileMenuBtn.innerHTML = "&#120299;";
        document.querySelector("nav").style.height = "290px";
        document.querySelector(".mobile-menu-bg-screen").style.opacity = ".9";
    }
});

// -- RANDOM COCKTAIL FEATURE

const navLinkRandom = document.getElementById("random-cocktail-nav-btn");
const randomIndexBtn = document.getElementById("random-index-btn");
const getRandomIndex = (max) => Math.floor(Math.random() * max);

    // Fn to open details page using a random idDrink
function showRandom() {
    const randomInteger = getRandomIndex(allDrinks.length);
    const randomDrinkObject = allDrinks[randomInteger];
    const randomDrinkById = randomDrinkObject.idDrink;

    window.location.href = `./details.html?id=${randomDrinkById}`;
}

// "Discover" button on home page
navLinkRandom.addEventListener("click", showRandom);
randomIndexBtn.addEventListener("click", showRandom);