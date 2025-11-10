
import { GoogleGenAI, Type } from "@google/genai";
import { Caption } from '../types';

export const generateCaptionsFromDescription = async (description: string): Promise<Caption[]> => {
  try {
    // FIX: Initialized GoogleGenAI with the API key directly from process.env.API_KEY, and removed the unnecessary helper function, to adhere to coding guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = "You are an expert scriptwriter specializing in creating short, engaging video scripts in Roman Urdu. Your task is to generate a plausible, timestamped script based on a user's video description. The script should be creative yet strictly adhere to the provided context.";
    
    const prompt = `Video Description: "${description}". Generate a complete, sequential, and timestamped script in Roman Urdu based *only* on this description. The output must be a JSON array of caption objects. Each caption object must have overall "start" and "end" times, and a "words" array. Each element in the "words" array must be an object with its own "text", "start", and "end" time, representing a single word. Word timings must be sequential and fall within the parent caption's time range. Keep caption phrases to a maximum of 10 words. Example format: [{"start": 0.5, "end": 3.0, "words": [{"text": "Assalam", "start": 0.5, "end": 1.1}, {"text": "o", "start": 1.1, "end": 1.3}, {"text": "Alaikum,", "start": 1.3, "end": 2.0}] }]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              start: {
                type: Type.NUMBER,
                description: 'The start time of the entire caption phrase in seconds.'
              },
              end: {
                type: Type.NUMBER,
                description: 'The end time of the entire caption phrase in seconds.'
              },
              words: {
                type: Type.ARRAY,
                description: 'An array of word objects with individual timings.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: {
                      type: Type.STRING,
                      description: 'A single word of the caption text in Roman Urdu.'
                    },
                    start: {
                      type: Type.NUMBER,
                      description: 'The start time of the word in seconds.'
                    },
                    end: {
                      type: Type.NUMBER,
                      description: 'The end time of the word in seconds.'
                    }
                  },
                  required: ["text", "start", "end"]
                }
              }
            },
            required: ["start", "end", "words"]
          }
        },
      }
    });

    const jsonString = response.text;
    const captions: Caption[] = JSON.parse(jsonString);
    
    // Validate the structure
    if (!Array.isArray(captions) || captions.some(c => 
        typeof c.start !== 'number' || 
        typeof c.end !== 'number' || 
        !Array.isArray(c.words) ||
        c.words.some(w => typeof w.text !== 'string' || typeof w.start !== 'number' || typeof w.end !== 'number')
    )) {
        throw new Error("Invalid caption format received from API.");
    }
    
    return captions;
  } catch (error) {
    console.error("Error generating captions:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate captions: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating captions.");
  }
};
