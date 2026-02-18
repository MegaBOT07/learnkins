import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Rocket, Zap, Heart, Clock, Trophy, AlertCircle, Flame } from 'lucide-react';
import HeroSelection from './components/HeroSelection';
import { Hero } from './types/game';
import { MONSTERS } from './data/monsters';

type Feedback = { type: 'correct' | 'wrong'; message: string } | null;

type Laser = { id: number; x: number; y: number };
type Fire = { id: number; x: number; y: number };
type Explosion = { id: number; x: number; y: number };

type Question = {
  q: string;
  options: string[];
  correct: number;
};

type Planet = {
  name: string;
  color: string;
  bgColor: string;
  monster: string;
  monsterColor: string;
  topic: string;
  difficulty: string;
  questions: Question[];
};

const PLANETS_DATA: Record<string, Planet> = {
  nounara: {
    name: "Nounara",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-b from-blue-900 via-cyan-900 to-blue-800",
    monster: "Nounzilla",
    monsterColor: "#06b6d4",
    topic: "Nouns & Articles",
    difficulty: "Easy",
    questions: [
      {
        q: "Which article should be used before 'hour'?",
        options: ["a", "an", "the", "no article"],
        correct: 1
      },
      {
        q: "Choose the correct collective noun: A ____ of wolves.",
        options: ["herd", "pack", "flock", "school"],
        correct: 1
      },
      {
        q: "Which is a proper noun?",
        options: ["city", "London", "building", "river"],
        correct: 1
      },
      {
        q: "Select the abstract noun:",
        options: ["happiness", "chair", "dog", "tree"],
        correct: 0
      },
      {
        q: "Which article fits: '___ United States is a large country'?",
        options: ["A", "An", "The", "No article"],
        correct: 2
      },
      {
        q: "Identify the countable noun:",
        options: ["water", "information", "apple", "music"],
        correct: 2
      },
      {
        q: "Which needs 'an' before it?",
        options: ["university", "umbrella", "united front", "useful tool"],
        correct: 1
      },
      {
        q: "Choose the plural form of 'child':",
        options: ["childs", "children", "childes", "child's"],
        correct: 1
      },
      {
        q: "Select the compound noun:",
        options: ["quickly", "beautiful", "toothbrush", "running"],
        correct: 2
      },
      {
        q: "Which is an uncountable noun?",
        options: ["books", "advice", "chairs", "apples"],
        correct: 1
      }
    ]
  },
  verbion: {
    name: "Verbion",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-gradient-to-b from-red-900 via-orange-900 to-red-800",
    monster: "Tensaurus",
    monsterColor: "#ec4899",
    topic: "Verb Tenses",
    difficulty: "Easy",
    questions: [
      {
        q: "She ____ to school every day.",
        options: ["go", "goes", "going", "gone"],
        correct: 1
      },
      {
        q: "Yesterday, I ____ a movie.",
        options: ["watch", "watches", "watched", "watching"],
        correct: 2
      },
      {
        q: "They ____ play soccer tomorrow.",
        options: ["will", "are", "have", "do"],
        correct: 0
      },
      {
        q: "He ____ his homework right now.",
        options: ["do", "does", "is doing", "did"],
        correct: 2
      },
      {
        q: "We ____ lived here for five years.",
        options: ["has", "have", "had", "having"],
        correct: 1
      },
      {
        q: "The sun ____ in the east.",
        options: ["rise", "rises", "rising", "rose"],
        correct: 1
      },
      {
        q: "By next month, I ____ my degree.",
        options: ["complete", "will complete", "completing", "completes"],
        correct: 1
      },
      {
        q: "She ____ when I called her.",
        options: ["sleeps", "slept", "was sleeping", "sleep"],
        correct: 2
      },
      {
        q: "They ____ to Paris last summer.",
        options: ["go", "went", "goes", "going"],
        correct: 1
      },
      {
        q: "I ____ never been to Japan.",
        options: ["has", "have", "had", "having"],
        correct: 1
      }
    ]
  },
  conjunxis: {
    name: "Conjunxis",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-b from-green-900 via-emerald-900 to-green-800",
    monster: "Linkbeast",
    monsterColor: "#10b981",
    topic: "Conjunctions",
    difficulty: "Medium",
    questions: [
      {
        q: "I want pizza ____ pasta for dinner.",
        options: ["but", "or", "and", "so"],
        correct: 1
      },
      {
        q: "She studied hard, ____ she passed the exam.",
        options: ["but", "or", "so", "yet"],
        correct: 2
      },
      {
        q: "____ it was raining, we went hiking.",
        options: ["Because", "Although", "If", "Unless"],
        correct: 1
      },
      {
        q: "He's tall ____ his brother is short.",
        options: ["and", "but", "or", "so"],
        correct: 1
      },
      {
        q: "I'll go to the party ____ I finish my work.",
        options: ["if", "unless", "but", "or"],
        correct: 0
      },
      {
        q: "She loves reading ____ writing stories.",
        options: ["or", "but", "and", "so"],
        correct: 2
      },
      {
        q: "Take an umbrella ____ it rains.",
        options: ["although", "because", "in case", "unless"],
        correct: 2
      },
      {
        q: "He can't swim, ____ he loves the beach.",
        options: ["so", "yet", "or", "and"],
        correct: 1
      },
      {
        q: "____ you hurry, you'll miss the bus.",
        options: ["If", "Unless", "Although", "Because"],
        correct: 1
      },
      {
        q: "I like tea ____ coffee equally.",
        options: ["or", "and", "but", "so"],
        correct: 1
      }
    ]
  },
  prepositar: {
    name: "Prepositar",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-b from-orange-900 via-red-900 to-orange-800",
    monster: "Positron",
    monsterColor: "#f97316",
    topic: "Prepositions",
    difficulty: "Medium",
    questions: [
      {
        q: "The book is ____ the table.",
        options: ["in", "on", "at", "by"],
        correct: 1
      },
      {
        q: "She arrived ____ the airport early.",
        options: ["in", "on", "at", "to"],
        correct: 2
      },
      {
        q: "We'll meet ____ Monday.",
        options: ["in", "on", "at", "by"],
        correct: 1
      },
      {
        q: "He lives ____ New York City.",
        options: ["in", "on", "at", "by"],
        correct: 0
      },
      {
        q: "The meeting starts ____ 3 PM.",
        options: ["in", "on", "at", "by"],
        correct: 2
      },
      {
        q: "She walked ____ the park.",
        options: ["through", "on", "at", "in"],
        correct: 0
      },
      {
        q: "The cat jumped ____ the fence.",
        options: ["in", "over", "at", "by"],
        correct: 1
      },
      {
        q: "I'm interested ____ learning Spanish.",
        options: ["in", "on", "at", "for"],
        correct: 0
      },
      {
        q: "She's afraid ____ spiders.",
        options: ["from", "of", "at", "with"],
        correct: 1
      },
      {
        q: "The keys are ____ my pocket.",
        options: ["on", "at", "in", "by"],
        correct: 2
      }
    ]
  },
  modifera: {
    name: "Modifera",
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-gradient-to-b from-yellow-900 via-amber-900 to-yellow-800",
    monster: "Descriptoid",
    monsterColor: "#f59e0b",
    topic: "Adjectives & Adverbs",
    difficulty: "Medium",
    questions: [
      {
        q: "She sings ____.",
        options: ["beautiful", "beautifully", "beauty", "beautify"],
        correct: 1
      },
      {
        q: "This is the ____ cake I've ever tasted.",
        options: ["good", "better", "best", "well"],
        correct: 2
      },
      {
        q: "He runs ____.",
        options: ["quick", "quickly", "quicker", "quickest"],
        correct: 1
      },
      {
        q: "The ____ dog barked loudly.",
        options: ["angrily", "anger", "angry", "angrier"],
        correct: 2
      },
      {
        q: "She speaks English ____.",
        options: ["fluent", "fluently", "fluency", "more fluent"],
        correct: 1
      },
      {
        q: "This test is ____ than the last one.",
        options: ["difficult", "more difficult", "most difficult", "difficulty"],
        correct: 1
      },
      {
        q: "He drives very ____.",
        options: ["careful", "carefully", "care", "careless"],
        correct: 1
      },
      {
        q: "That's a ____ story!",
        options: ["wonderfully", "wonder", "wonderful", "wondering"],
        correct: 2
      },
      {
        q: "She arrived ____ than expected.",
        options: ["early", "earlier", "earliest", "earlyer"],
        correct: 1
      },
      {
        q: "The movie was ____ boring.",
        options: ["extreme", "extremes", "extremely", "extremity"],
        correct: 2
      }
    ]
  },
  subjuncton: {
    name: "Subjuncton",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-gradient-to-b from-teal-900 via-cyan-900 to-teal-800",
    monster: "Agreementor",
    monsterColor: "#8b5cf6",
    topic: "Subject-Verb Agreement",
    difficulty: "Hard",
    questions: [
      {
        q: "Neither the students nor the teacher ____ ready.",
        options: ["are", "is", "were", "be"],
        correct: 1
      },
      {
        q: "The team ____ won the championship.",
        options: ["have", "has", "are", "were"],
        correct: 1
      },
      {
        q: "Each of the boys ____ a prize.",
        options: ["receive", "receives", "receiving", "are receiving"],
        correct: 1
      },
      {
        q: "The news ____ very disturbing.",
        options: ["are", "is", "were", "have been"],
        correct: 1
      },
      {
        q: "Either my sister or my brothers ____ coming.",
        options: ["is", "are", "was", "be"],
        correct: 1
      },
      {
        q: "Mathematics ____ my favorite subject.",
        options: ["are", "is", "were", "have been"],
        correct: 1
      },
      {
        q: "A number of students ____ absent today.",
        options: ["is", "are", "was", "has been"],
        correct: 1
      },
      {
        q: "The committee ____ meeting tomorrow.",
        options: ["is", "are", "were", "be"],
        correct: 0
      },
      {
        q: "Ten dollars ____ too much for that.",
        options: ["are", "is", "were", "have"],
        correct: 1
      },
      {
        q: "Everyone ____ their own opinion.",
        options: ["have", "has", "are having", "were having"],
        correct: 1
      }
    ]
  }
};

