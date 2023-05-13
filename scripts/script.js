const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const allDrinks = [];

for (let i = 0; i < alphabet.length; i++){
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${alphabet[i]}`)
    .then((result) => result.json())
    .then((json) => {
        console.log(json);
        json.drinks.forEach((item) => {
            allDrinks.push(item);
        })
    })
    .catch((error) => console.log(error));
}

//this is a work-around. We will use a promise in the future!
setTimeout(()=>{console.log(allDrinks)}, 2000);