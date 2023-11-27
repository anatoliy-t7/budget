
/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: [ "class" ],
	content: [ "./src/**/*.{html,js,svelte,ts}" ],
	plugins: [
		require( '@tailwindcss/typography' ),
		require( '@tailwindcss/forms' ),
	],
};

export default config;
