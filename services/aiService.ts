import { GoogleGenAI, Type } from "@google/genai";
import { AIParsedAction } from "../types";

// NOTE: Ideally, this key should be in process.env.API_KEY.
// For this generated code to function in the preview environment, we assume the environment has it.
const apiKey = process.env.API_KEY || ''; 

let genAI: GoogleGenAI | null = null;

try {
  if (apiKey) {
    genAI = new GoogleGenAI({ apiKey });
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI", error);
}

export const processVoiceCommand = async (
  transcript: string,
  availableCategories: string[]
): Promise<AIParsedAction> => {
  if (!genAI) {
    console.warn("Gemini API Key missing or client not initialized.");
    // Fallback mock for demo purposes if no key provided
    return {
      action: 'unknown',
      description: 'Erro: API Key não configurada.'
    };
  }

  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    You are a financial assistant for an app called "THE BOX".
    Analyze the following user voice command and extract transaction details.
    
    User Command: "${transcript}"
    
    Available Categories: ${availableCategories.join(', ')}.
    If the user mentions a category not in the list, map it to "Outros" or the closest match.
    
    Current Date: ${new Date().toISOString().split('T')[0]} (YYYY-MM-DD).
    
    Return a JSON object.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING, enum: ["add_tx", "unknown"] },
            type: { type: Type.STRING, enum: ["income", "expense"] },
            description: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            date: { type: Type.STRING }
          },
          required: ["action"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIParsedAction;
    }
    
    return { action: 'unknown' };

  } catch (error) {
    console.error("AI Processing Error:", error);
    return { action: 'unknown' };
  }
};