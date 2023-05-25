// Quiz data
let allDrinks;
const chosenOptions = [];

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
      options: ["Yes, booze me up please!", "No thanks, get me a mocktail!"],
    },
    {
      question: "Pick your favorite glass to drink out of:",
      key: 'strGlass',
      options: ["Highball glass", "Coffee mug", "Shot glass", "Cocktail glass", "Mason Jar"],
    },
    {
      question: "Do you prefer your drink recipe to have a simple or complex list of ingredients?",
      key: 'strIngredient',
      options: ["The simpler, the better", "Give me something more complex"],
    },
  ];

  createQuestionElements();
});
    function createQuestionElements() {
      const quizContainer = document.getElementById('quiz-container');
      questions.forEach(question, index) => {
        const questionElement = document.createElement('h3');
        questionElement.textContent = `Q${index + 1}: ${question.question}`;
        quizContainer.appendChild(questionElement)};
    
        const optionsElement = document.getElementById('options-container');
        question.options.forEach((option) => {
          const optionElement = document.createElement('button');
          optionElement.textContent = option;
          optionsElement.appendChild(optionElement);
          optionElement.addEventListener('click', handleOptionSelect);
        });
        quizContainer.appendChild(optionsElement);
    }

    createQuestionElements();

    function loadQuestion() {
      const questionContainer = document.getElementById("question-container");
      questionContainer.innerHTML = ""; // Clear previous question
    
      const currentQuestionIndex = chosenOptions.length;
      const currentQuestion = questions[currentQuestionIndex];
    
      const questionElement = document.createElement("h2");
      questionElement.textContent = `Q${currentQuestionIndex + 1}: ${currentQuestion.question}`;
      questionContainer.appendChild(questionElement);
    
      const optionsElement = document.createElement("div");
      currentQuestion.options.forEach((option) => {
        const optionElement = document.createElement("button");
        optionElement.textContent = option;
        optionsElement.appendChild(optionElement);
        optionElement.addEventListener("click", handleOptionSelect);
      });
      questionContainer.appendChild(optionsElement);
    };
    loadQuestion();

quizContainer.addEventListener('submit', handleFormSubmit);
    
    function handleOptionSelect(event) {
      const selectedOption = event.target.textContent;
      chosenOptions.push(selectedOption);
      
      if (chosenOptions.length === questions.length) {
        const result = calculateResult();
        displayResult(result);
      }
    };
    handleOptionSelect();


function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission
  
  // Empty array to store user's answers
  let userAnswers = [];
  
  // Iterate through each question
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    
    // Get the selected radio button for the current question
    const selectedRadio = document.querySelector(`input[name="question${i}"]:checked`);
    
    if (selectedRadio) {
      userAnswers.push(selectedRadio.value);
    } else {
      console.log("Please select an option");
    }
  }
  
  calculateResult(userAnswers);
};
    handleFormSubmit();


    function calculateResult() {
      let filteredDrinks = [];
    
      // Filter drinks based on chosen options
      filteredDrinks = allDrinks.filter(drink => {
        // Check first question: alcohol preference
        const alcoholOption = chosenOptions[0];
        if (alcoholOption === "Yes, booze me up please!") {
          return drink.strAlcoholic === "Alcoholic";
        } else if (alcoholOption === "No thanks, get me a mocktail!") {
          return drink.strAlcoholic === "Non alcoholic" && drink.strAlcoholic === "Optional alcohol";
        };
    
        // Check second question: glass preference
        const glassOption = chosenOptions[1];
        return drink.strGlass === glassOption;
      });
      calculateResult();
    
      // Calculate score based on the number of filtered drinks
      const score = filteredDrinks.length;
    
      // Return result object with the filtered drinks and the score
      return {
        filteredDrinks,
        score
      };
    };
    calculateResult();
    
    function displayResult(result) {
      const resultContainer = document.getElementById("result-container");
      resultContainer.innerHTML = ""; // Clear the previous result
    
      if (result.filteredDrinks.length > 0) {
        const randomIndex = Math.floor(Math.random() * result.filteredDrinks.length);
        const randomCocktail = result.filteredDrinks[randomIndex];
    
        const resultElement = document.createElement("h2");
        resultElement.textContent = `You got: ${randomCocktail.strDrink}`;
        resultContainer.appendChild(resultElement);
      } else {
        const resultElement = document.createElement("p");
        resultElement.textContent = "No matching drink found for your preferences";
        resultContainer.appendChild(resultElement);
      }
    };
    displayResult();

  //   fetch('cocktaildb_api_clone_local.txt')
  // .then((result) => result.json())
  // .then((json) => {
  //   allDrinks = json.drinks;
  //   return allDrinks;
  // })
  // .then(() => {
  //   const questions = [
  //     {
  //       question: "First things first: Do you want your drink to include alcohol?",
  //       key: 'strAlcoholic',
  //       options: ["Yes, booze me up please!", "No thanks, get me a mocktail!"],
  //     },
  //     {
  //       question: "Pick your favorite glass to drink out of:",
  //       key: 'strGlass',
  //       options: ["Highball glass", "Coffee mug", "Shot glass", "Cocktail glass", "Mason Jar"],
  //     },
  //     {
  //       question: "Do you prefer your drink recipe to have a simple or complex list of ingredients?",
  //       key: 'strIngredient',
  //       options: ["The simpler, the better", "Give me something more complex"],
  //     },
  //   ];

  //   createQuestionElements();
  // });
