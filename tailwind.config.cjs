module.exports = {
    content: [
        './src/**/*.astro',
        './src/**/*.tsx'
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
        require("@tailwindcss/forms")({
            strategy: 'class',
        }),
    ],
};