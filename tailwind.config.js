import colors from 'tailwindcss/colors';

module.exports = {
	darkMode: "class",
	content: [ "./src/**/*.{html,js,svelte,ts}" ],
	theme: {
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			black: colors.black,
			white: colors.white,
			gray: colors.gray,
			'green': {
				'50': '#f3fde8',
				'100': '#e4fbcc',
				'200': '#c9f6a0',
				'300': '#a6ee68',
				'400': '#85e13a',
				'500': '#65c71b',
				'600': '#4c9f11',
				'700': '#3b7912',
				'800': '#326014',
				'900': '#2c5116',
				'950': '#132d06',
			},
			'amber': {
				'50': '#fffdea',
				'100': '#fff8c5',
				'200': '#fff285',
				'300': '#ffe446',
				'400': '#ffd31b',
				'500': '#ffb302',
				'600': '#e28800',
				'700': '#bb5f02',
				'800': '#984908',
				'900': '#7c3c0b',
				'950': '#481e00',
			},
		},
		extend: {
			boxShadow: {
				'small': '0 4px 8px -2px rgba(16, 24, 40, .1), 0 2px 4px -2px rgba(16, 24, 40, .06);'
			}
		}
	},
	plugins: [
		require( '@tailwindcss/typography' ),
	],
};
