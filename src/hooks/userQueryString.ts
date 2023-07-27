import { useSearchParams } from 'react-router-dom'
import { isEmpty } from '@/utils/helpers'

export const useQueryString = () => {
  const [searchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])
  return searchParamsObject
}

export const useFilterQueryUrl = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const filterParamsObj = Object.fromEntries([...searchParams])

  const mergeParams = <T extends { [key: string]: string | number | undefined }>(newFilterParams: T): T => {
    const result: any = {}
    const keys1 = Object.keys(newFilterParams)
    const keys2 = Object.keys(filterParamsObj)

    keys1.forEach(key => {
      if (keys2.includes(key) && filterParamsObj[key] !== '' && filterParamsObj[key] !== undefined) {
        result[key] = filterParamsObj[key]
      } else if (newFilterParams[key] !== '' && newFilterParams[key] !== undefined) {
        result[key] = newFilterParams[key]
      }
    })

    keys2.forEach(key => {
      if (!keys1.includes(key) && filterParamsObj[key] !== '' && filterParamsObj[key] !== undefined) {
        result[key] = filterParamsObj[key]
      }
    })

    return result
  }

  const flattenObject = (obj: Record<string, any>, prefix = 'filter'): Record<string, any> => {
    return Object.keys(obj).reduce((acc, key) => {
      const prefixedKey = prefix ? `${prefix}[${key}]` : key
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((item: any, index: any) => {
            Object.assign(acc, flattenObject({ [`${prefixedKey}[${index}]`]: item }))
          })
        } else {
          Object.assign(acc, flattenObject(obj[key], prefixedKey))
        }
      } else if (obj[key] !== '') {
        // eslint-disable-next-line no-param-reassign
        acc[prefixedKey] = obj[key]
      }
      return acc
    }, {} as Record<string, any>)
  }

  const cleanEmptyFilterData = (obj: Record<string, any>, prefix = 'filter'): Record<string, any> => {
    const flatObj = flattenObject(obj, prefix)

    const output: Record<string, any> = {}
    for (const [key, value] of Object.entries(flatObj)) {
      if (!isEmpty(value)) {
        let val = value.toString().trim()
        if (value.toString().trim() === 'true') {
          val = '1'
        } else if (value.toString().trim() === 'false') {
          val = '0'
        }
        output[`${key.replace(/\]\[/g, '.')}`] = val
      }
    }
    return output
  }

  const removeAllParams = (
    obj: Record<string, unknown>,
    matchStr: string
  ): Record<string, never> | Record<string, unknown> => {
    const newObj = { ...obj }
    for (const key in newObj) {
      if (key.startsWith(matchStr)) {
        delete newObj[key]
      }
    }
    return newObj
  }

  const plainFilterKeys = (filter: Record<string, unknown>): Record<string, unknown> => {
    const result: Record<string, unknown> = {}
    Object.entries(filter).forEach(([key, value]) => {
      const newKey = key.replace(/^filter\[(.*)\]$/, '$1')
      result[newKey] = value
    })
    return result
  }

  return {
    searchParams,
    filterParamsObj,
    mergeParams,
    cleanEmptyFilterData,
    removeAllParams,
    plainFilterKeys,
    setSearchParams
  }
}
