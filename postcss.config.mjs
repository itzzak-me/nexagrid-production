/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <--- NOTE: This is the v4 plugin name
    // autoprefixer is not needed in v4, it's built-in
  },
};

export default config;