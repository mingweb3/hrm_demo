/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from '@/locales/translations'
import { _t } from '@/utils/messages'

export const messages = {
  'Add your principle company': () => _t(translations.firstTimePage['Add your principle company']),
  'Company name': () => _t(translations.organization['Company name']),
  'Business registration number': () => _t(translations.organization['Business registration number']),
  'Business address': () => _t(translations.organization['Business address']),
  'Billing address': () => _t(translations.organization['Billing address']),
  'Country of operations': () => _t(translations.organization['Country of operations']),
  Submit: () => _t(translations.common.Submit),
  submit_success: () => _t(translations.common.submit_success)
}
