const level1Questions = [
    {
      questionText: "What is the capital of Spain?",
      answerOptions: [
        { answerText: "London", isCorrect: false },
        { answerText: "Paris", isCorrect: false },
        { answerText: "Berlin", isCorrect: false },
        { answerText: "Madrid", isCorrect: true }
      ]
    },
    {
      questionText: "What is the largest ocean on Earth?",
      answerOptions: [
        { answerText: "Atlantic Ocean", isCorrect: false },
        { answerText: "Indian Ocean", isCorrect: false },
        { answerText: "Arctic Ocean", isCorrect: false },
        { answerText: "Pacific Ocean", isCorrect: true }
      ]
    },
    {
      questionText: "How many continents are there on Earth?",
      answerOptions: [
        { answerText: "Five", isCorrect: true },
        { answerText: "Six", isCorrect: false },
        { answerText: "Seven", isCorrect: false },
        { answerText: "Eight", isCorrect: false }
      ]
    },
    {
      questionText: "Who painted the Mona Lisa?",
      answerOptions: [
        { answerText: "Pablo Picasso", isCorrect: false },
        { answerText: "Leonardo da Vinci", isCorrect: true },
        { answerText: "Vincent van Gogh", isCorrect: false },
        { answerText: "Michelangelo", isCorrect: false }
      ]
    },
    {
      questionText: "What is the chemical symbol for water?",
      answerOptions: [
        { answerText: "W", isCorrect: false },
        { answerText: "O", isCorrect: false },
        { answerText: "H2O", isCorrect: true },
        { answerText: "H2", isCorrect: false }
      ]
    },
    {
      questionText: "Who wrote 'Romeo and Juliet'?",
      answerOptions: [
        { answerText: "William Shakespeare", isCorrect: true },
        { answerText: "Charles Dickens", isCorrect: false },
        { answerText: "Jane Austen", isCorrect: false },
        { answerText: "Mark Twain", isCorrect: false }
      ]
    },
    {
      questionText: "What is the tallest mammal?",
      answerOptions: [
        { answerText: "Elephant", isCorrect: false },
        { answerText: "Giraffe", isCorrect: true },
        { answerText: "Whale", isCorrect: false },
        { answerText: "Horse", isCorrect: false }
      ]
    },
    {
      questionText: "What is the capital of Japan?",
      answerOptions: [
        { answerText: "Beijing", isCorrect: false },
        { answerText: "Tokyo", isCorrect: true },
        { answerText: "Seoul", isCorrect: false },
        { answerText: "Bangkok", isCorrect: false }
      ]
    },
    {
      questionText: "How many colors are there in a rainbow?",
      answerOptions: [
        { answerText: "Five", isCorrect: false },
        { answerText: "Six", isCorrect: false },
        { answerText: "Seven", isCorrect: true },
        { answerText: "Eight", isCorrect: false }
      ]
    },
    {
      questionText: "What is the fastest land animal?",
      answerOptions: [
        { answerText: "Cheetah", isCorrect: true },
        { answerText: "Lion", isCorrect: false },
        { answerText: "Gazelle", isCorrect: false },
        { answerText: "Leopard", isCorrect: false }
      ]
    },
    {
      questionText: "What is the smallest planet in our solar system?",
      answerOptions: [
        { answerText: "Mercury", isCorrect: true },
        { answerText: "Venus", isCorrect: false },
        { answerText: "Earth", isCorrect: false },
        { answerText: "Mars", isCorrect: false }
      ]
    },
    {
      questionText: "Which country is known as the Land of the Rising Sun?",
      answerOptions: [
        { answerText: "China", isCorrect: false },
        { answerText: "India", isCorrect: false },
        { answerText: "Japan", isCorrect: true },
        { answerText: "Korea", isCorrect: false }
      ]
    },
    {
      questionText: "What is the largest mammal?",
      answerOptions: [
        { answerText: "Elephant", isCorrect: false },
        { answerText: "Blue Whale", isCorrect: true },
        { answerText: "Giraffe", isCorrect: false },
        { answerText: "Hippopotamus", isCorrect: false }
      ]
    },
    {
      questionText: "Who invented the light bulb?",
      answerOptions: [
        { answerText: "Thomas Edison", isCorrect: true },
        { answerText: "Alexander Graham Bell", isCorrect: false },
        { answerText: "Nikola Tesla", isCorrect: false },
        { answerText: "Albert Einstein", isCorrect: false }
      ]
    },
    {
      questionText: "What is the currency of the United Kingdom?",
      answerOptions: [
        { answerText: "Euro", isCorrect: false },
        { answerText: "Pound Sterling", isCorrect: true },
        { answerText: "Dollar", isCorrect: false },
        { answerText: "Yen", isCorrect: false }
      ]
    },
    {
      questionText: "What is the largest bird in the world?",
      answerOptions: [
        { answerText: "Ostrich", isCorrect: true },
        { answerText: "Eagle", isCorrect: false },
        { answerText: "Penguin", isCorrect: false },
        { answerText: "Albatross", isCorrect: false }
      ]
    },
    {
      questionText: "Which planet is known as the Red Planet?",
      answerOptions: [
        { answerText: "Mars", isCorrect: true },
        { answerText: "Venus", isCorrect: false },
        { answerText: "Jupiter", isCorrect: false },
        { answerText: "Saturn", isCorrect: false }
      ]
    },
    {
      questionText: "Who painted the 'Starry Night'?",
      answerOptions: [
        { answerText: "Pablo Picasso", isCorrect: false },
        { answerText: "Vincent van Gogh", isCorrect: true },
        { answerText: "Leonardo da Vinci", isCorrect: false },
        { answerText: "Claude Monet", isCorrect: false }
      ]
    },
    {
      questionText: "What is the capital of Canada?",
      answerOptions: [
        { answerText: "Toronto", isCorrect: false },
        { answerText: "Ottawa", isCorrect: true },
        { answerText: "Montreal", isCorrect: false },
        { answerText: "Vancouver", isCorrect: false }
      ]
    },
    {
      questionText: "How many legs does a spider have?",
      answerOptions: [
        { answerText: "Six", isCorrect: false },
        { answerText: "Eight", isCorrect: true },
        { answerText: "Ten", isCorrect: false },
        { answerText: "Twelve", isCorrect: false }
      ]
    },
    {
      questionText: "What is the chemical symbol for gold?",
      answerOptions: [
        { answerText: "Au", isCorrect: true },
        { answerText: "Ag", isCorrect: false },
        { answerText: "Cu", isCorrect: false },
        { answerText: "Fe", isCorrect: false }
      ]
    },
    {
      questionText: "What is the largest desert in the world?",
      answerOptions: [
        { answerText: "Gobi Desert", isCorrect: false },
        { answerText: "Sahara Desert", isCorrect: true },
        { answerText: "Arabian Desert", isCorrect: false },
        { answerText: "Kalahari Desert", isCorrect: false }
      ]
    },
    {
      questionText: "What is the primary ingredient in guacamole?",
      answerOptions: [
        { answerText: "Tomato", isCorrect: false },
        { answerText: "Onion", isCorrect: false },
        { answerText: "Avocado", isCorrect: true },
        { answerText: "Lime", isCorrect: false }
      ]
    },
    {
      questionText: "What is the chemical symbol for oxygen?",
      answerOptions: [
        { answerText: "O", isCorrect: true },
        { answerText: "O2", isCorrect: false },
        { answerText: "H2O", isCorrect: false },
        { answerText: "C", isCorrect: false }
      ]
    },
    {
      questionText: "Who wrote 'To Kill a Mockingbird'?",
      answerOptions: [
        { answerText: "Harper Lee", isCorrect: true },
        { answerText: "F. Scott Fitzgerald", isCorrect: false },
        { answerText: "Ernest Hemingway", isCorrect: false },
        { answerText: "Mark Twain", isCorrect: false }
      ]
    },
    {
      questionText: "What is the capital of Australia?",
      answerOptions: [
        { answerText: "Sydney", isCorrect: false },
        { answerText: "Melbourne", isCorrect: false },
        { answerText: "Canberra", isCorrect: true },
        { answerText: "Brisbane", isCorrect: false }
      ]
    },
    {
      questionText: "How many sides does a triangle have?",
      answerOptions: [
        { answerText: "Three", isCorrect: true },
        { answerText: "Four", isCorrect: false },
        { answerText: "Five", isCorrect: false },
        { answerText: "Six", isCorrect: false }
      ]
    },
    {
      questionText: "What is the largest country by land area?",
      answerOptions: [
        { answerText: "United States", isCorrect: false },
        { answerText: "Russia", isCorrect: true },
        { answerText: "Canada", isCorrect: false },
        { answerText: "China", isCorrect: false }
      ]
    },
    {
      questionText: "What is the chemical symbol for carbon?",
      answerOptions: [
        { answerText: "C", isCorrect: true },
        { answerText: "Co", isCorrect: false },
        { answerText: "Ca", isCorrect: false },
        { answerText: "Cu", isCorrect: false }
      ]
    },
    {
      questionText: "Who wrote 'The Great Gatsby'?",
      answerOptions: [
        { answerText: "Ernest Hemingway", isCorrect: false },
        { answerText: "F. Scott Fitzgerald", isCorrect: true },
        { answerText: "Harper Lee", isCorrect: false },
        { answerText: "Mark Twain", isCorrect: false }
      ]
    }
  ];
  
  export default level1Questions;
  