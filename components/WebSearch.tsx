import React, { useState } from 'react';
import { searchWebForRecipes, WebSearchResult } from '../services/geminiService';
import type { Language, translations } from '../utils/translations';

// --- Icon Components ---
const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
);
const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
);

interface WebSearchProps {
    language: Language;
    t: typeof translations[Language];
}

export const WebSearch: React.FC<WebSearchProps> = ({ language, t }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<WebSearchResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!query.trim()) {
            setError(t.promptError);
            return;
        }

        setIsLoading(true);
        setError(null);
        setResults(null);
        setSearchPerformed(true);

        try {
            const searchResults = await searchWebForRecipes(query, language);
            setResults(searchResults);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : t.searchError || 'Vyskytla se neočekávaná chyba.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white/50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl shadow-orange-900/10 dark:shadow-orange-900/20 animate-[fadeIn_0.5s_ease-in-out]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
                <label htmlFor="search-input" className="text-2xl font-bold text-gray-800 dark:text-gray-300">{t.whatToCook}</label>
                <textarea
                    id="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.searchOnlinePlaceholder}
                    className="w-full h-28 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-none"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 text-lg shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40"
                    disabled={isLoading || !query.trim()}
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner className="w-6 h-6 animate-spin" />
                            <span>{t.searching}</span>
                        </>
                    ) : (
                        <>
                            <SearchIcon className="w-6 h-6" />
                            <span>{t.searchOnlineButton}</span>
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

            {searchPerformed && !isLoading && (
                <div className="mt-8 animate-[fadeIn_0.5s_ease-in-out]">
                    {results && results.sources.length > 0 ? (
                        <div>
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">{t.searchResultsTitle}</h2>
                            {results.summary && <p className="text-gray-600 dark:text-gray-300 mb-6 italic break-words">{results.summary}</p>}
                            <div className="space-y-4">
                                {results.sources.map((source, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500/50 transition-colors">
                                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="group block">
                                            <h3 className="text-lg font-semibold text-orange-500 dark:text-orange-400 group-hover:underline">{source.title}</h3>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                                <LinkIcon className="w-4 h-4" />
                                                <span className="truncate">{source.uri}</span>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        !error && <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t.noResultsFound}</p>
                    )}
                </div>
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