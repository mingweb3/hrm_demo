/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: '#13294B',
      red: '#971919',
      red2: '#981515',
      green2: '#1BBA6E',
      green3: '#027C41',
      orange1: '#d7a263',
      orange2: '#D7964B',
      black444: '#444444',
      black: '#000000',
      white: '#ffffff',
      blue: '#1B76FF',
      blue2: '#1275B1',
      blue3: '#DCEBF2',
      blue4: '#005099',
      gray2: '#383838',
      gray3: '#999999',
      gray5: '#dddddd',
      gray6: '#bbbbbb',
      gray7: '#A6A6A6',
      gray8: '#E3E3E3',
      gray9: '#F5F5F5',
      bg: '#EEF4F6'
    },
    extend: {
      fontFamily: {
        heebo: ['Heebo', 'Helvetica Neue', 'sans-serif']
      },
      boxShadow: {
        card: '0px 1px 3px rgba(0, 0, 0, 0.15)'
      }
    }
  },
  plugins: []
}
