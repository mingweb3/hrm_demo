import { countries } from '@/constants/JsonData/countries'
import { INation } from '@/types/INations'

export function getNationByCode(code?: string): INation | undefined {
  if (!code) return undefined
  return countries.find(item => item.code === code)
}

export function convertSelectListData({
  data,
  textField,
  valueField
}: {
  data: any[]
  textField: string
  valueField: string
}) {
  return data.map(item => ({
    text: item[textField],
    value: item[valueField]
  }))
}

export function convertToSelectedObj(data: Record<string, any>, textField: string, valueField: string) {
  if (!data) return undefined
  return {
    text: data[textField],
    value: data[valueField]
  }
}
