"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ConfigContextType {
    schoolName: string;
    themeColor: string;
    setThemeColor: (color: string) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [themeColor, setThemeColor] = useState("16 185 129"); // Default Emerald
    const schoolName = "NexaGrid";

    useEffect(() => {
        document.documentElement.style.setProperty("--primary-rgb", themeColor);
    }, [themeColor]);

    return (
        <ConfigContext.Provider value={{ schoolName, themeColor, setThemeColor }}>
            {children}
        </ConfigContext.Provider>
    );
}

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) throw new Error("useConfig must be used within a ConfigProvider");
    return context;
};