import React, { useState, useEffect, createContext } from "react";
import OfficerLogin from "./pages/(auth)/Login";

export const DarkModeContext = createContext();

function App() {
  const [isDark, setIsDark] = useState(false);

  // Sync dark mode with system preference and localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // Toggle dark mode and persist
  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <OfficerLogin />
      </div>
    </DarkModeContext.Provider>
  );
}

export default App;