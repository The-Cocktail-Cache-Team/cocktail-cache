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
        displayCocktails(allDrinks);
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