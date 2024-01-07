import colors from 'tailwindcss/colors';

module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			black: colors.black,
			white: colors.white,
			gray: colors.neutral,
			red: colors.red,
			sky: colors.sky,
			cyan: colors.cyan,
			brand: '#FAF7F0',
			green: {
				50: '#f1fce9',
				100: '#e1f8cf',
				200: '#c4f2a4',
				300: '#9fe870',
				400: '#7bd942',
				500: '#5bbf23',
				600: '#449818',
				700: '#357417',
				800: '#2e5c18',
				900: '#294e19',
				950: '#122b08',
			},
			amber: {
				50: '#fefbec',
				100: '#faf4cb',
				200: '#f5e792',
				300: '#efd55a',
				400: '#edc843',
				500: '#e4a61c',
				600: '#ca8115',
				700: '#a85e15',
				800: '#884918',
				900: '#703c17',
				950: '#401e08',
			},
		},
		extend: {
			boxShadow: {
				small: '0 4px 8px -2px rgba(16, 24, 40, .1), 0 2px 4px -2px rgba(16, 24, 40, .06);',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