const GrammarWarrior: React.FC = () => {
  const [gameState, setGameState] = useState<'hero-select' | 'menu' | 'playing' | 'victory' | 'defeat'>('hero-select');
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [playerHealth, setPlayerHealth] = useState<number>(100);
  const [monsterHealth, setMonsterHealth] = useState<number>(100);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [combo, setCombo] = useState<number>(0);
  const [lasers, setLasers] = useState<Laser[]>([]);
  const [fires, setFires] = useState<Fire[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const confettiRefs = useRef<HTMLDivElement[]>([]);

  // animate confetti with GSAP when entering victory state
  useEffect(() => {
    if (gameState !== 'victory') return;
    if (!confettiRefs.current.length) return;

    const palettes = [
      ['#f97316', '#f59e0b', '#fde68a'],
      ['#10b981', '#06b6d4', '#34d399'],
      ['#6366f1', '#8b5cf6', '#a78bfa'],
      ['#ef4444', '#f97316', '#fb923c'],
      ['#06b6d4', '#0ea5b7', '#60a5fa']
    ];

    confettiRefs.current.forEach((el, i) => {
      if (!el) return;
      // use GSAP utils for random values (avoids direct Math.random)
  const left = gsap.utils.random(0, 100);
  const angle = gsap.utils.random(0, 360);
  const duration = gsap.utils.random(2, 4.5);
  const delay = gsap.utils.random(0, 0.8);
  const palette = palettes[Math.floor(gsap.utils.random(0, palettes.length - 1))];
  const c1 = palette[Math.floor(gsap.utils.random(0, palette.length - 1))];
  const c2 = palette[Math.floor(gsap.utils.random(0, palette.length - 1))];
  const scale = gsap.utils.random(0.9, 1.5);
  const borderR = Math.floor(gsap.utils.random(2, 10));

      // assign initial styles
      gsap.set(el, {
        left: `${left}%`,
  top: `${gsap.utils.random(-20, -5)}vh`,
        background: `linear-gradient(${angle}deg, ${c1}, ${c2})`,
        borderRadius: `${borderR}px`,
        scale: scale,
        opacity: 0.98,
        mixBlendMode: 'screen'
      });

      // animate fall
      gsap.to(el, {
        y: '110vh',
  rotation: gsap.utils.random(180, 720),
        duration: duration,
        delay: delay,
        ease: 'power2.out',
        opacity: 0.95,
        onComplete: () => {
          // optionally reset or remove
        }
      });
    });
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev: number) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('defeat');
    }
  }, [timeLeft, gameState]);

  const handleHeroSelect = (hero: Hero) => {
    setSelectedHero(hero);
    setGameState('menu');
  };

  const startGame = (planetKey: string) => {
    setSelectedPlanet(planetKey);
    setGameState('playing');
    setCurrentQuestion(0);
    setPlayerHealth(100);
    setMonsterHealth(100);
    setScore(0);
    setTimeLeft(60);
    setCombo(0);
    setFeedback(null);
    setSelectedAnswer(null);
    setLasers([]);
    setFires([]);
    setExplosions([]);
  };

  const shootLaser = () => {
    const newLaser: Laser = { id: Date.now(), x: 10, y: 70 };
    setLasers((prev: any) => [...prev, newLaser]);

    setTimeout(() => {
      setLasers((prev: any[]) => prev.filter((l: { id: number; }) => l.id !== newLaser.id));
    }, 600);

    const expId = Date.now() + 1;
    setTimeout(() => {
      setExplosions((prev: any) => [...prev, { id: expId, x: 85, y: 50 }]);

      setTimeout(() => {
        setExplosions((prev: any[]) => prev.filter((e: { id: number; }) => e.id !== expId));
      }, 1000);
    }, 600);
  };

  const shootFire = () => {
    const fireCount = 3;
    for (let i = 0; i < fireCount; i++) {
      const fireIdBase = Date.now() + i;
      setTimeout(() => {
        const newFire: Fire = { id: fireIdBase, x: 85, y: 50 + i * 5 };
        setFires((prev: any) => [...prev, newFire]);

        setTimeout(() => {
          setFires((prev: any[]) => prev.filter((f: { id: number; }) => f.id !== newFire.id));
        }, 800);
      }, i * 100);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    if (!selectedPlanet) return;

    const planet = PLANETS_DATA[selectedPlanet];
    const question = planet.questions[currentQuestion];
    const isCorrect = answerIndex === question.correct;

    let damage = 0;
    let newMonsterHP = monsterHealth;
    let newPlayerHP = playerHealth;

    if (isCorrect) {
      damage = 10 + combo * 2;
      newMonsterHP = Math.max(0, monsterHealth - damage);
      setMonsterHealth(newMonsterHP);
      setScore((prev: number) => prev + 100 + combo * 50);
      setCombo((prev: number) => prev + 1);
      setFeedback({ type: 'correct', message: `LASER HIT! -${damage} HP` });
      setTimeLeft((prev: number) => prev + 5);
      shootLaser();
    } else {
      newPlayerHP = Math.max(0, playerHealth - 15);
      setPlayerHealth(newPlayerHP);
      setCombo(0);
      setFeedback({ type: 'wrong', message: 'MONSTER ATTACKS! -15 HP' });
      shootFire();
    }

    setSelectedAnswer(answerIndex);

    setTimeout(() => {
      if (newMonsterHP <= 0) {
        setGameState('victory');
      } else if (newPlayerHP <= 0) {
        setGameState('defeat');
      } else if (currentQuestion < planet.questions.length - 1) {
        setCurrentQuestion((prev: number) => prev + 1);
        setFeedback(null);
        setSelectedAnswer(null);
      } else {
        if (newMonsterHP > 0) {
          setGameState('defeat');
        } else {
          setGameState('victory');
        }
      }
    }, 1500);
  };

  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12 animate-pulse">
        <div className="text-8xl mb-4">=�</div>
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4">
          GRAMMAR WARRIOR
        </h1>
        <p className="text-xl text-gray-300">Save the Galaxy with Perfect Grammar!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {Object.entries(PLANETS_DATA).map(([key, planet]) => (
          <button
            key={key}
            onClick={() => startGame(key)}
            className={`bg-gradient-to-br ${planet.color} p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20`}
          >
            <h3 className="text-2xl font-bold text-white mb-2">{planet.name}</h3>
            <p className="text-white/90 mb-2">Monster: {planet.monster}</p>
            <p className="text-white/80 text-sm mb-1">{planet.topic}</p>
            <p className="text-white/70 text-xs">Difficulty: {planet.difficulty}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderGame = () => {
    if (!selectedPlanet) return null;
    const planet = PLANETS_DATA[selectedPlanet];
    const question = planet.questions[currentQuestion];
    const optionsLabels = ['a', 'b', 'c', 'd'];

    return (
    <div
      className={`min-h-screen bg-animated relative overflow-hidden`}
      style={{ backgroundImage: `linear-gradient(135deg, ${planet.monsterColor}, rgba(0,0,0,0.6))` }}
    >
    <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0">
            {[...Array(40)].map((_, i) => {
              const left = Math.random() * 100;
              const top = Math.random() * 100;
              const delay = Math.random() * 3;
              return (
                <div key={i} style={{ left: `${left}%`, top: `${top}%`, position: 'absolute' }}>
                  <div className="sparkle" style={{ animationDelay: `${delay}s` }} />
                </div>
              );
            })}
          </div>
          <div className="absolute left-[10%] top-[70%] transform -translate-y-1/2">
            <div className="relative">
                <div className="hero-avatar animate-bounce" style={{ animationDuration: '3s' }}>{selectedHero?.icon || '🚀'}</div>
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-blue-400"></div>
            </div>
          </div>

          <div className="absolute right-[10%] top-[50%] transform -translate-y-1/2">
            <div className="relative animate-pulse" style={{ animationDuration: '2s' }}>
              <div
                  className="monster-avatar shadow-2xl"
                style={{
                  backgroundColor: MONSTERS[selectedPlanet]?.color || planet.monsterColor,
                  boxShadow: `0 0 60px ${MONSTERS[selectedPlanet]?.color || planet.monsterColor}`
                }}
              >
                {MONSTERS[selectedPlanet]?.icon || '👾'}
              </div>
              {monsterHealth < 30 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-5xl text-red-500 animate-bounce"></div>
                </div>
              )}
            </div>
          </div>

          {lasers.map((laser: { id: any; x: any; y: any; }) => (
            <div
              key={laser.id}
              className="absolute text-cyan-400 text-2xl font-bold"
              style={{
                left: `${laser.x}%`,
                top: `${laser.y}%`,
                textShadow: '0 0 20px #06b6d4, 0 0 40px #06b6d4',
                animation: 'laser 0.6s ease-out forwards'
              }}
            >
              �
            </div>
          ))}

          {fires.map((fire: { id: any; x: any; y: any; }) => (
            <div
              key={fire.id}
              className="absolute text-orange-500 text-3xl"
              style={{
                left: `${fire.x}%`,
                top: `${fire.y}%`,
                textShadow: '0 0 10px #f97316',
                animation: 'fire 0.8s ease-out forwards'
              }}
            >
              
            </div>
          ))}

          {explosions.map((exp: { id: any; x: any; y: any; }) => (
            <div
              key={exp.id}
              className="absolute text-yellow-400 text-5xl"
              style={{
                left: `${exp.x}%`,
                top: `${exp.y}%`,
                animation: 'explosion 0.4s ease-out forwards'
              }}
            >
              8
            </div>
          ))}
        </div>

        <div className="relative z-10 p-8">
          <div className="max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border-2 border-cyan-400/50 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-cyan-400 font-bold text-lg">YOU</span>
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <div className="w-full bg-gray-800 rounded-full h-5 border border-gray-600">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-5 rounded-full transition-all duration-500 shadow-lg"
                    style={{
                      width: `${playerHealth}%`,
                      boxShadow: '0 0 10px #22c55e'
                    }}
                  />
                </div>
                <p className="text-cyan-300 text-sm mt-1 font-bold">{playerHealth} HP</p>
              </div>

              <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border-2 border-yellow-400/50 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-3xl">{timeLeft}s</span>
                </div>
                <div className="text-center">
                  <Trophy className="w-6 h-6 inline-block text-yellow-400 mr-2" />
                  <span className="text-white font-bold text-xl">{score}</span>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg border-2 border-red-400/50 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-400 font-bold text-lg">{MONSTERS[selectedPlanet]?.name || planet.monster}</span>
                  <Zap className="w-5 h-5 text-orange-400" />
                </div>
                <div className="w-full bg-gray-800 rounded-full h-5 border border-gray-600">
                  <div
                    className="bg-gradient-to-r from-red-400 to-red-600 h-5 rounded-full transition-all duration-500 shadow-lg"
                    style={{
                      width: `${monsterHealth}%`,
                      boxShadow: '0 0 10px #ef4444'
                    }}
                  />
                </div>
                <p className="text-red-300 text-sm mt-1 font-bold">{monsterHealth} HP</p>
              </div>
            </div>

            {combo > 0 && (
              <div className="text-center bg-gradient-to-r from-yellow-500/30 to-orange-500/30 backdrop-blur-md p-3 rounded-lg border-2 border-yellow-400 animate-pulse shadow-lg">
                <span className="text-yellow-300 font-bold text-xl">
                  COMBO x{combo}! Next laser: +{10 + combo * 2} damage!
                </span>
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border-4 border-white/30">
              <div className="mb-6">
                <p className="text-cyan-400 text-sm mb-2 font-bold">
                  MISSION {currentQuestion + 1} / {planet.questions.length}
                </p>
                <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">{question.q}</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {question.options.map((option, idx) => {
                  let buttonStyle = "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border-2 border-gray-500";

                  if (selectedAnswer !== null) {
                    if (idx === question.correct) {
                      buttonStyle = "bg-gradient-to-r from-green-500 to-green-700 text-white border-2 border-green-400 animate-pulse";
                    } else if (idx === selectedAnswer) {
                      buttonStyle = "bg-gradient-to-r from-red-500 to-red-700 text-white border-2 border-red-400 animate-pulse";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      className={`${buttonStyle} p-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed shadow-lg`}
                    >
                      <span className="font-bold mr-3">{optionsLabels[idx]}.</span>
                      {option}
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className={`mt-6 p-4 rounded-lg border-2 ${feedback.type === 'correct' ? 'bg-green-500/20 border-green-400 backdrop-blur-md' : 'bg-red-500/20 border-red-400 backdrop-blur-md'}`}>
                  <p className={`text-2xl font-bold text-center ${feedback.type === 'correct' ? 'text-green-300' : 'text-red-300'}`}>
                    {feedback.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes laser {
            0% {
              transform: translateX(0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translateX(600px) scale(0.5);
              opacity: 0;
            }
          }

          @keyframes fire {
            0% {
              transform: translateX(0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translateX(-600px) scale(0.5);
              opacity: 0;
            }
          }

          @keyframes explosion {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            50% {
              transform: scale(1.5);
              opacity: 0.8;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  };

  const renderVictory = () => {
    if (!selectedPlanet) return null;
    const planet = PLANETS_DATA[selectedPlanet];
    return (
      <div
        className={`min-h-screen bg-animated flex items-center justify-center p-8 relative overflow-hidden`}
        style={{ backgroundImage: `linear-gradient(135deg, ${planet.monsterColor}, rgba(0,0,0,0.5))` }}
      >
        <div className="victory-confetti">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              ref={(el) => { confettiRefs.current[i] = el as HTMLDivElement; }}
              className="confetti-piece"
            />
          ))}
        </div>

        <div className="relative z-10 bg-black/60 backdrop-blur-lg p-10 rounded-3xl border-2 border-white/30 text-center">
          <div className="text-9xl mb-4">🏆</div>
          <h2 className="text-6xl font-bold text-white mb-4">VICTORY!</h2>
          <p className="text-xl text-white/80 mb-6">You defeated {MONSTERS[selectedPlanet]?.name || planet.monster} and saved {planet.name}!</p>
          <p className="text-yellow-300 font-bold text-2xl mb-6">Score: {score}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => { setGameState('hero-select'); setSelectedPlanet(null); setSelectedHero(null); }} className="px-6 py-3 rounded-lg bg-cyan-500 text-white font-bold">Back to Hero Select</button>
            <button onClick={() => startGame(selectedPlanet)} className="px-6 py-3 rounded-lg bg-green-500 text-white font-bold">Play Again</button>
          </div>
        </div>
      </div>
    );
  };

  const renderDefeat = () => {
    const planet = selectedPlanet ? PLANETS_DATA[selectedPlanet] : null;
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-8 relative overflow-hidden`}
        style={{ backgroundImage: `${planet ? `linear-gradient(135deg, ${planet.monsterColor}, rgba(0,0,0,0.6))` : 'linear-gradient(180deg, #111, #222)'}` }}
      >
        <div className="relative z-10 bg-black/60 backdrop-blur-lg p-10 rounded-3xl border-2 border-white/30 text-center">
          <div className="text-9xl mb-4">💥</div>
          <h2 className="text-6xl font-bold text-white mb-4">DEFEAT</h2>
          <p className="text-xl text-white/80 mb-6">The monster was too strong this time.</p>
          <p className="text-red-300 font-bold text-2xl mb-6">Score: {score}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => { setGameState('hero-select'); setSelectedPlanet(null); setSelectedHero(null); }} className="px-6 py-3 rounded-lg bg-cyan-500 text-white font-bold">Back to Hero Select</button>
            {selectedPlanet && <button onClick={() => startGame(selectedPlanet)} className="px-6 py-3 rounded-lg bg-red-500 text-white font-bold">Try Again</button>}
          </div>
        </div>
        <div className="defeat-overlay" />
      </div>
    );
  };

  return (
    <>
      {gameState === 'hero-select' && <HeroSelection onSelectHero={handleHeroSelect} />}
      {gameState === 'menu' && renderMenu()}
      {gameState === 'playing' && renderGame()}
      {gameState === 'victory' && renderVictory()}
      {gameState === 'defeat' && renderDefeat()}
    </>
  );
};

export default GrammarWarrior;
