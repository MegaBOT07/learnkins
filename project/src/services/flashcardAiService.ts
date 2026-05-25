import { flashcardAPI } from "../utils/api";

export interface FlashcardAiResponse {
  message: string;
  error?: string;
}

class FlashcardAiService {
  async generateFlashcards(topic: string): Promise<FlashcardAiResponse> {
    try {
      const response = await flashcardAPI.generateAIFlashcards(topic);
      const cards = response.data?.data || [];

      if (!Array.isArray(cards) || cards.length === 0) {
        return {
          message: "",
          error: "AI returned no flashcards. Try a different topic.",
        };
      }

      return {
        message: JSON.stringify(cards),
      };
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to generate flashcards";
      console.error("Flashcard AI generation error:", error);
      return { message: "", error: msg };
    }
  }
}

export const flashcardAiService = new FlashcardAiService();
