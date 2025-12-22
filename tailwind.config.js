/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}", // If you have screens folder
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      keyframes: {
        dropAndBounce: {
          '0%': { transform: 'translateY(-100vh)', opacity: '0' },
          '35%': { transform: 'translateY(0)', opacity: '1' },     // Lands
          '48%': { transform: 'translateY(-80px)' },              // Big bounce up
          '60%': { transform: 'translateY(0)' },
          '70%': { transform: 'translateY(-40px)' },              // Medium bounce
          '80%': { transform: 'translateY(0)' },
          '88%': { transform: 'translateY(-20px)' },              // Small bounce
          '94%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-30px)' },             // Ends at peak of ongoing bounce
        },
        ongoingBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-30px)' },               // Adjust height for softer/harder bounce
        },
      },
      animation: {
        'drop-and-bounce': 'dropAndBounce 2s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards, ongoingBounce 1.2s ease-in-out infinite 2s',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};