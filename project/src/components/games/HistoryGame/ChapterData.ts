// Chapter data extracted from the Quizes folder
export interface ChapterQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  points: number;
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  year: string;
  background: string;
  ambient: string;
  color: string;
  difficulty: number;
  questions: ChapterQuestion[];
}

export const chapters: Chapter[] = [
  {
    id: "chapter1",
    name: "Chapter 1: Tracing Changes Through a Thousand Years",
    description:
      "Understanding historical changes and developments over a millennium",
    year: "700-1750 CE",
    background: "bg-gradient-to-br from-amber-600 to-orange-700",
    ambient: "medieval",
    color: "#d97706",
    difficulty: 1,
    questions: [
      {
        question:
          "What was the main source of information about the medieval period?",
        options: [
          "Newspapers",
          "Coins and inscriptions",
          "Television",
          "Radio",
        ],
        correct: 1,
        explanation:
          "Coins and inscriptions were the main sources of information about the medieval period.",
        points: 10,
      },
      {
        question:
          "Which period is known as the medieval period in Indian history?",
        options: ["700-1750 CE", "500-1000 CE", "1000-1500 CE", "1500-2000 CE"],
        correct: 0,
        explanation:
          "The period from 700 to 1750 CE is known as the medieval period in Indian history.",
        points: 10,
      },
      {
        question:
          "What was the main occupation of people during the medieval period?",
        options: ["Hunting", "Agriculture", "Fishing", "Mining"],
        correct: 1,
        explanation:
          "Agriculture was the main occupation of people during the medieval period.",
        points: 10,
      },
      {
        question:
          "Which of the following was NOT a source of medieval history?",
        options: ["Coins", "Inscriptions", "Newspapers", "Manuscripts"],
        correct: 2,
        explanation:
          "Newspapers were not available during the medieval period.",
        points: 15,
      },
      {
        question:
          "What helped historians understand the medieval period better?",
        options: [
          "Modern technology",
          "Written records",
          "Oral traditions",
          "All of these",
        ],
        correct: 3,
        explanation:
          "Written records, oral traditions, and modern technology all helped historians understand the medieval period.",
        points: 15,
      },
    ],
  },
  {
    id: "chapter2",
    name: "Chapter 2: New Kings and Kingdoms",
    description:
      "The emergence of new dynasties and kingdoms in medieval India",
    year: "700-1200 CE",
    background: "bg-gradient-to-br from-red-600 to-purple-700",
    ambient: "kingdom",
    color: "#dc2626",
    difficulty: 2,
    questions: [
      {
        question: "Who was the founder of the Chola dynasty?",
        options: ["Rajaraja I", "Rajendra I", "Vijayalaya", "Kulottunga I"],
        correct: 2,
        explanation: "Vijayalaya was the founder of the Chola dynasty.",
        points: 15,
      },
      {
        question: "Which Chola king built the Brihadeshwara temple?",
        options: ["Rajaraja I", "Rajendra I", "Vijayalaya", "Kulottunga I"],
        correct: 0,
        explanation:
          "Rajaraja I built the famous Brihadeshwara temple at Thanjavur.",
        points: 15,
      },
      {
        question: "What was the capital of the Chola kingdom?",
        options: ["Madurai", "Thanjavur", "Kanchipuram", "Uraiyur"],
        correct: 1,
        explanation: "Thanjavur was the capital of the Chola kingdom.",
        points: 10,
      },
      {
        question: "Which dynasty ruled over the Deccan region?",
        options: ["Cholas", "Chalukyas", "Pallavas", "Pandyas"],
        correct: 1,
        explanation: "The Chalukyas ruled over the Deccan region.",
        points: 15,
      },
      {
        question: "What was the main source of income for medieval kingdoms?",
        options: ["Trade", "Agriculture", "Mining", "Fishing"],
        correct: 1,
        explanation:
          "Agriculture was the main source of income for medieval kingdoms.",
        points: 10,
      },
    ],
  },
  {
    id: "chapter3",
    name: "Chapter 3: The Delhi Sultans",
    description: "The establishment and expansion of the Delhi Sultanate",
    year: "1206-1526 CE",
    background: "bg-gradient-to-br from-green-600 to-blue-700",
    ambient: "sultanate",
    color: "#059669",
    difficulty: 3,
    questions: [
      {
        question: "Who was the first Sultan of Delhi?",
        options: [
          "Qutb-ud-din Aibak",
          "Iltutmish",
          "Balban",
          "Alauddin Khalji",
        ],
        correct: 0,
        explanation: "Qutb-ud-din Aibak was the first Sultan of Delhi.",
        points: 15,
      },
      {
        question: "Which Sultan built the Qutub Minar?",
        options: [
          "Qutb-ud-din Aibak",
          "Iltutmish",
          "Balban",
          "Alauddin Khalji",
        ],
        correct: 0,
        explanation: "Qutb-ud-din Aibak started building the Qutub Minar.",
        points: 15,
      },
      {
        question: "Who completed the construction of Qutub Minar?",
        options: [
          "Qutb-ud-din Aibak",
          "Iltutmish",
          "Balban",
          "Alauddin Khalji",
        ],
        correct: 1,
        explanation: "Iltutmish completed the construction of Qutub Minar.",
        points: 15,
      },
      {
        question: "Which Sultan introduced the 'Dagh' system?",
        options: [
          "Alauddin Khalji",
          "Muhammad Tughlaq",
          "Firoz Tughlaq",
          "Ibrahim Lodi",
        ],
        correct: 0,
        explanation: "Alauddin Khalji introduced the 'Dagh' system for horses.",
        points: 20,
      },
      {
        question: "What was the 'Dagh' system?",
        options: [
          "Tax system",
          "Horse branding system",
          "Land measurement",
          "Military system",
        ],
        correct: 1,
        explanation:
          "The 'Dagh' system was a horse branding system to prevent fraud.",
        points: 15,
      },
    ],
  },
  {
    id: "chapter4",
    name: "Chapter 4: The Mughal Empire",
    description: "The rise and expansion of the Mughal Empire in India",
    year: "1526-1857 CE",
    background: "bg-gradient-to-br from-yellow-600 to-pink-700",
    ambient: "mughal",
    color: "#d97706",
    difficulty: 2,
    questions: [
      {
        question: "Who was the first Mughal emperor?",
        options: ["Akbar", "Babur", "Humayun", "Jahangir"],
        correct: 1,
        explanation:
          "Babur was the first Mughal emperor who established the empire.",
        points: 15,
      },
      {
        question: "Which Mughal emperor was known as 'Akbar the Great'?",
        options: ["Babur", "Humayun", "Akbar", "Jahangir"],
        correct: 2,
        explanation:
          "Akbar was known as 'Akbar the Great' for his administrative skills.",
        points: 15,
      },
      {
        question: "Who built the Taj Mahal?",
        options: ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"],
        correct: 2,
        explanation:
          "Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal.",
        points: 15,
      },
      {
        question: "What was the capital of the Mughal Empire?",
        options: ["Delhi", "Agra", "Fatehpur Sikri", "All of these"],
        correct: 3,
        explanation:
          "The Mughal Empire had different capitals at different times including Delhi, Agra, and Fatehpur Sikri.",
        points: 15,
      },
      {
        question: "Which Mughal emperor abolished the Jizya tax?",
        options: ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"],
        correct: 0,
        explanation:
          "Akbar abolished the Jizya tax to promote religious harmony.",
        points: 15,
      },
    ],
  },
  {
    id: "chapter6",
    name: "Chapter 6: Towns, Traders and Craftspersons",
    description:
      "Urban centers, trade networks, and skilled artisans in medieval India",
    year: "700-1750 CE",
    background: "bg-gradient-to-br from-indigo-600 to-purple-700",
    ambient: "trade",
    color: "#7c3aed",
    difficulty: 3,
    questions: [
      {
        question: "What were the main trading centers in medieval India?",
        options: ["Villages", "Towns and cities", "Forests", "Mountains"],
        correct: 1,
        explanation:
          "Towns and cities were the main trading centers in medieval India.",
        points: 10,
      },
      {
        question: "Which craft was famous in medieval India?",
        options: [
          "Textile weaving",
          "Pottery making",
          "Metal work",
          "All of these",
        ],
        correct: 3,
        explanation:
          "Textile weaving, pottery making, and metal work were all famous crafts in medieval India.",
        points: 15,
      },
      {
        question: "What was the main mode of transport for traders?",
        options: ["Airplanes", "Cars", "Boats and caravans", "Trains"],
        correct: 2,
        explanation:
          "Boats and caravans were the main modes of transport for traders.",
        points: 10,
      },
      {
        question: "Which city was famous for its textile industry?",
        options: ["Delhi", "Agra", "Surat", "All of these"],
        correct: 3,
        explanation:
          "Delhi, Agra, and Surat were all famous for their textile industries.",
        points: 15,
      },
      {
        question: "What were craftspersons organized into?",
        options: ["Unions", "Guilds", "Clubs", "Societies"],
        correct: 1,
        explanation:
          "Craftspersons were organized into guilds to protect their interests.",
        points: 15,
      },
    ],
  },
];

