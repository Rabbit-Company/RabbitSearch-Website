module.exports = {
  content: ["./website/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
		require('@tailwindcss/aspect-ratio'),
	],
}