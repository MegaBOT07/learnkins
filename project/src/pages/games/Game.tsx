import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Trophy, Star } from "lucide-react";
import { gameAPI } from "../../utils/api";
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

  const getGameData = (gameId: string): GameData => {
    const gameDataMap: Record<string, GameData> = {
      "1": { id: "1", title: "Science Lab Explorer", category: "science", description: "Conduct virtual experiments and learn scientific concepts through interactive gameplay.", difficulty: "Medium", players: 1250, rating: 4.8, duration: "15-20 min", image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400", color: "border-cyan-500" },
      "2": { id: "2", title: "Math Adventure Quest", category: "math", description: "Solve mathematical puzzles and problems in an exciting adventure setting.", difficulty: "Hard", players: 980, rating: 4.7, duration: "20-25 min", image: "https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=400", color: "border-green-500" },
      "3": { id: "3", title: "History Time Machine", category: "social", description: "Travel through time and experience historical events in an immersive game.", difficulty: "Easy", players: 1150, rating: 4.9, duration: "25-30 min", image: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400", color: "border-orange-500" },
      "4": { id: "4", title: "Word Builder Challenge", category: "english", description: "Improve vocabulary and language skills through fun word-building games.", difficulty: "Medium", players: 850, rating: 4.6, duration: "10-15 min", image: "https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=400", color: "border-purple-500" },
      "5": { id: "5", title: "Chemistry Mixer", category: "science", description: "Mix chemicals safely in a virtual lab and learn about chemical reactions.", difficulty: "Hard", players: 720, rating: 4.5, duration: "15-20 min", image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400", color: "border-cyan-500" },
      "6": { id: "6", title: "Geography Explorer", category: "social", description: "Explore world geography through interactive maps and location-based challenges.", difficulty: "Easy", players: 1050, rating: 4.8, duration: "20-25 min", image: "https://images.pexels.com/photos/1066895/pexels-photo-1066895.jpeg?auto=compress&cs=tinysrgb&w=400", color: "border-yellow-500" },
    };
    return gameDataMap[gameId] || gameDataMap["1"];
  };

  const gameData = getGameData(id || "1");

  const getDifficultyStyle = (d: string) => {
    if (d === "Easy") return "bg-green-500 text-white";
    if (d === "Medium") return "bg-yellow-500 text-black";
    if (d === "Hard") return "bg-red-500 text-white";
    return "bg-gray-500 text-white";
  };

  const convertScoreToTokens = (score: number): number => Math.floor(score / 10);

  const startGame = () => setIsGameStarted(true);

  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`bg-white rounded-2xl border-2 ${gameData.color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden`}>
            <div className="relative">
              <img src={gameData.image} alt={gameData.title} className="w-full h-64 object-cover" />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black border-2 border-black ${getDifficultyStyle(gameData.difficulty)}`}>
                  {gameData.difficulty}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-lg border-2 border-black">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-black">{gameData.rating}</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-black text-black mb-2">{gameData.title}</h1>
                  <p className="text-lg text-gray-600 font-medium">{gameData.description}</p>
                </div>
                <button onClick={() => navigate("/games-quiz")} className="p-2 border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all" aria-label="Back to games">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { value: gameData.duration, label: "Duration", color: "border-cyan-500" },
                  { value: gameData.players.toLocaleString(), label: "Players", color: "border-green-500" },
                  { value: String(gameData.rating), label: "Rating", color: "border-yellow-500" },
                  { value: gameData.category, label: "Category", color: "border-orange-500" },
                ].map((s, i) => (
                  <div key={i} className={`text-center p-4 rounded-xl border-2 ${s.color} bg-gray-50`}>
                    <div className="text-xl font-black text-black">{s.value}</div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button onClick={startGame} className="w-full bg-black text-white py-4 px-8 rounded-xl border-2 border-black font-black text-lg flex items-center justify-center space-x-2 hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]">
                  <Play className="w-5 h-5" /><span>Start Game</span>
                </button>
                <button onClick={() => navigate("/games-quiz")} className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-black hover:bg-gray-50 transition-all">
                  <ArrowLeft className="w-4 h-4 inline mr-2" />Back to Games
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-black text-black mb-4">{gameData.title}</h1>
          <p className="text-lg text-gray-600 font-medium mb-8">Game is starting...</p>

          <div className="mb-8">
            <div className="text-6xl font-black text-black mb-4">🎮</div>
            <p className="text-lg text-gray-600 font-medium mb-2">Interactive educational game coming soon!</p>
            <p className="text-gray-500 font-medium">This is a placeholder for the actual game implementation.</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={async () => {
                const simulatedScore = Math.floor(Math.random() * 100) + 1;
                const tokensAwarded = convertScoreToTokens(simulatedScore);
                try {
                  // Submit to backend
                  if (id) {
                    await gameAPI.submitScore(id, simulatedScore);
                  }

                  award(tokensAwarded, `completed-game:${gameData.id}`, {
                    gameTitle: gameData.title,
                    score: simulatedScore,
                    tokensAwarded
                  });
                } catch (e) {
                  console.warn('Failed to submit score or award tokens', e);
                }
                try { playGame(); } catch (e) { }
                setIsGameStarted(false);
              }}
              className="w-full bg-black text-white py-3 px-6 rounded-xl border-2 border-black font-black hover:bg-white hover:text-black transition-all"
            >
              Back to Game Info
            </button>
            <button onClick={() => navigate("/games-quiz")} className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-black hover:bg-gray-50 transition-all">
              Back to Games
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
