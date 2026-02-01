import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Trophy, Star, Clock, Users } from "lucide-react";
import { useTokens } from "../../context/TokenContext";
import { useGame } from "../../context/GameContext";

interface GameData {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: string;
  players: number;
  rating: number;
  duration: string;
  image: string;
  color: string;
}

const Game = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isGameStarted, setIsGameStarted] = useState(false);
  const { award } = useTokens();
  const { playGame } = useGame();

  // Demo game data based on game ID
  const getGameData = (gameId: string): GameData => {
    const gameDataMap: Record<string, GameData> = {
      "1": {
        id: "1",
        title: "Science Lab Explorer",
        category: "science",
        description:
          "Conduct virtual experiments and learn scientific concepts through interactive gameplay.",
        difficulty: "Medium",
        players: 1250,
        rating: 4.8,
        duration: "15-20 min",
        image:
          "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400",
        color: "from-purple-500 to-indigo-600",
      },
      "2": {
        id: "2",
        title: "Math Adventure Quest",
        category: "math",
        description:
          "Solve mathematical puzzles and problems in an exciting adventure setting.",
        difficulty: "Hard",
        players: 980,
        rating: 4.7,
        duration: "20-25 min",
        image:
          "https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=400",
        color: "from-blue-500 to-cyan-600",
      },
      "3": {
        id: "3",
        title: "History Time Machine",
        category: "social",
        description:
          "Travel through time and experience historical events in an immersive game.",
        difficulty: "Easy",
        players: 1150,
        rating: 4.9,
        duration: "25-30 min",
        image:
          "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400",
        color: "from-green-500 to-teal-600",
      },
      "4": {
        id: "4",
        title: "Word Builder Challenge",
        category: "english",
        description:
          "Improve vocabulary and language skills through fun word-building games.",
        difficulty: "Medium",
        players: 850,
        rating: 4.6,
        duration: "10-15 min",
        image:
          "https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=400",
        color: "from-orange-500 to-red-600",
      },
      "5": {
        id: "5",
        title: "Chemistry Mixer",
        category: "science",
        description:
          "Mix chemicals safely in a virtual lab and learn about chemical reactions.",
        difficulty: "Hard",
        players: 720,
        rating: 4.5,
        duration: "15-20 min",
        image:
          "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400",
        color: "from-purple-500 to-indigo-600",
      },
      "6": {
        id: "6",
        title: "Geography Explorer",
        category: "social",
        description:
          "Explore world geography through interactive maps and location-based challenges.",
        difficulty: "Easy",
        players: 1050,
        rating: 4.8,
        duration: "20-25 min",
        image:
          "https://images.pexels.com/photos/1066895/pexels-photo-1066895.jpeg?auto=compress&cs=tinysrgb&w=400",
        color: "from-green-500 to-teal-600",
      },
    };

    return gameDataMap[gameId] || gameDataMap["1"];
  };

  const gameData = getGameData(id || "1");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const convertScoreToTokens = (score: number): number => {
    // Convert score to tokens: 10 score = 1 token
    return Math.floor(score / 10);
  };

  const startGame = () => {
    setIsGameStarted(true);
  };

  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="relative">
              <img
                src={gameData.image}
                alt={gameData.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                    gameData.difficulty
                  )}`}
                >
                  {gameData.difficulty}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{gameData.rating}</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {gameData.title}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {gameData.description}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/games-quiz")}
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="Back to games"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {gameData.duration}
                  </div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {gameData.players.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {gameData.rating}
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {gameData.category}
                  </div>
                  <div className="text-sm text-gray-600">Category</div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={startGame}
                  className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold flex items-center justify-center space-x-2"
                >
                  <Play className="w-6 h-6" />
                  <span>Start Game</span>
                </button>
                <button
                  onClick={() => navigate("/games-quiz")}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-2" />
                  Back to Games
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {gameData.title}
          </h1>
          <p className="text-lg text-gray-600 mb-8">Game is starting...</p>

          <div className="mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-4">🎮</div>
            <p className="text-lg text-gray-600 mb-4">
              Interactive educational game coming soon!
            </p>
            <p className="text-gray-500">
              This is a placeholder for the actual game implementation.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                // Simulate game score (in real game, this would come from game logic)
                const simulatedScore = Math.floor(Math.random() * 100) + 1;
                const tokensAwarded = convertScoreToTokens(simulatedScore);
                
                // Award tokens for game completion (based on score)
                try {
                  award(tokensAwarded, `completed-game:${gameData.id}`, {
                    gameTitle: gameData.title,
                    score: simulatedScore,
                    tokensAwarded: tokensAwarded
                  });
                  console.log(`Game completed! Score: ${simulatedScore}, Tokens awarded: ${tokensAwarded}`);
                } catch (e) {
                  console.warn('Failed to award tokens', e);
                }
                // increment game play stats
                try {
                  playGame();
                } catch (e) {}
                setIsGameStarted(false);
              }}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Game Info
            </button>
            <button
              onClick={() => navigate("/games-quiz")}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Games
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
