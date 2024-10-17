const level4Questions = [
    {
      questionText: "Solve the equation for 'x': 2x^2 - 5x + 2 = 0.",
      answerOptions: [
        { answerText: "x = 1, x = 2", isCorrect: false },
        { answerText: "x = -1, x = -2", isCorrect: true },
        { answerText: "x = 1/2, x = 2/3", isCorrect: false },
        { answerText: "x = -1/2, x = -2/3", isCorrect: false }
      ]
    },
    {
      questionText: "What is the derivative of f(x) = 3x^2 + 4x - 7 with respect to x?",
      answerOptions: [
        { answerText: "f'(x) = 6x + 4", isCorrect: true },
        { answerText: "f'(x) = 6x - 4", isCorrect: false },
        { answerText: "f'(x) = 6x^2 + 4x", isCorrect: false },
        { answerText: "f'(x) = 6x^2 - 4x", isCorrect: false }
      ]
    },
    {
      questionText: "Simplify the expression: (2x^2 + 3x - 5) ÷ (x + 1).",
      answerOptions: [
        { answerText: "2x - 5", isCorrect: false },
        { answerText: "2x + 1", isCorrect: false },
        { answerText: "2x - 2", isCorrect: false },
        { answerText: "2x + 5 - 10/(x+1)", isCorrect: true }
      ]
    },
    {
      questionText: "Identify the correct punctuation: She said 'I will go to the market.'",
      answerOptions: [
        { answerText: "She said, 'I will go to the market.'", isCorrect: true },
        { answerText: "She said 'I will go to the market.'", isCorrect: false },
        { answerText: "She said: 'I will go to the market.'", isCorrect: false },
        { answerText: "She said; 'I will go to the market.'", isCorrect: false }
      ]
    },
    {
      questionText: "Select the sentence with correct subject-verb agreement: a) The group of students is going on a field trip. b) The group of students are going on a field trip.",
      answerOptions: [
        { answerText: "a) The group of students is going on a field trip.", isCorrect: true },
        { answerText: "b) The group of students are going on a field trip.", isCorrect: false },
        { answerText: "Both are correct.", isCorrect: false },
        { answerText: "Neither is correct.", isCorrect: false }
      ]
    },
    {
      questionText: "Which sentence uses the correct comparative form: a) She is the smartest of all. b) She is smarter than any other student in the class.",
      answerOptions: [
        { answerText: "a) She is the smartest of all.", isCorrect: false },
        { answerText: "b) She is smarter than any other student in the class.", isCorrect: true },
        { answerText: "Both are correct.", isCorrect: false },
        { answerText: "Neither is correct.", isCorrect: false }
      ]
    },
    {
      questionText: "What is the correct plural form of 'child'?",
      answerOptions: [
        { answerText: "childs", isCorrect: false },
        { answerText: "childes", isCorrect: false },
        { answerText: "children", isCorrect: true },
        { answerText: "childen", isCorrect: false }
      ]
    },
    {
      questionText: "Identify the sentence with correct parallel structure: a) She likes swimming, to hike, and biking. b) She likes swimming, hiking, and biking.",
      answerOptions: [
        { answerText: "a) She likes swimming, to hike, and biking.", isCorrect: false },
        { answerText: "b) She likes swimming, hiking, and biking.", isCorrect: true },
        { answerText: "Both are correct.", isCorrect: false },
        { answerText: "Neither is correct.", isCorrect: false }
      ]
    },
    {
      questionText: "Choose the sentence with the correct use of 'its' and 'it's': a) The dog chased it's tail. b) The dog chased its tail.",
      answerOptions: [
        { answerText: "a) The dog chased it's tail.", isCorrect: false },
        { answerText: "b) The dog chased its tail.", isCorrect: true },
        { answerText: "Both are correct.", isCorrect: false },
        { answerText: "Neither is correct.", isCorrect: false }
      ]
    },
    {
      questionText: "Which sentence uses the correct form of 'to lay' and 'to lie': a) She lay the book on the table yesterday. b) She laid the book on the table yesterday.",
      answerOptions: [
        { answerText: "a) She lay the book on the table yesterday.", isCorrect: false },
        { answerText: "b) She laid the book on the table yesterday.", isCorrect: true },
        { answerText: "Both are correct.", isCorrect: false },
        { answerText: "Neither is correct.", isCorrect: false }
      ]
    },
    {
      questionText: "Identify the sentence with correct use of 'whom': a) To who shall I address this letter? b) To whom shall I address this letter?",
      answerOptions: [
        { answerText: "a) To who shall I address this letter?", isCorrect: false },
        { answerText: "b) To whom shall I address this letter?", isCorrect: true },
        { answerText: "Both are correct.", isCorrect: false },
        { answerText: "Neither is correct.", isCorrect: false }
      ]
    },
    {
      questionText: "What is the correct past tense of 'lead' (as in to guide): a) led, b) leaded",
      answerOptions: [
        { answerText: "a) led", isCorrect: true },
        { answerText: "b) leaded", isCorrect: false },
        { answerText: "Both are correct.", isCorrect: false },
        { answerText: "Neither is correct.", isCorrect: false }
      ]
    },
    {
      questionText: "Select the correct use of 'who' and 'whom': a) Who did you go to the concert with? b) Whom did you go to the concert with?",
      answerOptions: [
        { answerText: "a) Who did you go to the concert with?", isCorrect: true },
        { answerText: "b) Whom did you go to the concert with?", isCorrect: false },
        { answerText: "Both are correct.", isCorrect: false },
        { answerText: "Neither is correct.", isCorrect: false }
      ]
    },
    {
      questionText: "Choose the sentence with correct use of 'their', 'there', and 'they're': a) Their going to the park over there. b) They're going to the park over there.",
      answerOptions: [
        { answerText: "a) Their going to the park over there.", isCorrect: false },
        { answerText: "b) They're going to the park over there.", isCorrect: true },
        { answerText: "Both are correct.", isCorrect: false },
        { answerText: "Neither is correct.", isCorrect: false }
      ]
    },
    {
      questionText: "Identify the sentence with correct use of 'affect' and 'effect': a) The medicine had a positive affect on her condition. b) The medicine had a positive effect on her condition.",
      answerOptions: [
        { answerText: "a) The medicine had a positive affect on her condition.", isCorrect: false },
        { answerText: "b) The medicine had a positive effect on her condition.", isCorrect: true },
        { answerText: "Both are correct.", isCorrect: false },
        { answerText: "Neither is correct.", isCorrect: false }
      ]
    },
    {
      questionText: "Select the sentence with correct use of 'accept' and 'except': a) I will except the invitation to the party. b) I will accept the invitation to the party.",
      answerOptions: [
        { answerText: "a) I will except the invitation to the party.", isCorrect: false },
        { answerText: "b) I will accept the invitation to the party.", isCorrect: true },
        { answerText: "Both are correct.", isCorrect: false },
        { answerText: "Neither is correct.", isCorrect: false }
      ]
    }
  ];
  
  export default level4Questions;
  