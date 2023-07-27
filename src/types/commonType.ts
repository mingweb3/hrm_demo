export type UnknownArrayOrObject = {
  [key: string]: unknown | Array<unknown> | UnknownArrayOrObject
}

export type SelectListType = {
  text: string
  value: string | number | boolean
}

export interface SnackbarMessage {
  message: string
  key: number
}

interface MainTextMatchedSubstrings {
  offset: number
  length: number
}

export interface StructuredFormatting {
  mainText: string
  secondaryText: string
  mainTextMatchedSubstrings?: readonly MainTextMatchedSubstrings[]
}

export interface PlaceType {
  description: string
  structuredFormatting: StructuredFormatting
}
