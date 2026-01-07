import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}" // <--- Ensure Lib is included for mock data styles
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--bg-main)",
                card: "var(--bg-card)",
                primary: "var(--text-main)",
            },
        },
    },
    plugins: [],
};
export default config;