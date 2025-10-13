'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// 1. 定義 Context 的值型別
interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

// 2. 使用泛型參數明確指定 Context 的型別，並給予 null 預設值
const ThemeContext = createContext<ThemeContextType | null>(null);

// 3. 定義 Provider props 的型別，包含 children
interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const value = { theme, toggleTheme };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// 4. 在 Hook 中處理 null
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === null) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}