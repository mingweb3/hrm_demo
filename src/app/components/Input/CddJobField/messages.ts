/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from '@/locales/translations'
import { _t } from '@/utils/messages'

export const messages = {
  submit: () => _t(translations.common.Submit),
  filter: () => _t(translations.common.filter),
  filterData: () => _t(translations.common.filter_data),
  clear: () => _t(translations.common.clear),
  close: () => _t(translations.common.close),
  cancel: () => _t(translations.common.cancel),
  Language: () => _t(translations.CandidateInfo.Language),
  Written: () => _t(translations.CandidateInfo.Written),
  Level: () => _t(translations.CandidateInfo.Level),
  RemoveThisItem: () => _t(translations.common.RemoveThisItem)
}
