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
            displayCocktails(allDrinks);
        }, 1000);
    })
    .catch((error) => console.log(error));



// Displaying the images on the page
const displayCocktails = list => {
    const cocktailsContainer = document.getElementById("cocktail-container");
    const allCards = list.map(item => {
        return `
            <a class="cards" href="details.html?id=${item.idDrink}" style="background-image:linear-gradient(to bottom, rgba(34, 40, 49, 0) 50%, rgba(34, 40, 49, 1) 100%), url(${item.strDrinkThumb});">
                <h2>${item.strDrink}</h2>
            </a>
    `;
    })
    cocktailsContainer.innerHTML = allCards.join("");
}



///////NAV BAR SEARCH FEATURES///////
const searchInput = document.getElementById("nav-search-input");
const searchBtn = document.getElementById("nav-search-btn");
const predictiveSearchContainer = document.getElementById("predictive-search-results");

searchInput.oninput = () => {
    if (searchInput.value !== "") {
        predictiveSearchContainer.style.display = "block";
        const predictiveSearchList = allDrinkNamesAndIngredients.filter(item => item.includes(searchInput.value.toUpperCase()));

        const firstFiveResults = predictiveSearchList.filter((item, index) => index < 5);

        const resultHTML = firstFiveResults.map(item => {
            return `<p class="predictive-search-item" onclick="search('${item}')">${item}</p>`;
        });

        if (predictiveSearchList.length > 5) {
            resultHTML.push('<p class="predictive-search-item">...</p>');
        }

        if (firstFiveResults.length === 0) {
            predictiveSearchContainer.innerHTML = '<p class="predictive-search-item">SORRY, NO RESULTS</p>'
        } else {
            predictiveSearchContainer.innerHTML = resultHTML.join("");
        }

    } else {
        predictiveSearchContainer.style.display = "none";
        predictiveSearchContainer.innerHTML = "";
    }
};

searchBtn.onclick = e => {
    e.preventDefault();
    if (allDrinkNamesAndIngredients.includes(searchInput.value.toUpperCase())) {
        search(searchInput.value.toUpperCase());
    }
};

const mainSearchInput = document.getElementById("main-search-input");
const mainSearchBtn = document.getElementById("main-search-btn");
const mainPredictiveSearchContainer = document.getElementById("main-predictive-search-results");

mainSearchInput.oninput = () => {
    if (mainSearchInput.value !== "") {
        mainPredictiveSearchContainer.style.display = "block";
        const predictiveSearchList = allDrinkNamesAndIngredients.filter(item => item.includes(mainSearchInput.value.toUpperCase()));

        const firstFiveResults = predictiveSearchList.filter((item, index) => index < 5);

        const resultHTML = firstFiveResults.map(item => {
            return `<p class="predictive-search-item" onclick="search('${item}')">${item}</p>`;
        });

        if (predictiveSearchList.length > 5) {
            resultHTML.push('<p class="predictive-search-item">...</p>');
        }

        if (firstFiveResults.length === 0) {
            mainPredictiveSearchContainer.innerHTML = '<p class="predictive-search-item">SORRY, NO RESULTS</p>'
        } else {
            mainPredictiveSearchContainer.innerHTML = resultHTML.join("");
        }

    } else {
        mainPredictiveSearchContainer.style.display = "none";
        mainPredictiveSearchContainer.innerHTML = "";
    }
};

mainSearchBtn.onclick = e => {
    e.preventDefault();
    if (allDrinkNamesAndIngredients.includes(mainSearchInput.value.toUpperCase())) {
        search(mainSearchInput.value.toUpperCase());
    }
};


function search(searchString) {
    console.log(searchInput.value.toUpperCase());
    const isSearchingForCocktail = allDrinkNames.some(item => item === searchString);

    if (isSearchingForCocktail) {
        const cocktail = allDrinks.find(item => item.strDrink.toUpperCase() === searchString);
        window.location.href = `./details.html?id=${cocktail.idDrink}`;
    } else {
        window.location.href = `./browse.html?id=${searchString}`;
    }
}