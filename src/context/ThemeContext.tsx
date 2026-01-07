'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
    mode: ThemeMode;
    toggleMode: () => void;
    brandColor: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>('dark');
    const [brandColor] = useState<string>('#10B981'); // Emerald default

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mode);

        // Dynamic CSS Variable Injection for High Performance
        const colors = mode === 'dark'
            ? { '--bg-main': '#050505', '--bg-card': '#0A0A0A', '--text-main': '#FFFFFF', '--border-color': 'rgba(255,255,255,0.1)' }
            : { '--bg-main': '#F3F4F6', '--bg-card': '#FFFFFF', '--text-main': '#111827', '--border-color': 'rgba(0,0,0,0.1)' };

        Object.entries(colors).forEach(([key, value]) => root.style.setProperty(key, value));
        root.style.setProperty('--brand-color', brandColor);
    }, [mode, brandColor]);

    const toggleMode = () => setMode((p) => (p === 'dark' ? 'light' : 'dark'));

    return (
        <ThemeContext.Provider value={{ mode, toggleMode, brandColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};