import { breakpoints } from './breakpoints'
import { lightColors } from './colors'

export type Colors = keyof typeof lightColors
export type Breakpoint = keyof typeof breakpoints
export type HRMThemeMode = 'light' | 'dark'
