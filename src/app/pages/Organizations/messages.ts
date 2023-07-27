/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from '@/locales/translations'
import { _t } from '@/utils/messages'

export const messages = {
  Dashboard: () => _t(translations.common.Dashboard),
  Submit: () => _t(translations.common.Submit),
  Create: () => _t(translations.common.Create),
  filter: () => _t(translations.common.filter),
  close: () => _t(translations.common.close),
  clear: () => _t(translations.common.clear),
  CreateNewSuccess: () => _t(translations.common.CreateNewSuccess),
  filter_data: () => _t(translations.common.filter_data),
  Organizations: () => _t(translations.organization.Organizations),
  department: () => _t(translations.common.Department),
  remove: () => _t(translations.common.remove),
  item: () => _t(translations.common.item),
  status: () => _t(translations.common.Status),
  company: () => _t(translations.organization.Company),
  jobs: () => _t(translations.organization.Jobs),
  candidates: () => _t(translations.organization.Candidates),
  'Close filter form': () => _t(translations.common['Close filter form']),
  openning: () => _t(translations.organization.Openning),
  closed: () => _t(translations.organization.Closed),
  'Create new client': () => _t(translations.organization['Create new client']),
  'Company name': () => _t(translations.organization['Company name']),
  'Contact email': () => _t(translations.common['Contact email']),
  'Contact number': () => _t(translations.common['Contact number']),
  'Business registration number': () => _t(translations.organization['Business registration number']),
  'Business address': () => _t(translations.organization['Business address']),
  'Billing address': () => _t(translations.organization['Billing address']),
  'Country of operations': () => _t(translations.organization['Country of operations']),
  'Office address': () => _t(translations.organization['Office address']),
  'Contact person name': () => _t(translations.organization['Contact person name']),
  'Contract person designation': () => _t(translations.organization['Contract person designation']),
  UpdatedItems: () => _t(translations.common.UpdatedItems)
}
