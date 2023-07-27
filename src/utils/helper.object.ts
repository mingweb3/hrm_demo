import { IOption } from '@/app/components/Input/SelectList'
import { isEmpty } from './helpers'

export function cleanEmptyFields(input: any): any {
  const output: any = {}
  for (const [key, value] of Object.entries(input)) {
    if (!isEmpty(value)) {
      if (typeof value === 'string' && value.trim() !== '') {
        output[`${key}`] = value
      } else if (typeof value !== 'string') {
        output[`${key}`] = value
      }
    }
  }
  return output
}

export function isEmptyObject(obj: Record<string, any>): boolean {
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key) && obj[key]) {
      return false
    }
  }
  return true
}

export function mergeObjects<T>(obj1: { [key: string]: T }, obj2: { [key: string]: T }): { [key: string]: T } {
  const resultObj: { [key: string]: T } = {}
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  keys1.forEach(key => {
    if (keys2.includes(key) && obj2[key] !== '' && obj2[key] !== undefined) {
      resultObj[key] = obj2[key]
    } else if (obj1[key] !== '' && obj1[key] !== undefined) {
      resultObj[key] = obj1[key]
    }
  })

  keys2.forEach(key => {
    if (!keys1.includes(key) && obj2[key] !== '' && obj2[key] !== undefined) {
      resultObj[key] = obj2[key]
    }
  })

  return resultObj
}

export const generateYearList = (startYear: number): IOption[] => {
  const currentYear = new Date().getFullYear()
  const yearList = []

  for (let year = startYear; year <= currentYear; year++) {
    yearList.push({ label: year.toString(), value: year.toString() })
  }

  return yearList
}

export const findOne = (val: string | number, key: string, objArr: Record<string, any>): Record<string, any> => {
  return objArr.find((item: Record<string, any>) => item[key] === val)
}

export interface ItemList {
  id: string | number
  title: string
}

export const convertDataToList = (data: any, textField: string): ItemList[] => {
  return data.map((item: any) => {
    return {
      id: item.id,
      title: item.attributes[textField]
    }
  })
}

export const stringToArray = (str: string, separator: string) => {
  const reArr = str.trim().split(separator)

  return reArr.reduce((accumulator: string[], currentValue: string) => {
    if (currentValue.trim() !== '') {
      accumulator.push(currentValue.trim())
    }
    return accumulator
  }, [])
}

export const findSelectedItem = (findVal: string | number | undefined, dataList: any, comparedFieldName: string) => {
  if (!findVal) return undefined
  return dataList.find((item: any) => item[comparedFieldName] === findVal)
}
