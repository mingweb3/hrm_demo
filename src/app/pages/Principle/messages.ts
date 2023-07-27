/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from '@/locales/translations'
import { _t } from '@/utils/messages'

export const messages = {
  Submit: () => _t(translations.common.Submit),
  update: () => _t(translations.common.update),
  filter: () => _t(translations.common.filter),
  filter_data: () => _t(translations.common.filter_data),
  clear: () => _t(translations.common.clear),
  close: () => _t(translations.common.close),
  cancel: () => _t(translations.common.cancel),
  Dashboard: () => _t(translations.common.Dashboard),
  'Principle settings': () => _t(translations.PrincipleDetails['Principle settings']),
  'Principle details': () => _t(translations.PrincipleDetails['Principle details']),
  'Company name': () => _t(translations.PrincipleDetails['Company name']),
  'Business registration number': () => _t(translations.PrincipleDetails['Business registration number']),
  'Business address': () => _t(translations.PrincipleDetails['Business address']),
  'Billing address': () => _t(translations.PrincipleDetails['Billing address']),
  CountryOfOperations: () => _t(translations.PrincipleDetails['Country of operations']),
  UpdateSuccess: () => _t(translations.common.UpdateSuccess)
}
