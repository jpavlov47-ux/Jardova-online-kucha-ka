import React, { useState } from 'react';
import { generateRecipe, generateImage, Recipe } from '../services/geminiService';
import type { Language, translations } from '../utils/translations';

// --- Icon Components ---
const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ChefHatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
       <path d="M12.01,2C8.69,2,6,4.69,6,8c0,2.08,1.13,3.9,2.83,4.93C8.82,12.98,8.8,13.01,8.8,13.01V18c0,1.1,0.9,2,2,2h2.4c1.1,0,2-0.9,2-2v-4.99c0,0,0-0.01-0.03-0.06C16.88,11.9,18.01,10.08,18.01,8C18.01,4.69,15.32,2,12.01,2z M8,8c0-2.21,1.79-4,4-4s4,1.79,4,4s-1.79,4-4,4S8,10.21,8,8z M3,10c0-0.55,0.45-1,1-1h1c0.55,0,1,0.45,1,1v1H3V10z M18,10c0-0.55,0.45-1,1-1h1c0.55,0,1,0.45,1,1v1h-3V10z M3,13h5v5c0,1.1,0.9,2,2,2h0.2c-1.28-0.55-2.2-1.79-2.2-3.2V13z M19,13h-5v3.8c0,1.41-0.92,2.65-2.2,3.2H14c1.1,0,2-0.9,2-2V13z"></path>
    </svg>
);

const BookmarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.59 3H6C4.9 3 4 3.9 4 5v16l8-3.56L20 21V5c0-1.1-.9-2-2-2zm0 2v11.52l-5.59-2.45L6.41 16.52V5h11.18z"/>
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

const PrintIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.25c0 1.036.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875v-2.25C18 2.339 17.16 1.5 16.125 1.5h-8.25zM16.5 6H7.5v-2.25c0-.414.336-.75.75-.75h8.25c.414 0 .75.336.75.75V6z"/>
        <path d="M18 8.25a.75.75 0 00-1.5 0v3.75a.75.75 0 01-1.5 0v-2.25a.75.75 0 00-1.5 0v2.25a.75.75 0 01-1.5 0V9.75a.75.75 0 00-1.5 0v2.25a.75.75 0 01-1.5 0v-3a.75.75 0 00-1.5 0v3a.75.75 0 01-1.5 0V8.25a.75.75 0 00-1.5 0v5.625c0 1.035.84 1.875 1.875 1.875h10.125c1.036 0 1.875-.84 1.875-1.875V8.25z"/>
    </svg>
);

interface RecipeGeneratorProps {
    language: Language;
    t: typeof translations[Language];
}

