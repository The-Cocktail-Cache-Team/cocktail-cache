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
        document.querySelector("footer").style.display = "flex";
        document.querySelector("#index-page").style.display = "flex";
    },1000);
})    
.catch((error) => console.log(error));