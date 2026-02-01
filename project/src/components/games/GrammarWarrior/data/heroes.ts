import { Hero } from '../types/game';

export const HEROES: Hero[] = [
  {
    id: 'captain-grammar',
    name: 'Captain Grammar',
    icon: '🦸',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-gradient-to-b from-blue-900 via-cyan-900 to-blue-800',
    description: 'Master of syntax and structure',
    ability: '+2 bonus damage on combo attacks'
  },
  {
    id: 'word-wizard',
    name: 'Word Wizard',
    icon: '🧙',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-gradient-to-b from-purple-900 via-pink-900 to-purple-800',
    description: 'Conjures perfect sentences',
    ability: '+5 seconds time bonus on correct answers'
  },
  {
    id: 'syntax-knight',
    name: 'Syntax Knight',
    icon: '⚔️',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-gradient-to-b from-red-900 via-orange-900 to-red-800',
    description: 'Defender of proper punctuation',
    ability: 'Reduced damage from wrong answers'
  },
  {
    id: 'verb-ninja',
    name: 'Verb Ninja',
    icon: '🥷',
    color: 'from-gray-700 to-gray-900',
    bgColor: 'bg-gradient-to-b from-gray-900 via-slate-900 to-gray-800',
    description: 'Swift and precise with tenses',
    ability: 'Extra time for answering'
  },
  {
    id: 'punctuation-paladin',
    name: 'Punctuation Paladin',
    icon: '🛡️',
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-gradient-to-b from-yellow-900 via-amber-900 to-yellow-800',
    description: 'Guardian of commas and periods',
    ability: 'Higher starting health'
  },
  {
    id: 'spelling-sage',
    name: 'Spelling Sage',
    icon: '📚',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-gradient-to-b from-green-900 via-emerald-900 to-green-800',
    description: 'Wise in the ways of words',
    ability: 'Bonus points per correct answer'
  }
];
