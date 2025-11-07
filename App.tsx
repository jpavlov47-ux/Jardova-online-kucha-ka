import React, { useState, useEffect } from 'react';
import { RecipeGenerator } from './components/RecipeGenerator';
import { MyRecipes } from './components/MyRecipes';
import { WebSearch } from './components/WebSearch';
import { translations, Language } from './utils/translations';

type View = 'generate' | 'myRecipes' | 'webSearch';
type Theme = 'light' | 'dark';

// --- Icon Components for Theme & Fullscreen ---
const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
);

const EnterFullscreenIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);

const ExitFullscreenIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L3.75 3.75M3.75 3.75v4.5m0-4.5h4.5m5.25 0L20.25 3.75m0 0v4.5m0-4.5h-4.5M9 15l-5.25 5.25m0 0v-4.5m0 4.5h4.5m5.25 0l5.25 5.25m0 0v-4.5m0 4.5h-4.5" />
    </svg>
);


function App() {
  const [activeView, setActiveView] = useState<View>('generate');
  const [language, setLanguage] = useState<Language>('cz');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme') as Theme;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
  });
  
  const t = translations[language];

  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const getTabDescription = () => {
    switch (activeView) {
        case 'generate':
            return t.generateTabDescription;
        case 'myRecipes':
            return t.myRecipesTabDescription;
        case 'webSearch':
            return t.searchOnlineTabDescription;
        default:
            return '';
    }
  }

  const navButtonClasses = (view: View) => 
    `px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900 focus:ring-orange-500 ${
      activeView === view
        ? 'bg-orange-600 text-white shadow-lg'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
    }`;
  
  const langButtonClasses = (lang: Language) =>
    `px-4 py-2 text-sm rounded-md transition-colors ${
      language === lang 
        ? 'bg-orange-500 text-white' 
        : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
    }`;

  const renderActiveView = () => {
    switch (activeView) {
        case 'generate':
            return <RecipeGenerator language={language} t={t} />;
        case 'myRecipes':
            return <MyRecipes t={t} />;
        case 'webSearch':
            return <WebSearch language={language} t={t} />;
        default:
            return null;
    }
  }

  return (
    <main className="min-h-screen antialiased">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="text-center mb-10 relative">
          <div className="absolute top-0 right-0 flex gap-2 items-center">
            <button onClick={() => setLanguage('cz')} className={langButtonClasses('cz')}>CZ</button>
            <button onClick={() => setLanguage('sk')} className={langButtonClasses('sk')}>SK</button>
            <button onClick={toggleTheme} title={t.toggleTheme} className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors">
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
            <button onClick={toggleFullscreen} title={t.toggleFullscreen} className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors">
              {isFullscreen ? <ExitFullscreenIcon className="w-5 h-5" /> : <EnterFullscreenIcon className="w-5 h-5" />}
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
              {t.appName}
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {getTabDescription()}
          </p>
        </header>

        <nav className="flex justify-center flex-wrap gap-4 mb-10">
          <button onClick={() => setActiveView('generate')} className={navButtonClasses('generate')}>
            {t.generateTab}
          </button>
          <button onClick={() => setActiveView('myRecipes')} className={navButtonClasses('myRecipes')}>
            {t.myRecipesTab}
          </button>
          <button onClick={() => setActiveView('webSearch')} className={navButtonClasses('webSearch')}>
            {t.searchOnlineTab}
          </button>
        </nav>

        {renderActiveView()}

        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400">
            <p>{t.footerText}</p>
        </footer>
      </div>
    </main>
  );
}

export default App;
