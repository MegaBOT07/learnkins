import { flashcardAPI } from "../utils/api";

export interface FlashcardAiResponse {
  message: string;
  error?: string;
}

export interface AiGenerationParams {
  topic: string;
  subject?: string;
  difficulty?: string;
  count?: number;
}

class FlashcardAiService {
  async generateFlashcards(params: AiGenerationParams): Promise<FlashcardAiResponse> {
    try {
      const response = await flashcardAPI.generateAIFlashcards({
        topic: params.topic,
        subject: params.subject || 'science',
        difficulty: params.difficulty || 'Medium',
        count: params.count || 5,
      });
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

  async saveGeneratedFlashcards(cards: any[]): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const response = await flashcardAPI.batchCreateFlashcards(cards);
      const saved = response.data?.data || [];
      return { success: true, data: saved };
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save flashcards";
      console.error("Save flashcards error:", error);
      return { success: false, error: msg };
    }
  }
}

export const flashcardAiService = new FlashcardAiService();
