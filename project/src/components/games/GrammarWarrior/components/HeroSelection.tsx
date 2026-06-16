import React from 'react';
import { HEROES } from '../data/heroes';
import { Hero } from '../types/game';

type HeroSelectionProps = {
  onSelectHero: (hero: Hero) => void;
};

const HeroSelection: React.FC<HeroSelectionProps> = ({ onSelectHero }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-slate-900 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4 animate-pulse">
          Choose Your Hero
        </h1>
        <p className="text-2xl text-gray-300">Select a warrior to defend the galaxy from grammar monsters!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
        {HEROES.map((hero) => (
          <button
            key={hero.id}
            onClick={() => onSelectHero(hero)}
            className={`bg-gradient-to-br ${hero.color} p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white/30 hover:border-white/60 group relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>

            <div className="relative z-10">
              <div className="text-8xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {hero.icon}
              </div>

              <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                {hero.name}
              </h3>

              <p className="text-white/90 text-lg mb-4 min-h-[3rem]">
                {hero.description}
              </p>

              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <p className="text-yellow-300 font-semibold text-sm">
                  ⚡ {hero.ability}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border-2 border-cyan-400/50 max-w-2xl">
          <p className="text-cyan-300 text-lg">
            Each hero has unique abilities that will help you in your quest to defeat the grammar monsters!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSelection;
