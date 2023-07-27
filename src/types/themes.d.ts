import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Breakpoints {
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
  }
  interface Palette {
    transparent: string
    current: string
    common: {
      black: string
      white: string
    }
    primary: {
      light: string
      main: string
      dark: string
    }
    red: string
    red2: string
    green2: string
    green3: string
    orange1: string
    orange2: string
    black444: string
    blueHover: string
    blue: string
    blue2: string
    blue3: string
    blue4: string
    gray2: string
    gray3: string
    gray5: string
    gray6: string
    gray7: string
    gray8: string
    gray9: string
    bg: string
  }
}
