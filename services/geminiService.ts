import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface Recipe {
  nazev: string;
  popis: string;
  ingredience: string[];
  postup: string[];
  kategorie: string;
  obrazek?: string;
}

const systemInstructions = {
    cz: "Jsi nápomocný šéfkuchař, který vytváří jednoduché a chutné recepty v českém jazyce. Vždy odpovídej ve formátu JSON.",
    sk: "Si nápomocný šéfkuchár, ktorý vytvára jednoduché a chutné recepty v slovenskom jazyku. Vždy odpovedaj vo formáte JSON."
};


export const generateRecipe = async (prompt: string, language: 'cz' | 'sk'): Promise<Omit<Recipe, 'kategorie' | 'obrazek'>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstructions[language],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nazev: { 
              type: Type.STRING,
              description: 'Název receptu.'
            },
            popis: { 
              type: Type.STRING,
              description: 'Krátký, lákavý popis receptu.'
            },
            ingredience: {
              type: Type.ARRAY,
              description: 'Seznam ingrediencí potřebných pro recept.',
              items: { type: Type.STRING }
            },
            postup: {
              type: Type.ARRAY,
              description: 'Kroky pro přípravu jídla, seřazené postupně.',
              items: { type: Type.STRING }
            }
          },
          required: ["nazev", "popis", "ingredience", "postup"]
        },
      },
    });

    const jsonText = response.text.trim();
    const recipeData = JSON.parse(jsonText);
    
    if (
        !recipeData.nazev || 
        !recipeData.popis || 
        !Array.isArray(recipeData.ingredience) || 
        !Array.isArray(recipeData.postup)
    ) {
        throw new Error("Odpověď z API nemá správný formát receptu.");
    }
    
    return recipeData;

  } catch (error) {
    console.error("Chyba při generování receptu:", error);
    if (error instanceof Error) {
        throw new Error(`Nepodařilo se vygenerovat recept: ${error.message}`);
    }
    throw new Error("Vyskytla se neznámá chyba při generování receptu.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("API nevrátilo žádný obrázek.");
    }
  } catch (error) {
    console.error("Chyba při generování obrázku:", error);
    if (error instanceof Error) {
        throw new Error(`Nepodařilo se vygenerovat obrázek: ${error.message}`);
    }
    throw new Error("Vyskytla se neznámá chyba při generování obrázku.");
  }
};