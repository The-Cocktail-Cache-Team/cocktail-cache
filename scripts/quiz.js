// Quiz data
let allDrinks;

fetch('cocktaildb_api_clone_local.txt')
  .then((result) => result.json())
  .then((json) => {
    allDrinks = json.drinks;
    return allDrinks;
  })
  .then(() => {  

const questions = [
    {
      question: "First things first: Do you want your drink to include alcohol?",
      key: 'strAlcoholic',
        options: [ "Yes, booze me up please!", "No thanks, get me a mocktail!"],  // strAlcoholic: "Alcoholic"
         // strAlcoholic: "Non alcoholic" OR "Optional alcohol"
      
    },
    {
      question: "Pick your favorite glass to drink out of: ",
      key: 'strGlass',
      options: ["Highball glass", "Coffee mug", "Shot glass", "Cocktail glass", "Mason Jar"],
    },
    {
      question: "Do you prefer your drink recipe to have a simple or complex list of ingredients?",
      key: 'strIngredient',
      options: ["The simpler, the better", "Give me something more complex"],
       // 3 or less ingredients, strIngredient1 etc.
       // 4 or more ingredients
      
    },
    {
      question: "Do you prefer your drinks to have juice in them?",
      options: ["Yes", "No"],
    },
  
  ];
})

.catch((error) => {
  console.error('Error fetching API data:', error);
});

const quizContainer = document.getElementById('quiz-container');
const optionsContainer = document.getElementById('options-container');

questions.forEach((question, index) => {
  const questionElement = document.createElement('h3');
  questionElement.textContent = `Q${index + 1}: ${question.question}`;
  quizContainer.appendChild(questionElement);

  const optionsElement = document.createElement('div');
  question.options.forEach((option) => {
    const optionElement = document.createElement('button');
    optionElement.textContent = option;
    optionsContainer.appendChild(optionElement);
  });
  quizContainer.appendChild(optionsElement);
});

const chosenOptions = [];

function handleOptionSelect(event) {
  const selectedOption = event.target.textContent;
  chosenOptions.push(selectedOption);
  if (chosenOptions.length === questions.length) {
    const result = calculateResult();
    displayResult(result);
  }
}

function calculateResult() {

}

function displayResult(result) {
  
}

// const optionsContainer = document.getElementById('options-container');
optionsContainer.forEach((container) => {
  container.addEventListener('click', handleOptionSelect);
});



  
//   let currentQuestion = 0;
//   let totalScore = 0;
  
  function loadQuestion() {
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = "";
  
    const question = document.createElement("h2");
    question.textContent = quizQuestions[currentQuestion].question;
    questionContainer.appendChild(question);
  
    const options = quizQuestions[currentQuestion].options;
    options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option.label;
      button.addEventListener("click", () => {
        totalScore += option.score;
        nextQuestion();
      });
      questionContainer.appendChild(button);
    });
  }
  
  function nextQuestion() {
    if (currentQuestion === 0) {
      currentQuestion++;
      loadQuestion();
    } else if (currentQuestion < quizQuestions.length - 1) {
      const questionContainer = document.getElementById("question-container");
      questionContainer.style.marginLeft = `-${(currentQuestion + 1) * 100}%`;
      currentQuestion++;
    } else {
      fetchResults();
    }
  }
  
  function fetchResults() {
    const resultRanges = [
      
    ];
  }
  
    let selectedCategory = "";
  
    // Find the matching category based on the totalScore
    for (const range of resultRanges) {
      if (totalScore >= range.minScore && totalScore <= range.maxScore) {
        selectedCategory = range.category;
        break;
      }
    }
  
    // Fetch cocktails from the API based on the selected category
//     let allDrinks;

// fetch(`cocktaildb_api_clone_local.txt`)
// .then((result) => result.json())
// .then((json) => {
//     allDrinks = json.drinks;
//     return allDrinks;
//     }
// )
// .then(() => {
//     console.log(allDrinks);

    const apiUrl = `cocktaildb_api_clone_local.txt`;
  
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Handle the response and display the result
        const resultContainer = document.getElementById("result-container");
  
        if (data.drinks && data.drinks.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.drinks.length);
          const randomCocktail = data.drinks[randomIndex];
  
          const result = document.createElement("h2");
          result.textContent = `You are: ${randomCocktail.strDrink}`;
          resultContainer.appendChild(result);
        } else {
          const result = document.createElement("p");
          result.textContent = "No cocktail found for your result";
          resultContainer.appendChild(result);
        }
      })
      .catch((error) => {
        console.log("Error fetching results:", error);
      });
  