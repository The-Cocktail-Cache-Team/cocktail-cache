//API fetch code - using local api for now

let allDrinks;

fetch(`cocktaildb_api_clone_local.txt`)
.then((result) => result.json())
.then((json) => {
    allDrinks = json.drinks;
    return allDrinks;
    }
)
.then(() => {
    console.log(allDrinks);
    // code here to switch from loading screen to display data
    setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.querySelector("main").style.display = "flex";
        if(window.location.pathname === "/browse.html"){
            displayCocktails(allDrinks); 
        } else if (window.location.pathname === "/details.html"){
            displayCurrentCocktail ();
        }
    }, 1000);
})    
.catch((error) => console.log(error));

// Displaying the images on the page
const displayCocktails = list =>{
    const cocktailsContainer = document.getElementById("cocktail-container");
    const allCards = list.map(item=>{
        return `
        <a class="cards" href="details.html?id=${item.idDrink}" style="background-image:linear-gradient(to bottom, rgba(34, 40, 49, 0) 50%, rgba(34, 40, 49, 1) 100%), url(${item.strDrinkThumb});">
        <h2>${item.strDrink}</h2>
        </a>
        `;})
        cocktailsContainer.innerHTML= allCards.join("");
    };
    
    
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

    const dropdownArrows = document.querySelector(".down-arrows");
    const filterBtns = document.querySelector(".filter-btns");
    
    dropdownArrows.addEventListener('click', () => {
        dropdownArrows.classList.toggle('active');
        filterBtns.classList.toggle('active');
    })
    
