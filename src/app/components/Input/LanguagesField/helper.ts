import { Languages } from '@/constants/JsonData/languages'
import { ILangItemDto, ILangItemsForm } from '@/types/IJob'

export const transformDto = (data: ILangItemsForm): ILangItemDto[] | undefined => {
  if (!data || !data.langItem?.length) return undefined
  return data.langItem.map(item => {
    const { lang, oral, written, level } = item

    return {
      langaugeId: lang?.value || '',
      languageCompetency: `${oral ? 'oral' : ''}${oral ? ',' : ''}${written ? 'written' : ''}`,
      languageProficiency: level
    }
  })
}

export const convertToForm = (data: ILangItemDto[]) => {
  const newData = data.map(item => {
    const { langaugeId, languageCompetency, languageProficiency } = item

    const lang = Languages.find(item => item.code === langaugeId)
    const _langCompetency = convertTxtToObj(languageCompetency)

    return {
      lang: { text: lang?.name || 'English', value: lang?.code || 'en' },
      oral: _langCompetency === undefined ? true : _langCompetency.oral === undefined ? false : _langCompetency.oral,
      written:
        _langCompetency === undefined ? false : _langCompetency.written === undefined ? false : _langCompetency.written,
      level: languageProficiency
    }
  })

  return {
    langItem: newData
  }
}

export const convertTxtToObj = (text: string): { [key: string]: boolean } | undefined => {
  if (text === null || text === undefined || text === '') {
    return undefined
  }

  const keys = text.split(',')
  const obj: { [key: string]: boolean } = {}

  keys.forEach(key => {
    obj[key] = true
  })

  return obj
}

export const validateData = (data: ILangItemsForm): boolean => {
  if (!data || !data.langItem?.length) return false

  let result = true
  data.langItem.forEach(item => {
    const { oral, written } = item

    if (!oral && !written) {
      // eslint-disable-next-line no-alert
      alert('Please choose at least ORAL or WRITTEN')
      result = false
    }
  })

  return result
}