// --- Main Exported Component ---
export const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ language, t }) => {
    const [prompt, setPrompt] = useState<string>('');
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
    const [isRecipeSaved, setIsRecipeSaved] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!prompt.trim()) {
            setError(t.promptError);
            return;
        }

        setIsLoading(true);
        setIsImageLoading(false);
        setIsRecipeSaved(false);
        setError(null);
        setRecipe(null);
        
        try {
            const newRecipeData = await generateRecipe(prompt, language);
            const recipeWithDefaults: Recipe = { ...newRecipeData, kategorie: t.categories.ostatni, obrazek: '' };
            setRecipe(recipeWithDefaults);
            setIsLoading(false);

            setIsImageLoading(true);
            try {
                const imagePrompt = `Professional food photography of "${recipeWithDefaults.nazev}". Delicious and appealing, cinematic lighting, high detail, served on a beautiful plate.`;
                const generatedImage = await generateImage(imagePrompt);
                setRecipe(prev => prev ? { ...prev, obrazek: generatedImage } : null);
            } catch (imageError) {
                console.error("Chyba při generování obrázku:", imageError);
            } finally {
                setIsImageLoading(false);
            }
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Vyskytla se neočekávaná chyba.';
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    const handleSaveRecipe = () => {
        if (!recipe) return;

        try {
            const STORAGE_KEY = 'my-recipes';
            const storedRecipesRaw = localStorage.getItem(STORAGE_KEY);
            const storedRecipes = storedRecipesRaw ? JSON.parse(storedRecipesRaw) : [];
            
            const updatedRecipes = [...storedRecipes, recipe];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
            setIsRecipeSaved(true);
        } catch (err) {
            console.error("Chyba při ukládání receptu:", err);
            const errorMessage = err instanceof Error ? err.message : (t.saveError || 'Neznámá chyba při ukládání.');
            setError(errorMessage);
        }
    };

    const handlePrint = () => {
        const printableArea = document.getElementById('generated-recipe-article');
        if (!printableArea) return;

        document.body.classList.add('is-printing');
        printableArea.classList.add('print-this-recipe');

        const onAfterPrint = () => {
            document.body.classList.remove('is-printing');
            printableArea.classList.remove('print-this-recipe');
            window.removeEventListener('afterprint', onAfterPrint);
        };

        window.addEventListener('afterprint', onAfterPrint);
        window.print();
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white/50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl shadow-orange-900/10 dark:shadow-orange-900/20 animate-[fadeIn_0.5s_ease-in-out]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
                <label htmlFor="prompt-input" className="text-2xl font-bold text-gray-800 dark:text-gray-300">{t.whatToCook}</label>
                <textarea
                    id="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t.promptPlaceholder}
                    className="w-full h-28 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-none"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40"
                    disabled={isLoading || !prompt.trim()}
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner className="w-6 h-6 animate-spin" />
                            <span>{t.cookingRecipe}</span>
                        </>
                    ) : (
                        <>
                            <ChefHatIcon className="w-6 h-6" />
                            <span>{t.generateButton}</span>
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 p-3 rounded-lg text-center">
                    <p className="font-semibold">{t.errorTitle}</p>
                    <p>{error}</p>
                </div>
            )}

            {recipe && (
                 <>
                 <article id="generated-recipe-article" className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 animate-[fadeIn_0.5s_ease-in-out]">
                    <div className="mb-6 aspect-[4/3] w-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300 dark:border-gray-600">
                        {isImageLoading ? (
                            <div className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300 no-print">
                                <LoadingSpinner className="w-12 h-12 animate-spin" />
                                <p className="mt-2 font-semibold">{t.generatingImage}</p>
                            </div>
                        ) : recipe.obrazek ? (
                            <img src={recipe.obrazek} alt={recipe.nazev} className="w-full h-full object-cover animate-[fadeIn_0.5s]" />
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-500 no-print">
                                <ChefHatIcon className="w-16 h-16 mx-auto" />
                                <p>{t.imageNotAvailable}</p>
                            </div>
                        )}
                    </div>

                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">{recipe.nazev}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 italic">{recipe.popis}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b-2 border-orange-500/30 dark:border-orange-500/50 pb-2 mb-3">{t.ingredients}</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 pl-2">
                                {recipe.ingredience.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>
                        <div className="md:col-span-2">
                             <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b-2 border-orange-500/30 dark:border-orange-500/50 pb-2 mb-3">{t.procedure}</h3>
                             <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300 pl-2">
                                {recipe.postup.map((step, index) => <li key={index}>{step}</li>)}
                            </ol>
                        </div>
                    </div>
                 </article>
                 <div className="mt-6 flex justify-center gap-4 no-print">
                    <button
                        onClick={handleSaveRecipe}
                        disabled={isRecipeSaved}
                        className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 disabled:cursor-not-allowed
                                   bg-green-600 hover:bg-green-700 text-white disabled:bg-green-500/80 dark:disabled:bg-green-800/70 disabled:text-gray-100 dark:disabled:text-gray-300"
                    >
                        {isRecipeSaved ? (
                            <>
                                <CheckIcon className="w-6 h-6" />
                                <span>{t.recipeSaved}</span>
                            </>
                        ) : (
                            <>
                                <BookmarkIcon className="w-6 h-6" />
                                <span>{t.saveToMyRecipes}</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handlePrint}
                        className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 bg-sky-600 hover:bg-sky-700 text-white"
                        title={t.printRecipe}
                    >
                        <PrintIcon className="w-6 h-6" />
                        <span>{t.printRecipe}</span>
                    </button>
                 </div>
                 </>
            )}

             <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};