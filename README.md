- added google font links to index.html head
- made general css for color shceme and fonts
- note: please use var() to set site colors as this will make it easier to do site wide changes later


Check if we can use:
https://www.thecocktaildb.com/api/json/v2/9973533/search.php?s=
from
https://stackoverflow.com/questions/72358653/filtering-an-array-of-arrays-with-another-array-to-return-only-combination-of-ma




script backups for API fetch

// // added numbers to array to increase allDrinks from 425 => 441!
// const alphabetAndNumbers = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '9'];

// const allDrinks = [];

// const getAllCocktails = new Promise((resolve, reject) => {
//     alphabetAndNumbers.forEach((value, index) => {
//         fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${value}`)
//         .then((result) => result.json())
//         .then((json) => {
//             if (json.drinks !== null) {
//                 json.drinks.forEach((item) => {
//                     allDrinks.push(item);
//                 })
//             }
//         })
//         .catch((error) => console.log(error));
//         if (index === alphabetAndNumbers.length - 1) resolve();
//     });
// });

// getAllCocktails.then(() => {
//     console.log(allDrinks);
// });


// const allDrinks = [];

// const getAllCocktails = new Promise((resolve, reject) => {
//     fetch(`cocktaildb_api_clone_local.txt`)
//     .then((result) => result.json())
//     .then((json) => {
//         if (json.drinks !== null) {
//             json.drinks.forEach((item) => {
//                 allDrinks.push(item);
//             })
//         }
//     })
//     .catch((error) => console.log(error));
//     resolve();
// });

// getAllCocktails.then(() => {
//     // const coctktailImg = allDrinks[0].strDrinkThumb + "/preview";
//     // displayImages.setAttribute("src", coctktailImg);
//     console.log(allDrinks.length);
// });