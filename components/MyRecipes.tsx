import React, { useState, useEffect, useMemo } from 'react';
import type { Recipe } from '../services/geminiService';
import { initialRecipes } from '../data/initialRecipes';
import type { Language, translations } from '../utils/translations';

const STORAGE_KEY = 'my-recipes';

// --- Icon Components ---
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
    </svg>
);
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.006a.75.75 0 01-.749.654h-12.5a.75.75 0 01-.75-.654L3.102 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.347-9zm5.48.058a.75.75 0 10-1.499-.058l-.347 9a.75.75 0 001.5.058l.347-9z" clipRule="evenodd" />
    </svg>
);
const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
    </svg>
);

interface MyRecipesProps {
    t: typeof translations[Language];
}

const newRecipeInitialState = { nazev: '', popis: '', ingredience: '', postup: '', kategorie: '', obrazek: '' };

// --- Main Component ---
export const MyRecipes: React.FC<MyRecipesProps> = ({ t }) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showForm, setShowForm] = useState(false);
    const [newRecipe, setNewRecipe] = useState(newRecipeInitialState);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    useEffect(() => {
        try {
            const storedRecipes = localStorage.getItem(STORAGE_KEY);
            const loadedRecipes = storedRecipes ? JSON.parse(storedRecipes) : initialRecipes;
             const sanitizedRecipes = loadedRecipes.map((r: any) => ({
                nazev: r.nazev || '',
                popis: r.popis || '',
                ingredience: r.ingredience || [],
                postup: r.postup || [],
                kategorie: r.kategorie || t.categories.ostatni,
                obrazek: r.obrazek || ''
            }));
            setRecipes(sanitizedRecipes);
        } catch (error) {
            console.error("Chyba při načítání receptů z localStorage:", error);
            setRecipes(initialRecipes);
        }
    }, [t.categories.ostatni]);

    const filteredRecipes = useMemo(() =>
        recipes.filter(recipe => {
            const matchesCategory = selectedCategory === 'all' || recipe.kategorie === selectedCategory;
            const matchesSearch =
                recipe.nazev.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.popis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (recipe.ingredience && recipe.ingredience.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase())));
            return matchesCategory && matchesSearch;
        }), [recipes, searchTerm, selectedCategory]);

    const handleSaveRecipe = (e: React.FormEvent) => {
        e.preventDefault();
        const newRecipeData: Recipe = {
            nazev: newRecipe.nazev,
            popis: newRecipe.popis,
            kategorie: newRecipe.kategorie || t.categories.ostatni,
            ingredience: newRecipe.ingredience.split('\n').filter(line => line.trim() !== ''),
            postup: newRecipe.postup.split('\n').filter(line => line.trim() !== ''),
            obrazek: newRecipe.obrazek
        };

        let updatedRecipes;
        if (editingIndex !== null) {
            updatedRecipes = [...recipes];
            updatedRecipes[editingIndex] = newRecipeData;
        } else {
            updatedRecipes = [...recipes, newRecipeData];
        }

        setRecipes(updatedRecipes);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
        setNewRecipe(newRecipeInitialState);
        setShowForm(false);
        setEditingIndex(null);
    };
    
    const handleDeleteRecipe = (indexToDelete: number) => {
        const recipeToDelete = filteredRecipes[indexToDelete];
        const updatedRecipes = recipes.filter(r => r !== recipeToDelete);
        setRecipes(updatedRecipes);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
    };

    const handleEditClick = (index: number) => {
        const recipeToEdit = filteredRecipes[index];
        const originalIndex = recipes.findIndex(r => r === recipeToEdit);

        // FIX: Ensure 'obrazek' is a string to match the state type.
        // The `recipeToEdit` object comes from the `Recipe` type where `obrazek` is optional,
        // but the `newRecipe` state requires it to be a string.
        setNewRecipe({
            ...recipeToEdit,
            ingredience: Array.isArray(recipeToEdit.ingredience) ? recipeToEdit.ingredience.join('\n') : '',
            postup: Array.isArray(recipeToEdit.postup) ? recipeToEdit.postup.join('\n') : '',
            obrazek: recipeToEdit.obrazek || '',
        });
        setEditingIndex(originalIndex);
        setShowForm(true);
    };

    const handleCancelEdit = () => {
        setShowForm(false);
        setNewRecipe(newRecipeInitialState);
        setEditingIndex(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewRecipe({ ...newRecipe, obrazek: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleForm = () => {
        if (showForm) {
            handleCancelEdit();
        } else {
            setShowForm(true);
        }
    };

    const categoryButtonClasses = (category: string) => 
        `px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 ${
        selectedCategory === category
            ? 'bg-orange-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`;

    return (
        <div className="max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-in-out]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full md:w-2/3">
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button
                    onClick={toggleForm}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
                >
                    <PlusIcon className="w-6 h-6" />
                    <span>{showForm ? t.closeForm : t.addRecipe}</span>
                </button>
            </div>

            <div className="flex items-center gap-2 mb-8 pb-2 overflow-x-auto">
                 <button onClick={() => setSelectedCategory('all')} className={categoryButtonClasses('all')}>
                    {t.allCategories}
                </button>
                {Object.values(t.categories).map(category => (
                    <button key={category} onClick={() => setSelectedCategory(category)} className={categoryButtonClasses(category)}>
                        {category}
                    </button>
                ))}
            </div>

            {showForm && (
                <div className="p-6 mb-8 bg-gray-800 rounded-xl border border-gray-700 animate-[fadeIn_0.5s_ease-in-out]">
                    <form onSubmit={handleSaveRecipe} className="space-y-4">
                        <h3 className="text-2xl font-bold text-orange-400">{editingIndex !== null ? t.editRecipe : t.newRecipe}</h3>
                        <input type="text" placeholder={t.recipeNamePlaceholder} value={newRecipe.nazev} onChange={e => setNewRecipe({ ...newRecipe, nazev: e.target.value })} required className="w-full p-2 bg-gray-700 rounded border border-gray-600"/>
                        <input type="text" placeholder={t.descriptionPlaceholder} value={newRecipe.popis} onChange={e => setNewRecipe({ ...newRecipe, popis: e.target.value })} required className="w-full p-2 bg-gray-700 rounded border border-gray-600"/>
                        <select value={newRecipe.kategorie} onChange={e => setNewRecipe({ ...newRecipe, kategorie: e.target.value })} required className="w-full p-2 bg-gray-700 rounded border border-gray-600">
                            <option value="" disabled>{t.categorySelect}</option>
                            {Object.values(t.categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">{t.imageLabel}</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700"
                            />
                        </div>
                        {newRecipe.obrazek && (
                            <div>
                                <p className="text-sm text-gray-400 mb-2">{t.imagePreview}</p>
                                <img src={newRecipe.obrazek} alt="Náhled" className="max-h-40 w-full object-cover rounded-lg" />
                            </div>
                        )}
                        <textarea placeholder={t.ingredientsPlaceholder} value={newRecipe.ingredience} onChange={e => setNewRecipe({ ...newRecipe, ingredience: e.target.value })} required rows={5} className="w-full p-2 bg-gray-700 rounded border border-gray-600 resize-y"></textarea>
                        <textarea placeholder={t.procedurePlaceholder} value={newRecipe.postup} onChange={e => setNewRecipe({ ...newRecipe, postup: e.target.value })} required rows={8} className="w-full p-2 bg-gray-700 rounded border border-gray-600 resize-y"></textarea>
                        <div className="flex gap-4">
                            <button type="button" onClick={handleCancelEdit} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">{t.cancel}</button>
                            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                                {editingIndex !== null ? t.saveChanges : t.saveRecipe}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.length > 0 ? filteredRecipes.map((recipe, index) => (
                    <article key={index} className="flex flex-col bg-gray-800/50 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden">
                         {recipe.obrazek && (
                            <img src={recipe.obrazek} alt={recipe.nazev} className="w-full h-40 object-cover" />
                        )}
                         <div className="p-6 flex-grow flex flex-col">
                            <div className="flex-grow">
                                <div className="flex justify-between items-start gap-2">
                                    <h2 className="text-2xl font-bold text-orange-400 mb-1 flex-1">{recipe.nazev}</h2>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button onClick={() => handleEditClick(index)} className="text-gray-500 hover:text-amber-400 transition-colors p-1 rounded-full">
                                            <EditIcon className="w-5 h-5"/>
                                        </button>
                                        <button onClick={() => handleDeleteRecipe(index)} className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2">{recipe.kategorie}</p>
                                <p className="text-gray-400 mb-4 italic text-sm">{recipe.popis}</p>

                                <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-1 mb-2">{t.ingredients}</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm mb-4">
                                    {recipe.ingredience.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>

                                <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-1 mb-2">{t.procedure}</h3>
                                <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                                    {recipe.postup.map((step, i) => <li key={i}>{step}</li>)}
                                </ol>
                            </div>
                        </div>
                    </article>
                )) : (
                     <div className="col-span-full text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
                        <p className="text-gray-400 text-xl">{t.noRecipesFound}</p>
                    </div>
                )}
            </div>
             <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .overflow-x-auto::-webkit-scrollbar {
                    height: 4px;
                }
                .overflow-x-auto::-webkit-scrollbar-thumb {
                    background-color: #4a5568;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};