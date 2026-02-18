// Flashcard AI Generation Service - Uses dedicated API key
export interface FlashcardAiResponse {
  message: string;
  error?: string;
}

class FlashcardAiService {
  private apiKey: string;
  private baseUrl: string = "https://openrouter.ai/api/v1";

  constructor() {
    this.apiKey = import.meta.env.VITE_FLASHCARD_AI_KEY || "";

    if (!this.apiKey) {
      console.warn("Flashcard AI Key not found. Please set VITE_FLASHCARD_AI_KEY in your .env file");
    }
  }

  async generateFlashcards(topic: string): Promise<FlashcardAiResponse> {
    if (!this.apiKey) {
      return {
        message: "Flashcard AI key not configured",
        error: "Please set VITE_FLASHCARD_AI_KEY in your .env file",
      };
    }

    try {
      const prompt = `Generate exactly 5 unique and educational flashcards about "${topic}". 

Return ONLY a valid JSON array with NO markdown code blocks, NO extra text, just the array itself:
[
  {
    "question": "Clear, concise question",
    "answer": "Detailed, educational answer",
    "difficulty": "Easy",
    "subject": "science"
  },
  ...
]

Valid subjects: science, mathematics, english, social-science
Valid difficulties: Easy, Medium, Hard`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": "https://learnerbot.ai",
          "X-Title": "LearnerBot Flashcard Generator",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      return {
        message: content,
      };
    } catch (error: any) {
      console.error("Flashcard AI generation error:", error);
      return {
        message: "",
        error: error?.message || "Failed to generate flashcards",
      };
    }
  }
}

export const flashcardAiService = new FlashcardAiService();
