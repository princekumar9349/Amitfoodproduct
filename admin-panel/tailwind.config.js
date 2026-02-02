/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#3b82f6', // blue-500 (Admin theme logic)
                    hover: '#2563eb',   // blue-600
                },
                secondary: {
                    DEFAULT: '#64748b', // slate-500
                },
                background: '#f8fafc', // slate-50
            },
        },
    },
    plugins: [],
}