// Historical periods for the original game
export const historicalPeriods = [
  {
    id: "harappan",
    name: "Harappan Civilization",
    year: "2600-1900 BCE",
    description: "Ancient Indus Valley Civilization",
    background: "bg-gradient-to-br from-amber-600 to-orange-700",
    ambient: "birds",
    color: "#d97706",
    difficulty: 1,
    questions: [
      {
        question:
          "Which river was most important for the Harappan civilization?",
        options: ["Ganga", "Indus", "Yamuna", "Brahmaputra"],
        correct: 1,
        explanation:
          "The Indus River was the lifeline of the Harappan civilization.",
        points: 10,
      },
      {
        question: "What was the main occupation of Harappan people?",
        options: ["Hunting", "Agriculture", "Fishing", "Mining"],
        correct: 1,
        explanation:
          "Agriculture was the primary occupation of Harappan people.",
        points: 10,
      },
      {
        question: "Which animal was domesticated by Harappans?",
        options: ["Horse", "Elephant", "Cow", "All of these"],
        correct: 3,
        explanation: "Harappans domesticated cows, horses, and elephants.",
        points: 15,
      },
    ],
  },
  {
    id: "mauryan",
    name: "Mauryan Empire",
    year: "322-185 BCE",
    description: "The First Great Empire of India",
    background: "bg-gradient-to-br from-red-600 to-purple-700",
    ambient: "battle",
    color: "#dc2626",
    difficulty: 2,
    questions: [
      {
        question: "Who was the founder of the Maurya Empire?",
        options: ["Ashoka", "Chandragupta Maurya", "Bindusara", "Samprati"],
        correct: 1,
        explanation:
          "Chandragupta Maurya founded the Maurya Empire in 322 BCE.",
        points: 15,
      },
      {
        question: "Which famous emperor converted to Buddhism?",
        options: ["Chandragupta", "Ashoka", "Bindusara", "Samprati"],
        correct: 1,
        explanation: "Ashoka converted to Buddhism after the Kalinga war.",
        points: 15,
      },
      {
        question: "What was the capital of Mauryan Empire?",
        options: ["Delhi", "Pataliputra", "Taxila", "Ujjain"],
        correct: 1,
        explanation:
          "Pataliputra (modern Patna) was the capital of Mauryan Empire.",
        points: 10,
      },
    ],
  },
  {
    id: "delhi-sultanate",
    name: "Delhi Sultanate",
    year: "1206-1526 CE",
    description: "Medieval Islamic Sultanate",
    background: "bg-gradient-to-br from-green-600 to-blue-700",
    ambient: "market",
    color: "#059669",
    difficulty: 3,
    questions: [
      {
        question: "Who was the first Sultan of Delhi?",
        options: [
          "Qutb-ud-din Aibak",
          "Iltutmish",
          "Balban",
          "Alauddin Khalji",
        ],
        correct: 0,
        explanation: "Qutb-ud-din Aibak was the first Sultan of Delhi.",
        points: 15,
      },
      {
        question: "Which Sultan built the Qutub Minar?",
        options: [
          "Qutb-ud-din Aibak",
          "Iltutmish",
          "Balban",
          "Alauddin Khalji",
        ],
        correct: 0,
        explanation: "Qutb-ud-din Aibak started building the Qutub Minar.",
        points: 15,
      },
      {
        question: 'Which Sultan introduced the "Dagh" system?',
        options: [
          "Alauddin Khalji",
          "Muhammad Tughlaq",
          "Firoz Tughlaq",
          "Ibrahim Lodi",
        ],
        correct: 0,
        explanation: 'Alauddin Khalji introduced the "Dagh" system for horses.',
        points: 20,
      },
    ],
  },
  {
    id: "mughal",
    name: "Mughal Empire",
    year: "1526-1857 CE",
    description: "The Golden Age of Indian Culture",
    background: "bg-gradient-to-br from-yellow-600 to-pink-700",
    ambient: "palace",
    color: "#d97706",
    difficulty: 2,
    questions: [
      {
        question: "Who was the first Mughal emperor?",
        options: ["Akbar", "Babur", "Humayun", "Jahangir"],
        correct: 1,
        explanation:
          "Babur was the first Mughal emperor who established the empire.",
        points: 15,
      },
      {
        question: 'Which Mughal emperor was known as "Akbar the Great"?',
        options: ["Babur", "Humayun", "Akbar", "Jahangir"],
        correct: 2,
        explanation:
          'Akbar was known as "Akbar the Great" for his administrative skills.',
        points: 15,
      },
      {
        question: "Who built the Taj Mahal?",
        options: ["Akbar", "Jahangir", "Shah Jahan", "Aurangzeb"],
        correct: 2,
        explanation:
          "Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal.",
        points: 15,
      },
    ],
  },
  {
    id: "gupta",
    name: "Gupta Empire",
    year: "320-550 CE",
    description: "The Golden Age of Ancient India",
    background: "bg-gradient-to-br from-indigo-600 to-purple-700",
    ambient: "temple",
    color: "#7c3aed",
    difficulty: 3,
    questions: [
      {
        question: "Who was the founder of Gupta Empire?",
        options: [
          "Chandragupta I",
          "Samudragupta",
          "Chandragupta II",
          "Kumaragupta",
        ],
        correct: 0,
        explanation: "Chandragupta I was the founder of the Gupta Empire.",
        points: 15,
      },
      {
        question: 'Which Gupta ruler was called "Napoleon of India"?',
        options: [
          "Chandragupta I",
          "Samudragupta",
          "Chandragupta II",
          "Kumaragupta",
        ],
        correct: 1,
        explanation:
          'Samudragupta was called "Napoleon of India" for his military conquests.',
        points: 20,
      },
      {
        question: "Which famous poet lived during Gupta period?",
        options: ["Kalidasa", "Tulsidas", "Surdas", "Kabir"],
        correct: 0,
        explanation: "Kalidasa was the most famous poet of the Gupta period.",
        points: 15,
      },
    ],
  },
];
