// components/ThemeToggle.tsx
"use client"

import { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Carrega o tema salvo no localStorage ao iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Alterna entre temas e salva no localStorage
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {darkMode ? (
        <SunIcon className="w-5 h-5 text-yellow-300" />
      ) : (
        <MoonIcon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
}