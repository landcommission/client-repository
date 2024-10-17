import React from 'react';

const ScoreModal = ({ showScore, score, questions, handleNewGame, level, levels, percentageCorrect, setLevel }) => {
  if (!showScore) return null;

   // Warm message
  const warmMessage = `You completed the quiz with a score of ${score} out of ${questions.length}. Keep up the great work!`;

  // Get current date and time
  const currentDate = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedDate = currentDate.toLocaleDateString(undefined, dateOptions);
  const formattedTime = currentDate.toLocaleTimeString(undefined, timeOptions);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur">
      <div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
        <div className="opacity-25 w-full h-full absolute z-10 inset-0"></div>
        <div className="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative shadow-lg">
          <div className="md:flex items-center">
          <div
                    class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="h-6 w-6 text-green-600" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <h3 className="font-bold text-lg">🎉🎉 Congratulations! </h3>
              <p className="text-sm text-gray-700 mt-1">
              {warmMessage}
              </p>
              <p className="text-xs text-gray-400 mt-1 text-right">{formattedDate}, {formattedTime}</p>
            </div>
          </div>
          <div className="text-center md:text-right mt-4 md:flex md:justify-end">
            {percentageCorrect >= 70 && level < levels.length ? (
              <button
                className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-900 text-white rounded-full font-semibold text-sm md:ml-2 md:order-2"
                onClick={() => setLevel(level + 1)}
              >
                Next Level
              </button>
            ) : (
              <button
                className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-green-600 text-white rounded-full font-semibold text-sm md:ml-2 md:order-2"
                onClick={handleNewGame}
              >
                New Game
              </button>
            )}
            <button
              className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-900 text-white rounded-full font-semibold text-sm mt-4 md:mt-0 md:order-1"
              onClick={handleNewGame}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreModal;
