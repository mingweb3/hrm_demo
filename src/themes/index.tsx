/* eslint-disable import/no-mutable-exports */
import React, { useMemo } from 'react'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import { breakpoints } from './breakpoints'
// Customs
import { darkColors, lightColors } from './colors'
import { customShadows } from './shadows'
import { HRMThemeMode } from './types'
import { typography } from './typography'

interface HRMThemeProps {
  children: React.ReactNode
  mode: HRMThemeMode
}

export const HRMTheme: React.FC<HRMThemeProps> = ({ children, mode = 'light' }) => {
  const themeTypography = typography(`'Heebo', sans-serif`)
  const themeCustomShadows = customShadows()

  const themeOptions = useMemo(() => {
    const paletteColors = mode === 'light' ? lightColors : darkColors
    return {
      breakpoints: {
        keys: ['sm', 'md', 'lg', 'xl', 'xxl'],
        values: { ...breakpoints }
      },
      direction: 'ltr',
      palette: {
        mode,
        ...paletteColors
      },
      customShadows: themeCustomShadows,
      typography: themeTypography
    }
  }, [themeTypography, themeCustomShadows, mode])

  const theme = createTheme(themeOptions as unknown as ThemeOptions)

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
