const level7Questions = [
    {
      questionText: "Solve for x: 3x + 7 = 25",
      answerOptions: [
        { answerText: "x = 6", isCorrect: false },
        { answerText: "x = 6.33", isCorrect: true },
        { answerText: "x = 7", isCorrect: false },
        { answerText: "x = 7.33", isCorrect: false }
      ]
    },
    {
      questionText: "Find the value of 'a' in the equation: 2a - 5 = 11",
      answerOptions: [
        { answerText: "a = 6", isCorrect: true },
        { answerText: "a = 8", isCorrect: false },
        { answerText: "a = 7", isCorrect: false },
        { answerText: "a = 5", isCorrect: false }
      ]
    },
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
      questionText: "Simplify: 2x^3 * 3x^2",
      answerOptions: [
        { answerText: "6x^5", isCorrect: true },
        { answerText: "5x^6", isCorrect: false },
        { answerText: "5x^5", isCorrect: false },
        { answerText: "6x^6", isCorrect: false }
      ]
    },
    {
      questionText: "Evaluate: 2^5",
      answerOptions: [
        { answerText: "32", isCorrect: true },
        { answerText: "25", isCorrect: false },
        { answerText: "64", isCorrect: false },
        { answerText: "16", isCorrect: false }
      ]
    },
    {
      questionText: "Solve for x: log(x) = 3",
      answerOptions: [
        { answerText: "x = 10", isCorrect: true },
        { answerText: "x = 3", isCorrect: false },
        { answerText: "x = 6", isCorrect: false },
        { answerText: "x = 5", isCorrect: false }
      ]
    },
    {
      questionText: "What is the value of sin(π/3)?",
      answerOptions: [
        { answerText: "√3/2", isCorrect: true },
        { answerText: "1/2", isCorrect: false },
        { answerText: "1", isCorrect: false },
        { answerText: "1/√2", isCorrect: false }
      ]
    },
    {
      questionText: "Find the area of a circle with radius 5.",
      answerOptions: [
        { answerText: "25π", isCorrect: false },
        { answerText: "100π", isCorrect: true },
        { answerText: "20π", isCorrect: false },
        { answerText: "50π", isCorrect: false }
      ]
    },
    {
      questionText: "Evaluate: ∫(2x^2 + 3x) dx",
      answerOptions: [
        { answerText: "(2/3)x^3 + (3/2)x^2 + C", isCorrect: true },
        { answerText: "(2/3)x^3 + (3/2)x", isCorrect: false },
        { answerText: "(2/3)x^3 + 3x + C", isCorrect: false },
        { answerText: "(2/3)x^2 + (3/2)x^2 + C", isCorrect: false }
      ]
    },
    {
      questionText: "What is the sum of the first 10 terms of the arithmetic sequence: 3, 7, 11, ...?",
      answerOptions: [
        { answerText: "320", isCorrect: false },
        { answerText: "240", isCorrect: false },
        { answerText: "310", isCorrect: false },
        { answerText: "240", isCorrect: true }
      ]
    },
    {
      questionText: "Find the value of y: 5y - 3 = 4(y + 2)",
      answerOptions: [
        { answerText: "y = -5", isCorrect: false },
        { answerText: "y = 1", isCorrect: true },
        { answerText: "y = 0", isCorrect: false },
        { answerText: "y = -1", isCorrect: false }
      ]
    },
    {
      questionText: "Solve the system of equations: x + y = 5, 2x - y = 1",
      answerOptions: [
        { answerText: "x = 2, y = 3", isCorrect: false },
        { answerText: "x = 3, y = 2", isCorrect: true },
        { answerText: "x = 4, y = 1", isCorrect: false },
        { answerText: "x = 1, y = 4", isCorrect: false }
      ]
    },
    {
      questionText: "What is the equation of the line passing through the points (3, 2) and (5, 6)?",
      answerOptions: [
        { answerText: "y = 2x", isCorrect: false },
        { answerText: "y = 2x + 2", isCorrect: true },
        { answerText: "y = 3x", isCorrect: false },
        { answerText: "y = x + 1", isCorrect: false }
      ]
    },
    {
      questionText: "Evaluate: √(49 - 16)",
      answerOptions: [
        { answerText: "7", isCorrect: false },
        { answerText: "5", isCorrect: false },
        { answerText: "6", isCorrect: true },
        { answerText: "8", isCorrect: false }
      ]
    },
    {
      questionText: "Solve for x: log(2x + 1) = 2",
      answerOptions: [
        { answerText: "x = 4", isCorrect: false },
        { answerText: "x = 3", isCorrect: true },
        { answerText: "x = 5", isCorrect: false },
        { answerText: "x = 2", isCorrect: false }
      ]
    },
    {
      questionText: "Find the value of 'k' in the quadratic equation: x^2 - 5x + k = 0, if it has real roots.",
      answerOptions: [
        { answerText: "k ≤ 6.25", isCorrect: true },
        { answerText: "k ≥ 6.25", isCorrect: false },
        { answerText: "k < 6.25", isCorrect: false },
        { answerText: "k > 6.25", isCorrect: false }
      ]
    },
    {
      questionText: "What is the coefficient of x^2 in the expansion of (2x - 3)^4?",
      answerOptions: [
        { answerText: "12", isCorrect: false },
        { answerText: "16", isCorrect: true },
        { answerText: "8", isCorrect: false },
        { answerText: "24", isCorrect: false }
      ]
    },
    {
      questionText: "Simplify: (3x^2 + 4x - 2) ÷ (x - 1)",
      answerOptions: [
        { answerText: "3x + 7 - 9/(x-1)", isCorrect: false },
        { answerText: "3x + 7 + 9/(x-1)", isCorrect: true },
        { answerText: "3x + 2 - 9/(x-1)", isCorrect: false },
        { answerText: "3x + 2 + 9/(x-1)", isCorrect: false }
      ]
    },
    {
      questionText: "Find the inverse of the function f(x) = 2x - 4.",
      answerOptions: [
        { answerText: "f^(-1)(x) = (x + 4)/2", isCorrect: true },
        { answerText: "f^(-1)(x) = 2x - 4", isCorrect: false },
        { answerText: "f^(-1)(x) = 2x + 4", isCorrect: false },
        { answerText: "f^(-1)(x) = (x - 4)/2", isCorrect: false }
      ]
    },
    {
      questionText: "What is the value of tan(π/4)?",
      answerOptions: [
        { answerText: "1", isCorrect: true },
        { answerText: "0", isCorrect: false },
        { answerText: "√3/2", isCorrect: false },
        { answerText: "1/√2", isCorrect: false }
      ]
    },
    {
      questionText: "Find the sum of the first 15 terms of the geometric sequence: 2, 6, 18, ...",
      answerOptions: [
        { answerText: "8,362,088", isCorrect: false },
        { answerText: "1,048,575", isCorrect: true },
        { answerText: "4,194,303", isCorrect: false },
        { answerText: "16,777,215", isCorrect: false }
      ]
    },
    {
      questionText: "Solve the equation: e^(2x) = 7",
      answerOptions: [
        { answerText: "x = ln(7)/2", isCorrect: true },
        { answerText: "x = ln(2)/7", isCorrect: false },
        { answerText: "x = ln(7)", isCorrect: false },
        { answerText: "x = ln(2)", isCorrect: false }
      ]
    },
    {
      questionText: "What is the value of cos(π/6)?",
      answerOptions: [
        { answerText: "√3/2", isCorrect: true },
        { answerText: "1/2", isCorrect: false },
        { answerText: "1", isCorrect: false },
        { answerText: "1/√2", isCorrect: false }
      ]
    },
    {
      questionText: "Find the length of the arc intercepted by a central angle of 60 degrees in a circle of radius 10.",
      answerOptions: [
        { answerText: "10π/3", isCorrect: false },
        { answerText: "5π/3", isCorrect: true },
        { answerText: "10π/6", isCorrect: false },
        { answerText: "5π/6", isCorrect: false }
      ]
    },
    {
      questionText: "Solve the equation: 2^x = 16",
      answerOptions: [
        { answerText: "x = 2", isCorrect: false },
        { answerText: "x = 3", isCorrect: false },
        { answerText: "x = 4", isCorrect: true },
        { answerText: "x = 5", isCorrect: false }
      ]
    },
    {
      questionText: "What is the equation of the parabola with vertex (3, -2) and focus (3, 0)?",
      answerOptions: [
        { answerText: "(x - 3)^2 = 8(y + 2)", isCorrect: true },
        { answerText: "(x - 3)^2 = 4(y + 2)", isCorrect: false },
        { answerText: "(x - 3)^2 = -8(y + 2)", isCorrect: false },
        { answerText: "(x - 3)^2 = -4(y + 2)", isCorrect: false }
      ]
    },
    {
      questionText: "Evaluate: lim(x→2) (x^2 - 4) / (x - 2)",
      answerOptions: [
        { answerText: "4", isCorrect: true },
        { answerText: "2", isCorrect: false },
        { answerText: "1", isCorrect: false },
        { answerText: "0", isCorrect: false }
      ]
    },
    {
      questionText: "Find the area bounded by the curve y = x^2 and the x-axis from x = 0 to x = 3.",
      answerOptions: [
        { answerText: "9/2", isCorrect: false },
        { answerText: "9", isCorrect: true },
        { answerText: "27/2", isCorrect: false },
        { answerText: "3/2", isCorrect: false }
      ]
    }
  ];
  
  export default level7Questions;
  