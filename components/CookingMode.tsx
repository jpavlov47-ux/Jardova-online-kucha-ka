import React, { useState, useEffect, useRef } from 'react';
import type { Recipe } from '../services/geminiService';
import type { Language, translations } from '../utils/translations';

// --- Icon Components ---
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);
const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);
const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);
const ListBulletIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);


interface CookingModeProps {
    recipe: Recipe;
    onClose: () => void;
    t: typeof translations[Language];
}

export const CookingMode: React.FC<CookingModeProps> = ({ recipe, onClose, t }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showIngredients, setShowIngredients] = useState(false);
    const wakeLock = useRef<WakeLockSentinel | null>(null);

    useEffect(() => {
        const requestWakeLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                    wakeLock.current = await navigator.wakeLock.request('screen');
                    console.log('Screen Wake Lock is active.');
                } catch (err) {
                    const error = err as Error;
                    console.error(`${error.name}, ${error.message}`);
                }
            }
        };

        requestWakeLock();

        return () => {
            if (wakeLock.current) {
                wakeLock.current.release().then(() => {
                    wakeLock.current = null;
                    console.log('Screen Wake Lock released.');
                });
            }
        };
    }, []);
    
    const handleNext = () => {
        setCurrentStep(prev => Math.min(prev + 1, recipe.postup.length - 1));
    };

    const handlePrev = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === recipe.postup.length - 1;
    
    return (
        <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 flex flex-col p-4 md:p-8 text-gray-900 dark:text-gray-100 animate-[fadeIn_0.3s_ease-in-out]">
            {/* Header */}
            <header className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-xl md:text-2xl font-bold text-orange-500 dark:text-orange-400 truncate pr-4">{recipe.nazev}</h2>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 hover:bg-red-500 dark:hover:bg-red-600 p-3 rounded-full transition-colors"
                    aria-label={t.endCooking}
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 md:gap-8 min-h-0">
                {/* Left Column: Ingredients (Desktop only) */}
                <aside className="hidden md:flex flex-col bg-white/80 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700 min-h-0">
                    <h3 className="text-2xl font-bold text-orange-500 dark:text-orange-400 mb-4 flex-shrink-0">{t.ingredients}</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 overflow-y-auto">
                        {recipe.ingredience.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </aside>

                {/* Right Column: Step and Navigation */}
                <div className="md:col-span-2 flex flex-col min-h-0">
                    <main className="flex-grow flex flex-col justify-center items-center text-center p-4 overflow-y-auto">
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">{t.step} {currentStep + 1} / {recipe.postup.length}</p>
                        <p className="text-3xl md:text-5xl font-semibold max-w-4xl leading-tight">
                            {recipe.postup[currentStep]}
                        </p>
                    </main>
                    
                    {/* Footer / Controls */}
                    <footer className="flex justify-between md:justify-end items-center gap-4 mt-auto pt-4 flex-shrink-0">
                        <button
                            onClick={() => setShowIngredients(true)}
                            className="flex md:hidden items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-current font-bold py-3 px-6 rounded-full transition-colors text-lg"
                        >
                            <ListBulletIcon className="w-6 h-6" />
                            <span className="hidden sm:inline">{t.ingredients}</span>
                        </button>
                        <div className="flex gap-4">
                            <button
                                onClick={handlePrev}
                                disabled={isFirstStep}
                                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-4 rounded-full transition-colors shadow-lg"
                                aria-label={t.prevStep}
                            >
                                <ChevronLeftIcon className="w-8 h-8" />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={isLastStep}
                                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-4 rounded-full transition-colors shadow-lg"
                                aria-label={t.nextStep}
                            >
                                <ChevronRightIcon className="w-8 h-8" />
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
            
            {/* Ingredients Overlay (Mobile only) */}
            {showIngredients && (
                 <div className="md:hidden absolute inset-0 bg-black/80 flex items-center justify-center p-4 animate-[fadeIn_0.3s]" onClick={() => setShowIngredients(false)}>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-orange-500 dark:text-orange-400 mb-4">{t.ingredients}</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                           {recipe.ingredience.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                 </div>
            )}

             <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                aside ul::-webkit-scrollbar {
                    width: 6px;
                }
                aside ul::-webkit-scrollbar-thumb {
                    background-color: #9ca3af; /* gray-400 */
                }
                .dark aside ul::-webkit-scrollbar-thumb {
                    background-color: #4b5563; /* gray-600 */
                }
            `}</style>
        </div>
    );
};