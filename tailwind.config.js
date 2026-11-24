import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Tajawal', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                sakina: {
                    50: '#F2F7F5',
                    100: '#E2EFEA',
                    200: '#C5DFD5',
                    300: '#9CC7B8',
                    400: '#6FA996',
                    500: '#2A9D8F',
                    600: '#1D6F63',
                    700: '#1B4D3E',
                    800: '#153D31',
                    900: '#0E2B22',
                },
                cream: {
                    50: '#FBF9F5',
                    100: '#F5F1EB',
                    200: '#EAE3D7',
                    300: '#DDD2C0',
                },
            },
        },
    },

    plugins: [forms],
};
