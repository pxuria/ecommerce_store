import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				black: 'var(--black)',
				white: 'var(--white)',
				primary: {
					900: 'var(--primary-900)',
					800: 'var(--primary-800)',
					700: 'var(--primary-700)',
					600: 'var(--primary-600)',
					500: 'var(--primary-500)',
					400: 'var(--primary-400)',
					300: 'var(--primary-300)',
					200: 'var(--primary-200)',
					100: 'var(--primary-100)',
					50: 'var(--primary-50)',
				},
				secondary: {
					900: 'var(--secondary-900)',
					800: 'var(--secondary-800)',
					700: 'var(--secondary-700)',
					600: 'var(--secondary-600)',
					500: 'var(--secondary-500)',
					400: 'var(--secondary-400)',
					300: 'var(--secondary-300)',
					200: 'var(--secondary-200)',
					100: 'var(--secondary-100)',
					50: 'var(--secondary-50)',
				},

				pink: 'var(--pink)',
				pink_900: 'var(--pink-900)',
				pink_800: 'var(--pink-800)',
				pink_700: 'var(--pink-700)',
				pink_600: 'var(--pink-600)',
				pink_500: 'var(--pink-500)',
				pink_400: 'var(--pink-400)',
				pink_300: 'var(--pink-300)',
				purple_900: 'var(--purple-900)',
				purple_800: 'var(--purple-800)',
				purple_700: 'var(--purple-700)',
				purple_600: 'var(--purple-600)',
				purple_500: 'var(--purple-500)',
				purple_400: 'var(--purple-400)',
				purple_300: 'var(--purple-300)',
				yellow_900: 'var(--yellow-900)',
				yellow_800: 'var(--yellow-800)',
				yellow_700: 'var(--yellow-700)',
				yellow_600: 'var(--yellow-600)',
				yellow_500: 'var(--yellow-500)',
				yellow_400: 'var(--yellow-400)',
				yellow_300: 'var(--yellow-300)',
				gray: 'var(--gray)',
				muted: 'var(--muted)',
				light_muted: 'var(--light-muted)',
				light_pink: 'var(--light-pink)',
				yellow: 'var(--yellow)',
				light_yellow: 'var(--light-yellow)',
				light_purple: 'var(--light-purple)',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			boxShadow: {
				custom: '-20px -20px var(--tw-shadow-color)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [tailwindcssAnimate],
};
export default config;
