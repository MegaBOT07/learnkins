import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Star } from "lucide-react";

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
  gameUrl: string;
}

const GAME_DATA_MAP: Record<string, GameData> = {
  "1": { id: "1", title: "NCERT Maths Adventure", category: "math", description: "Master mathematics through interactive challenges and real-world problem-solving.", difficulty: "Medium", players: 1250, rating: 4.8, duration: "15-20 min", image: "/games/treasurehunt.png", color: "border-green-500", gameUrl: "/games/maths-adventure" },
  "2": { id: "2", title: "Time Traveling History", category: "social", description: "Journey through time periods while exploring historical civilizations.", difficulty: "Hard", players: 980, rating: 4.7, duration: "20-25 min", image: "/games/timetravel.png", color: "border-orange-500", gameUrl: "/games/history-game" },
  "3": { id: "3", title: "Grammar Warrior", category: "english", description: "Battle grammar challenges and master English language skills.", difficulty: "Medium", players: 850, rating: 4.6, duration: "10-15 min", image: "/games/englishworrior.png", color: "border-purple-500", gameUrl: "/games/grammar-warrior" },
  "4": { id: "4", title: "Chemistry Mixer", category: "science", description: "Mix chemicals, solve formulas, and master the elements!", difficulty: "Hard", players: 720, rating: 4.5, duration: "15-20 min", image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400", color: "border-cyan-500", gameUrl: "/games/chemistry-mixer" },
  "5": { id: "5", title: "Geography Explorer", category: "social", description: "Navigate the globe and discover fascinating places and cultures.", difficulty: "Easy", players: 1050, rating: 4.8, duration: "15-20 min", image: "https://images.pexels.com/photos/1066895/pexels-photo-1066895.jpeg?auto=compress&cs=tinysrgb&w=400", color: "border-yellow-500", gameUrl: "/games/geography-explorer" },
  "6": { id: "6", title: "Science Lab", category: "science", description: "Conduct experiments in physics, biology, and test your scientific knowledge.", difficulty: "Medium", players: 930, rating: 4.7, duration: "15-20 min", image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400", color: "border-blue-500", gameUrl: "/games/science-lab" },
  "7": { id: "7", title: "Word Builder", category: "english", description: "Unscramble words, build vocabulary, and become a language master!", difficulty: "Easy", players: 880, rating: 4.6, duration: "10-15 min", image: "https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=400", color: "border-purple-500", gameUrl: "/games/word-builder" },
  "8": { id: "8", title: "Treasure Hunt 3D", category: "math", description: "3D math adventure hunting treasures across magical worlds with NCERT questions!", difficulty: "Medium", players: 650, rating: 4.9, duration: "15-25 min", image: "/games/treasurehunt.png", color: "border-purple-500", gameUrl: "/games/treasure-hunt" },
  "9": { id: "9", title: "CodeQuest", category: "science", description: "Learn web development through interactive coding challenges and quests!", difficulty: "Hard", players: 420, rating: 4.8, duration: "20-30 min", image: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=400", color: "border-cyan-500", gameUrl: "/games/code-quest" },
  "10": { id: "10", title: "Virtual Science Lab", category: "science", description: "3D virtual lab with NCERT experiments for chemistry, physics, and biology!", difficulty: "Hard", players: 380, rating: 4.9, duration: "20-30 min", image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400", color: "border-green-500", gameUrl: "/games/virtual-lab" },
};

const Game = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const gameData = GAME_DATA_MAP[id || "1"] || GAME_DATA_MAP["1"];
  const gameUrl = gameData.gameUrl;

  const getDifficultyStyle = (d: string) => {
    if (d === "Easy") return "bg-green-500 text-white";
    if (d === "Medium") return "bg-yellow-500 text-black";
    if (d === "Hard") return "bg-red-500 text-white";
    return "bg-gray-500 text-white";
  };

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
              <button onClick={() => navigate("/games")} className="p-2 border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all" aria-label="Back to games">
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
              <button
                type="button"
                onClick={() => navigate(gameUrl)}
                className="w-full bg-black text-white py-4 px-8 rounded-xl border-2 border-black font-black text-lg flex items-center justify-center space-x-2 hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]"
              >
                <Play className="w-5 h-5" />
                <span>Start Game</span>
              </button>

              <button onClick={() => navigate("/games")} className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-black hover:bg-gray-50 transition-all">
                <ArrowLeft className="w-4 h-4 inline mr-2" />Back to Games
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
