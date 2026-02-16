import { GoogleGenAI } from "@google/genai";
import { ChatMessage, Product } from "../types";

// NOTE: in a real app, this should be in an environment variable.
// I am assuming the process.env.API_KEY is available as per instructions.
// If running locally without env, this might fail, but for the generated code structure it's correct.

const getAIClient = () => {
    // Fallback to a placeholder if env is missing to prevent crash in demo mode,
    // though functionality will be limited.
    const apiKey = process.env.API_KEY || 'dummy_key';
    return new GoogleGenAI({ apiKey });
};

export const generateProductRecommendation = async (
  query: string, 
  availableProducts: Product[]
): Promise<string> => {
  try {
    const ai = getAIClient();
    const productContext = availableProducts.map(p => 
      `${p.name} (${p.category}): ₹${p.price} - ${p.description}`
    ).join('\n');

    const prompt = `
      You are an expert sales assistant for NetSmart, a networking equipment store.
      User Query: "${query}"
      
      Available Products:
      ${productContext}
      
      Based on the user query, recommend the best product(s) from the list. 
      Explain why in 2-3 sentences. If no product fits, suggest general advice. 
      Prices are in Indian Rupees (₹).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "I couldn't generate a recommendation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the recommendation engine right now.";
  }
};

export const chatWithBot = async (
  history: ChatMessage[],
  newMessage: string,
  availableProducts: Product[]
): Promise<string> => {
  try {
    const ai = getAIClient();
    
    // Prepare context
    const productContext = availableProducts.map(p => 
      `${p.name} (₹${p.price})`
    ).join(', ');

    const systemInstruction = `
      You are NetSmart AI, a helpful and technical assistant for a networking store in India. 
      You help customers choose routers, switches, and other gear.
      Our catalog includes: ${productContext}.
      Be concise, professional, and friendly. 
      If asked about non-networking topics, politely steer back to technology.
      Always quote prices in INR (₹).
    `;

    // Convert internal history to Gemini format if using chat history, 
    // but here we will just send a single prompt with history context for simplicity 
    // or use the proper chat API. Let's use the Chat API.
    
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I didn't catch that.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm currently offline. Please try again later.";
  }
};
