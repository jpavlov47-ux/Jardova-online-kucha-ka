import React, { useState } from 'react';
import { generateRecipe, Recipe } from '../services/geminiService';

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

// --- Main Exported Component ---
export const RecipeGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!prompt.trim()) {
            setError('Prosím, zadejte co byste chtěli uvařit.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setRecipe(null);
        
        try {
            // FIX: The `generateRecipe` function requires a language argument. Added 'cz' as a default.
            const newRecipe = await generateRecipe(prompt, 'cz');
            // FIX: Add a default category to the generated recipe to match the 'Recipe' type. This resolves a type error where the 'kategorie' property was missing.
            setRecipe({ ...newRecipe, kategorie: 'Ostatní', obrazek: '' });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Vyskytla se neočekávaná chyba.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto bg-black/20 rounded-2xl border border-gray-700 shadow-2xl shadow-orange-900/20 animate-[fadeIn_0.5s_ease-in-out]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
                <label htmlFor="prompt-input" className="text-2xl font-bold text-gray-300">Co budeme vařit?</label>
                <textarea
                    id="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="např. rychlá večeře s kuřecím masem a brokolicí..."
                    className="w-full h-28 p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-none"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40"
                    disabled={isLoading || !prompt.trim()}
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner className="w-6 h-6 animate-spin" />
                            <span>Vařím recept...</span>
                        </>
                    ) : (
                        <>
                            <ChefHatIcon className="w-6 h-6" />
                            <span>Vygenerovat recept</span>
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg text-center">
                    <p className="font-semibold">Chyba</p>
                    <p>{error}</p>
                </div>
            )}

            {recipe && (
                 <article className="mt-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700 animate-[fadeIn_0.5s_ease-in-out]">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 mb-4">{recipe.nazev}</h2>
                    <p className="text-gray-300 mb-6 italic">{recipe.popis}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <h3 className="text-xl font-semibold text-gray-200 border-b-2 border-orange-500/50 pb-2 mb-3">Ingredience</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-300 pl-2">
                                {recipe.ingredience.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>
                        <div className="md:col-span-2">
                             <h3 className="text-xl font-semibold text-gray-200 border-b-2 border-orange-500/50 pb-2 mb-3">Postup</h3>
                             <ol className="list-decimal list-inside space-y-3 text-gray-300 pl-2">
                                {recipe.postup.map((step, index) => <li key={index}>{step}</li>)}
                            </ol>
                        </div>
                    </div>
                 </article>
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