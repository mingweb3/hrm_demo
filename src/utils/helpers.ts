// Code viết ở đây sẽ không được check bởi eslint
import axios, { AxiosError } from 'axios'

export const isEmpty = (value: any): value is boolean => {
  if (value === null || value === undefined) return true
  if (typeof value === 'number') return false
  if (Array.isArray(value)) return !value.length
  if (Object.prototype.toString.call(value) === '[object Date]') return false
  if (typeof value === 'object') return Object.keys(value).length === 0
  if (Object.prototype.toString.call(value) === '[object String]') return value === ''

  return false
}

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function getFirstChar(str: string): string {
  return str.charAt(0)
}

export const dirtyValues = (dirtyFields: any, allValues: any): any => {
  // NOTE: Recursive function.

  // If *any* item in an array was modified, the entire array must be submitted, because there's no
  // way to indicate "placeholders" for unchanged elements. `dirtyFields` is `true` for leaves.
  if (dirtyFields === true || Array.isArray(dirtyFields)) {
    return allValues
  }

  // Here, we have an object.
  return Object.fromEntries(Object.keys(dirtyFields).map(key => [key, dirtyValues(dirtyFields[key], allValues[key])]))
}
