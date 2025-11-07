import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface Recipe {
  nazev: string;
  popis: string;
  ingredience: string[];
  postup: string[];
  kategorie: string;
  obrazek?: string;
  sourceUrl?: string;
}

export interface WebSearchResult {
    summary: string;
    sources: Array<{
        title: string;
        uri: string;
    }>;
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
        aspectRatio: '4:3',
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


export const searchWebForRecipes = async (query: string, language: 'cz' | 'sk'): Promise<WebSearchResult> => {
    try {
        const fullPrompt = language === 'cz' 
            ? `Prohledej populární české weby s recepty a najdi recepty pro '${query}'. Vytvoř krátké, zajímavé shrnutí o nalezených receptech. Můžeš zmínit zajímavosti, varianty nebo tipy k servírování. Do tohoto shrnutí NEVKLÁDEJ žádné odkazy.`
            : `Prehľadaj populárne slovenské weby s receptami a nájdi recepty pre '${query}'. Vytvor krátke, zaujímavé zhrnutie o nájdených receptoch. Môžeš spomenúť zaujímavosti, varianty alebo tipy na servírovanie. Do tohto zhrnutia NEVKLADAJ žiadne odkazy.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const summary = response.text.trim();
        const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        
        const sourceMap = new Map<string, { title: string; uri: string }>();
        rawSources.forEach(chunk => {
            if (chunk.web) {
                const { title, uri } = chunk.web;
                if (title && uri && !sourceMap.has(uri)) {
                    sourceMap.set(uri, { title, uri });
                }
            }
        });
        
        const uniqueSources = Array.from(sourceMap.values());

        return {
            summary,
            sources: uniqueSources,
        };

    } catch (error) {
        console.error("Chyba při vyhledávání receptů na webu:", error);
        if (error instanceof Error) {
            throw new Error(`Nepodařilo se vyhledat recepty: ${error.message}`);
        }
        throw new Error("Vyskytla se neznámá chyba při vyhledávání receptů.");
    }
};
