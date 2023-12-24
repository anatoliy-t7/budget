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
			gray: colors.zinc,
			red: colors.red,
			'green': {
				 '50': '#ecffe4',
				'100': '#d3ffc4',
				'200': '#abff90',
				'300': '#74ff50',
				'400': '#43fe1d',
				'500': '#21e500',
				'600': '#16b800',
				'700': '#108a00',
				'800': '#126d07',
				'900': '#125c0b',
				'950': '#023400',
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
		require("daisyui")
	],
	daisyui: {
		themes: [
			{
				brand: {
					"primary": "#108a00",
					"secondary": "#ffb302",
					"accent": "#37cdbe",
					"neutral": "#3d4451",
					"base-100": "#ffffff",
				},
			},
			"dark",
			"cupcake",
		],
		darkTheme: "dark", // name of one of the included themes for dark mode
		base: true, // applies background color and foreground color for root element by default
		styled: true, // include daisyUI colors and design decisions for all components
		utils: true, // adds responsive and modifier utility classes
		prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
		logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
		themeRoot: ":root", // The element that receives theme color CSS variables
  },
};
