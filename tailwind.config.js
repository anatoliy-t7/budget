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
			gray: colors.zinc,
			red: colors.red,
			sky: colors.sky,
			cyan: colors.cyan,
			brand: '#FAF7F0',
			green: {
				50: '#ecffe4',
				100: '#d3ffc4',
				200: '#abff90',
				300: '#74ff50',
				400: '#43fe1d',
				500: '#21e500',
				600: '#16b800',
				700: '#108a00',
				800: '#126d07',
				900: '#125c0b',
				950: '#023400',
			},
			amber: {
				50: '#fffdea',
				100: '#fff8c5',
				200: '#fff285',
				300: '#ffe446',
				400: '#ffd31b',
				500: '#ffb302',
				600: '#e28800',
				700: '#bb5f02',
				800: '#984908',
				900: '#7c3c0b',
				950: '#481e00',
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
