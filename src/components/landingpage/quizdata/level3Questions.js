const level3Questions = [
    {
      questionText: "What is the product of 7 and 9?",
      answerOptions: [
        { answerText: "56", isCorrect: false },
        { answerText: "63", isCorrect: true },
        { answerText: "72", isCorrect: false },
        { answerText: "81", isCorrect: false }
      ]
    },
    {
      questionText: "Solve for 'x': 3x - 8 = 19.",
      answerOptions: [
        { answerText: "7", isCorrect: true },
        { answerText: "9", isCorrect: false },
        { answerText: "11", isCorrect: false },
        { answerText: "13", isCorrect: false }
      ]
    },
    {
      questionText: "What is the sum of the first 10 prime numbers?",
      answerOptions: [
        { answerText: "100", isCorrect: false },
        { answerText: "140", isCorrect: false },
        { answerText: "220", isCorrect: false },
        { answerText: "129", isCorrect: true }
      ]
    },
    {
      questionText: "What is the next number in the Fibonacci sequence: 1, 1, 2, 3, 5, 8, ...?",
      answerOptions: [
        { answerText: "10", isCorrect: false },
        { answerText: "13", isCorrect: true },
        { answerText: "15", isCorrect: false },
        { answerText: "21", isCorrect: false }
      ]
    },
    {
      questionText: "Which is the smallest fraction among: 3/5, 4/7, 2/3, 5/8?",
      answerOptions: [
        { answerText: "3/5", isCorrect: true },
        { answerText: "4/7", isCorrect: false },
        { answerText: "2/3", isCorrect: false },
        { answerText: "5/8", isCorrect: false }
      ]
    },
    {
      questionText: "What is the sum of angles in a triangle?",
      answerOptions: [
        { answerText: "90 degrees", isCorrect: false },
        { answerText: "180 degrees", isCorrect: true },
        { answerText: "270 degrees", isCorrect: false },
        { answerText: "360 degrees", isCorrect: false }
      ]
    },
    {
      questionText: "What is 20% of 80?",
      answerOptions: [
        { answerText: "10", isCorrect: false },
        { answerText: "16", isCorrect: true },
        { answerText: "20", isCorrect: false },
        { answerText: "25", isCorrect: false }
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
      questionText: "What is the value of 'pi' (π) to two decimal places?",
      answerOptions: [
        { answerText: "3.12", isCorrect: false },
        { answerText: "3.14", isCorrect: true },
        { answerText: "3.16", isCorrect: false },
        { answerText: "3.18", isCorrect: false }
      ]
    },
    {
      questionText: "What is the chemical formula for water?",
      answerOptions: [
        { answerText: "H2O2", isCorrect: false },
        { answerText: "H2O", isCorrect: true },
        { answerText: "HO2", isCorrect: false },
        { answerText: "H3O", isCorrect: false }
      ]
    },
    {
      questionText: "What is the opposite of 'opaque'?",
      answerOptions: [
        { answerText: "Transparent", isCorrect: true },
        { answerText: "Solid", isCorrect: false },
        { answerText: "Translucent", isCorrect: false },
        { answerText: "Frosted", isCorrect: false }
      ]
    },
    {
      questionText: "If Monday is the day after two days from Sunday, what day is it?",
      answerOptions: [
        { answerText: "Monday", isCorrect: false },
        { answerText: "Tuesday", isCorrect: true },
        { answerText: "Wednesday", isCorrect: false },
        { answerText: "Thursday", isCorrect: false }
      ]
    },
    {
      questionText: "What is the past tense of 'eat'?",
      answerOptions: [
        { answerText: "Ate", isCorrect: true },
        { answerText: "Eated", isCorrect: false },
        { answerText: "Eaten", isCorrect: false },
        { answerText: "Aoten", isCorrect: false }
      ]
    },
    {
      questionText: "If you rearrange the letters 'BARBIT', you would have the name of which animal?",
      answerOptions: [
        { answerText: "Rabbit", isCorrect: true },
        { answerText: "Tiger", isCorrect: false },
        { answerText: "Bat", isCorrect: false },
        { answerText: "Bear", isCorrect: false }
      ]
    },
    {
      questionText: "What is 5/7 as a percentage?",
      answerOptions: [
        { answerText: "50%", isCorrect: false },
        { answerText: "60%", isCorrect: false },
        { answerText: "71.43%", isCorrect: true },
        { answerText: "75%", isCorrect: false }
      ]
    },
    {
      questionText: "What is the plural of 'deer'?",
      answerOptions: [
        { answerText: "Deers", isCorrect: false },
        { answerText: "Deer", isCorrect: false },
        { answerText: "Dears", isCorrect: false },
        { answerText: "None of the above", isCorrect: true }
      ]
    },
    {
      questionText: "Who invented the telephone?",
      answerOptions: [
        { answerText: "Alexander Graham Bell", isCorrect: true },
        { answerText: "Thomas Edison", isCorrect: false },
        { answerText: "Nikola Tesla", isCorrect: false },
        { answerText: "Albert Einstein", isCorrect: false }
      ]
    },
    {
      questionText: "What is the capital of Australia?",
      answerOptions: [
        { answerText: "Melbourne", isCorrect: false },
        { answerText: "Sydney", isCorrect: false },
        { answerText: "Canberra", isCorrect: true },
        { answerText: "Perth", isCorrect: false }
      ]
    },
    {
      questionText: "What is the chemical symbol for silver?",
      answerOptions: [
        { answerText: "Si", isCorrect: false },
        { answerText: "Ag", isCorrect: true },
        { answerText: "Sv", isCorrect: false },
        { answerText: "Sr", isCorrect: false }
      ]
    },
    {
      questionText: "How many continents are there in the world?",
      answerOptions: [
        { answerText: "Five", isCorrect: false },
        { answerText: "Six", isCorrect: false },
        { answerText: "Seven", isCorrect: true },
        { answerText: "Eight", isCorrect: false }
      ]
    },
    {
      questionText: "What is the longest river in the world?",
      answerOptions: [
        { answerText: "Amazon", isCorrect: true },
        { answerText: "Nile", isCorrect: false },
        { answerText: "Mississippi", isCorrect: false },
        { answerText: "Yangtze", isCorrect: false }
      ]
    },
    {
      questionText: "What is the smallest prime number?",
      answerOptions: [
        { answerText: "1", isCorrect: false },
        { answerText: "2", isCorrect: true },
        { answerText: "3", isCorrect: false },
        { answerText: "4", isCorrect: false }
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
      questionText: "What is the capital of Brazil?",
      answerOptions: [
        { answerText: "Rio de Janeiro", isCorrect: false },
        { answerText: "São Paulo", isCorrect: false },
        { answerText: "Brasília", isCorrect: true },
        { answerText: "Salvador", isCorrect: false }
      ]
    },
    {
      questionText: "Who wrote 'To Kill a Mockingbird'?",
      answerOptions: [
        { answerText: "Harper Lee", isCorrect: true },
        { answerText: "J.D. Salinger", isCorrect: false },
        { answerText: "F. Scott Fitzgerald", isCorrect: false },
        { answerText: "Mark Twain", isCorrect: false }
      ]
    },
    {
      questionText: "What is the chemical symbol for oxygen?",
      answerOptions: [
        { answerText: "O", isCorrect: true },
        { answerText: "O2", isCorrect: false },
        { answerText: "O3", isCorrect: false },
        { answerText: "Oz", isCorrect: false }
      ]
    }
  ];
  
  export default level3Questions;
  