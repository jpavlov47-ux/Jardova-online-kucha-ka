import React, { useState } from 'react';
import { RecipeGenerator } from './components/RecipeGenerator';
import { MyRecipes } from './components/MyRecipes';
import { translations, Language } from './utils/translations';

type View = 'generate' | 'myRecipes';

function App() {
  const [activeView, setActiveView] = useState<View>('generate');
  const [language, setLanguage] = useState<Language>('cz');
  const t = translations[language];

  const navButtonClasses = (view: View) => 
    `px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 ${
      activeView === view
        ? 'bg-orange-600 text-white shadow-lg'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;
  
  const langButtonClasses = (lang: Language) =>
    `px-3 py-1 text-sm rounded-md transition-colors ${
      language === lang 
        ? 'bg-orange-500 text-white' 
        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
    }`;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 antialiased">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10 relative">
          <div className="absolute top-0 right-0 flex gap-2">
            <button onClick={() => setLanguage('cz')} className={langButtonClasses('cz')}>CZ</button>
            <button onClick={() => setLanguage('sk')} className={langButtonClasses('sk')}>SK</button>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              {t.appName}
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            {activeView === 'generate' 
              ? t.generateTabDescription
              : t.myRecipesTabDescription
            }
          </p>
        </header>

        <nav className="flex justify-center gap-4 mb-10">
          <button onClick={() => setActiveView('generate')} className={navButtonClasses('generate')}>
            {t.generateTab}
          </button>
          <button onClick={() => setActiveView('myRecipes')} className={navButtonClasses('myRecipes')}>
            {t.myRecipesTab}
          </button>
        </nav>

        {activeView === 'generate' ? <RecipeGenerator language={language} t={t} /> : <MyRecipes t={t} />}

        <footer className="text-center mt-12 text-gray-500">
            <p>{t.footerText}</p>
        </footer>
      </div>
    </main>
  );
}

export default App;