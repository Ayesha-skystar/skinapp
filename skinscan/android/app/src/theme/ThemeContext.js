// src/theme/ThemeContext.js
import React, { createContext, useState } from 'react';

const LIGHT_PURPLE = '#EED3EA';
const DARK_PURPLE = '#7F3C88';
const WHITE = '#FFFFFF';

const lightTheme = {
  colors: {
    primary: DARK_PURPLE,    // Title and menu icon
    background: LIGHT_PURPLE, // Main background
    text: DARK_PURPLE,       // Regular text
    cardBackground: WHITE,   // White containers
    cardText: DARK_PURPLE    // Purple text in containers
  }
};

const darkTheme = {
  colors: {
    primary: LIGHT_PURPLE,   // Title and menu icon
    background: DARK_PURPLE, // Main background
    text: LIGHT_PURPLE,      // Regular text
    cardBackground: WHITE,   // Still white containers
    cardText: DARK_PURPLE    // Still purple text in containers
  }
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};