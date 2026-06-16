// OpenRouter API service for LearnerBot
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ApiResponse {
  message: string;
  error?: string;
}

class OpenRouterApiService {
  private apiKey: string;
  private baseUrl: string = "https://openrouter.ai/api/v1";
  private siteUrl: string;
  private siteName: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";
    this.siteUrl = import.meta.env.VITE_SITE_URL || "https://learnerbot.ai";
    this.siteName = import.meta.env.VITE_SITE_NAME || "LearnerBot AI Assistant";

    if (!this.apiKey) {
      console.warn("OpenRouter API key not found. Please set VITE_OPENROUTER_API_KEY in your .env file");
    }
  }

  async sendMessage(
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<ApiResponse> {
    // If no API key, return a helpful fallback response
    if (!this.apiKey) {
      return {
        message: `Hey there, future genius! 🌟 I'm LearnerBot, your AI learning companion! 

I'm here to help you explore any topic you're curious about - from science and math to history and beyond! 

**To get me fully working, you'll need to:**
1. Get an API key from [OpenRouter](https://openrouter.ai)
2. Create a \`.env\` file in your project root
3. Add: \`VITE_OPENROUTER_API_KEY=your_api_key_here\`

What would you like to learn about today? I can:
- Explain complex topics in simple ways 📚
- Help with homework and projects 📝
- Create fun quizzes to test your knowledge 🎯
- Answer any questions you have ❓
- Make learning an exciting adventure! 🚀

Just ask me anything - I'm ready to help you discover amazing things! ✨`,
        error: "API key not configured - please add VITE_OPENROUTER_API_KEY to your .env file",
      };
    }

    try {
      const systemPrompt = `You are LearnerBot, an enthusiastic AI learning assistant designed specifically for young learners aged 10-15. Your mission is to make learning fun, engaging, and accessible.

Your personality:
- Super friendly and encouraging, like a cool older sibling
- Use emojis and fun language to keep things exciting
- Patient and supportive - never make anyone feel bad for not knowing something
- Curious and enthusiastic about everything
- Always positive and motivating

Your teaching style:
- Break complex topics into simple, digestible pieces
- Use analogies and real-world examples kids can relate to
- Ask follow-up questions to keep them engaged
- Celebrate their curiosity and progress
- Make learning feel like an adventure, not work

Your capabilities:
- Help with homework across all subjects
- Explain science, math, history, languages, and more
- Provide step-by-step guidance
- Create fun learning activities and quizzes
- Adapt explanations to their level of understanding
- Encourage critical thinking and curiosity

Keep responses engaging but concise - attention spans vary! Use markdown formatting for better readability.`;

      const messages: ChatMessage[] = [
        {
          role: "system",
          content: systemPrompt,
        },
        ...conversationHistory,
        {
          role: "user",
          content: message,
        },
      ];

      console.log("Sending request to OpenRouter API...");

      const requestBody = {
        model: "openai/gpt-4o-mini", // Using mini version for better reliability and cost
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        stream: false,
      };

      console.log("Request body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": this.siteUrl,
          "X-Title": this.siteName,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);

        let errorMessage = `API request failed with status ${response.status}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error?.message || errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
          errorMessage = errorText || errorMessage;
        }

        // Handle specific error cases
        if (response.status === 401) {
          errorMessage = "Invalid API key. Please check your OpenRouter API key.";
        } else if (response.status === 429) {
          errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
        } else if (response.status === 402) {
          errorMessage = "Insufficient credits. Please check your OpenRouter account balance.";
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("API Response received:", data);

      // Validate response structure
      if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        console.error("Invalid response structure:", data);
        throw new Error("Invalid response format from OpenRouter API");
      }

      const choice = data.choices[0];
      if (!choice || !choice.message || typeof choice.message.content !== 'string') {
        console.error("Invalid choice structure:", choice);
        throw new Error("Invalid message format in API response");
      }

      return {
        message: choice.message.content.trim(),
      };

    } catch (error) {
      console.error("OpenRouter API Error:", error);

      let errorMessage = "An unexpected error occurred";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Return user-friendly error messages
      const friendlyMessage = `Oops! I'm having trouble connecting to my brain right now! 🧠 

**Error:** ${errorMessage}

**Don't worry though!** Here are some things you can try:
- Check your internet connection 🌐
- Make sure your API key is valid 🔑
- Try asking me something else in a moment ⏰

I'm still excited to help you learn amazing things! 🚀✨`;

      return {
        message: friendlyMessage,
        error: errorMessage,
      };
    }
  }

  // Test the API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.sendMessage("Hello, are you working?");
      return !response.error;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }

  // Get available models
  async getAvailableModels(): Promise<any[]> {
    if (!this.apiKey) {
      console.warn("No API key available for fetching models");
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": this.siteUrl,
          "X-Title": this.siteName,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching models:", error);
      return [];
    }
  }
}

export const apiService = new OpenRouterApiService();