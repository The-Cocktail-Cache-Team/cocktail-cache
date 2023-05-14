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
    //code here to switch from loading screen to display data
})    
.catch((error) => console.log(error));