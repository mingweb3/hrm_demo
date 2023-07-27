/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from '@/locales/translations'
import { _t } from '@/utils/messages'

export const messages = {
  Submit: () => _t(translations.common.Submit),
  filter: () => _t(translations.common.filter),
  filter_data: () => _t(translations.common.filter_data),
  clear: () => _t(translations.common.clear),
  close: () => _t(translations.common.close),
  Create: () => _t(translations.common.Create),
  description: () => _t(translations.common.description),
  'Sort by': () => _t(translations.common['Sort by']),
  EditThisItem: () => _t(translations.common.EditThisItem),
  RemoveThisItem: () => _t(translations.common.RemoveThisItem),
  Division: () => _t(translations.Division.Division),
  'Division title': () => _t(translations.Division['Division title']),
  'Create new division': () => _t(translations.Division['Create new division']),
  'Department name A-Z': () => _t(translations.Division['Department name A-Z']),
  'Division page': () => _t(translations.Division['Division page']),
  'Manage Divisions listing': () => _t(translations.Division['Manage Divisions listing']),
  'Close filter form': () => _t(translations.common['Close filter form']),
  Add: () => _t(translations.common.Add),
  update: () => _t(translations.common.update),
  'Create new form': () => _t(translations.Division['Create new form']),
  Dashboard: () => _t(translations.common.Dashboard),
  EditDivision: () => _t(translations.Division.EditDivision),
  PleaseConfirm: () => _t(translations.common.PleaseConfirm),
  CreateNewSuccess: () => _t(translations.common.CreateNewSuccess),
  UpdateSuccess: () => _t(translations.common.UpdateSuccess)
}
