/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                rogue: "#25131A",
            },
            fontFamily: {
                "m5x7": [ "m5x7", "monospace" ],
            },
        },
    },
    plugins: [],
}
