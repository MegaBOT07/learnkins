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

      // Backend can return success:false with a user-friendly message
      if (!response.data?.success) {
        return {
          message: "",
          error: response.data?.message || "AI returned no flashcards. Try a different topic.",
        };
      }

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
      const status = error?.response?.status;
      const serverMsg = error?.response?.data?.message;

      // Map specific HTTP statuses to clean user messages
      let friendlyMsg: string;
      if (status === 401) {
        friendlyMsg = "Please log in to use AI flashcard generation.";
      } else if (status === 429) {
        friendlyMsg = "AI service is busy right now. Please wait a moment and try again.";
      } else if (status === 402) {
        friendlyMsg = "AI service usage limit reached. Please try again later.";
      } else if (status === 503 || status === 502) {
        // Use the server's already-sanitized message for service errors
        friendlyMsg = serverMsg || "AI flashcard generation is temporarily unavailable. Please try again later.";
      } else if (serverMsg) {
        // Use server message only if it exists (already sanitized on backend)
        friendlyMsg = serverMsg;
      } else {
        friendlyMsg = "Failed to generate flashcards. Please try again.";
      }

      console.error("Flashcard AI generation error:", error);
      return { message: "", error: friendlyMsg };
    }
  }
}

export const flashcardAiService = new FlashcardAiService();

