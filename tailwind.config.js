/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./app.js",
        "./components/**/*.js",
        "./utils/**/*.js",
        "./state/**/*.js",
        // Add any other paths where you use Tailwind classes
    ],
    theme: {
        extend: {
            // Your custom theme extensions
        },
    },
    plugins: [],
}
