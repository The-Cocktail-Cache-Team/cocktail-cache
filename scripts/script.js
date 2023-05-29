//Global Variables
let allDrinks;
let allDrinkNames;
let allDrinkIngredients = [];
let allDrinkNamesAndIngredients;
let filters = [];
let allDrinksToDisplay = [];
let complexityFilterValue = 16;
let chosenOptions = [];
let questionTracker = 0;

//API Fetch and populate global variables with cocktail list - using local API for now
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

    // sort array in alphabetical order
    allDrinkNames.sort();
    allDrinkIngredients.sort();
    allDrinkNamesAndIngredients.sort();

    // stop displaying loading screen and show main content.
    setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.querySelector("main").style.display = "flex";

        //runs additional function based on page to prevent site bugs
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

// Renders cards html based on allDrinksToDisplay array
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

// Renders content for details page based on ID in URL
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

    const ingredientMeasurements = [];
    for (let i = 1; i <= currentIngredients.length; i++) {
        const objKey = "strMeasure" + i;
        ingredientMeasurements.push(currentDrink[objKey]);
    }

    const cocktailImgSrc = currentDrink.strDrinkThumb;
    const cocktailImgAlt = currentDrink.strDrink;
    const cocktailTitle = currentDrink.strDrink;
    const cocktailIngredients = currentIngredients
    .map((item, index) => {
        if(ingredientMeasurements[index] !== null) {
            return `<button onclick="search('${item}')">${ingredientMeasurements[index].toUpperCase()} ${item}</button>`;
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

// Filter button interactivity for browse page
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

//Renders buttons for the filter box on the browse page
function populateFilterBox() {
    const ingredientsBox = document.getElementById("ingredients");

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

// add or removes ingredient filter when clicking an ingredient
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

//updates the allDrinksToDisplay array with objects that fit all filter criteria
function updateDrinksToDisplay () {
    //Start with all drinks
    allDrinksToDisplay = allDrinks;

    //Loop through array filtering out each chosen filter
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

    //Loop through array filtering out each maximum ingredient input
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

    //Loop through array filtering out chosen alcoholic input
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

//Checks if URL has pre-selected filter and adds filter before loading cards
function preFilterCheck () {
    const currentId = new URLSearchParams(window.location.search).get("id");
    if(currentId !== null){
        toggleFilter(currentId);
    } else {
        updateDrinksToDisplay();
    }
};

//Interactive number update with max ingredient slider
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

//Navigation Bar - Input & Predictive Search 
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

//Navigation bar - Search Button
searchBtn.onclick = e => {
    e.preventDefault();
    if(allDrinkNamesAndIngredients.includes(searchInput.value.toUpperCase())) {
        search(searchInput.value.toUpperCase());
    }
};

//Runs code only for Index page to prevent site bugs
if(window.location.pathname === "/index.html"){
    const mainSearchInput = document.getElementById("main-search-input");
    const mainSearchBtn = document.getElementById("main-search-btn");
    const mainPredictiveSearchContainer = document.getElementById("main-predictive-search-results");

    //Index Navigation Bar - Input & Predictive Search 
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

    //Index Navigation bar - Search Button
    mainSearchBtn.onclick = e => {
        e.preventDefault();
        if(allDrinkNamesAndIngredients.includes(mainSearchInput.value.toUpperCase())) {
            search(mainSearchInput.value.toUpperCase());
        }
    };

    //Index Page Browse/ Quiz Big Buttons
    document.getElementById("browse-index-btn").addEventListener("click", () => {window.location.href = "./browse.html"})
    document.getElementById("quiz-index-btn").addEventListener("click", () => {window.location.href = "./quiz.html"})

    //Index Page Big Random Button
    const randomIndexBtn = document.getElementById("random-index-btn");
    randomIndexBtn.addEventListener("click", showRandom);
};

//Navigate to drink or browse page with filter
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

//Mobile Nav
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

// RANDOM COCKTAIL FEATURE
const navLinkRandom = document.getElementById("random-cocktail-nav-btn");
navLinkRandom.addEventListener("click", showRandom);

const getRandomIndex = max => Math.floor(Math.random() * max);

// Fn to open details page using a random idDrink
function showRandom() {
    const randomInteger = getRandomIndex(allDrinks.length);
    const randomDrinkObject = allDrinks[randomInteger];
    const randomDrinkById = randomDrinkObject.idDrink;

    window.location.href = `./details.html?id=${randomDrinkById}`;
}

//Runs code only for quiz page to prevent site bugs
if(window.location.pathname === "/quiz.html") {
    const quizTitle = document.querySelector("#quiz-container h1");

    document.addEventListener("DOMContentLoaded", function() {
        quizTitle.classList.add("show");
      });

//store questions and options
    const questions = [
        {
        question: "First things first - Do you want your drink to include alcohol?",
        key: 'strAlcoholic',
        options: ["Yes, booze me up please!", "No thanks, get me a mocktail!"]
        },
        {
        question: "Pick your favorite glass to drink out of:",
        key: 'strGlass',
        options: ["Highball glass", "Coffee mug", "Shot glass", "Cocktail glass", "Mason Jar"]
        },
        {
        question: "Do you prefer your drink recipe to have a shorter or longer list of ingredients?",
        key: 'strIngredient',
        options: ["The simpler, the better", "Give me something more complex"]
        }
    ];

    const questionContainer = document.getElementById('question-container');
    const options = document.getElementById('options-container');
    const results = document.getElementById('result-container');

    //Utility function to load questions and generate html elements using tracking variable
    function loadQuestion() {
        questionContainer.innerHTML = ""; 
        options.innerHTML = "";
        results.innerHTML = "";
    
        const currentQuestion = questions[questionTracker];
        const questionElement = document.createElement("p");
        questionElement.textContent = `Q${questionTracker + 1}: ${currentQuestion.question}`;
        questionContainer.appendChild(questionElement);
    
        currentQuestion.options.forEach((option) => {
            const optionElement = document.createElement("button");
            optionElement.textContent = option;
            optionElement.addEventListener("click", handleOptionSelect);
            options.appendChild(optionElement);
        });
    };

    //Load first question on page load
    loadQuestion();

    //Stores answer and loads next question or finishes quiz
    function handleOptionSelect(event) {
        event.preventDefault();
        const selectedOption = event.target.textContent;
        chosenOptions.push(selectedOption);
        questionTracker++;
        if (chosenOptions.length === questions.length) {
            calculateResult();
        } else {
            loadQuestion();
        }
    };

    //Finds cocktail match based on quiz answers
    function calculateResult() {
        document.addEventListener("DOMContentLoaded", function() {
            const title = document.querySelector("#quiz-container h1");
            title.classList.add("show");
        });

        // Filter drinks based on chosen options
        let filteredDrinks = allDrinks.filter(drink => {
        // Check first question: alcohol preference
        const alcoholOption = chosenOptions[0];
        let isAlcoholic = true;
        if (drink.strAlcoholic === "Optional alcohol") {
            return drink
        } else if (alcoholOption === "Yes, booze me up please!" && drink.strAlcoholic === "Alcoholic") {
            return drink;
        } else if (alcoholOption === "No thanks, get me a mocktail!" && drink.strAlcoholic === "Non alcoholic") {
            return drink;
        }});


        // Check second question: glass preference
        let filterDrinks2 = filteredDrinks.filter(drink => {
            if (drink.strGlass === chosenOptions[1]) {
                return drink;
            }
        });
    
        // Check third question: ingredients
        let filterDrinks3 = filterDrinks2.filter(drink => {
            let ingredientCounter = 0;
            for (let i = 1; i <= 15; i++) {
                const objKey = "strIngredient" + i;
                if (drink[objKey] !== null) {
                    ingredientCounter++;
                }};
                if (chosenOptions[2] === "The simpler, the better" && ingredientCounter <= 7) {
                    return drink;
                } else if (chosenOptions[2] === "Give me something more complex" && ingredientCounter >= 7) {
                    return drink;
                };
        });


        //Checks there is a match, reduces filtering if not
        let resultAccuracy = 100;

        if (filterDrinks3.length < 1) {
            filterDrinks3 = filterDrinks2;
            resultAccuracy = 66;
        };

        if (filterDrinks2.length < 1) {
            filterDrinks3 = filteredDrinks;
            resultAccuracy = 33;
        };
    
        const randomInteger = getRandomIndex(filterDrinks3.length);
        const randomDrinkId = filterDrinks3[randomInteger].idDrink;

        //present user with match %
        quizTitle.style.display = "none";
        questionContainer.style.display = "none";
        options.style.display = "none";
        results.style.display = "flex";

        const resultMessage = document.createElement("h2");
        resultMessage.innerHTML = `FOUND A ${resultAccuracy}% COCKTAIL MATCH`;
        results.appendChild(resultMessage);

        const resultLoadingBar = document.createElement("div");
        resultLoadingBar.classList.add("loading-bar");

        const resultLoadingBarInner = document.createElement("div");
        resultLoadingBarInner.classList.add("loading-bar-inner");

        resultLoadingBar.appendChild(resultLoadingBarInner);
        results.appendChild(resultLoadingBar);

    
        setTimeout(() => {
            resultLoadingBarInner.style.width = "calc(100% + 4px)";
        }, 0)

        setTimeout(() => {
            window.location.href = `./details.html?id=${randomDrinkId}`;
        }, 2500)
    };
};
