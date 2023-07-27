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
  filterData: () => _t(translations.common.filter_data),
  clear: () => _t(translations.common.clear),
  close: () => _t(translations.common.close),
  Create: () => _t(translations.common.Create),
  description: () => _t(translations.common.description),
  Add: () => _t(translations.common.Add),
  update: () => _t(translations.common.update),
  SortBy: () => _t(translations.common['Sort by']),
  EditThisItem: () => _t(translations.common.EditThisItem),
  RemoveThisItem: () => _t(translations.common.RemoveThisItem),
  Departments: () => _t(translations.Department.Departments),
  DepartmentTitle: () => _t(translations.Department.DepartmentTitle),
  SectionTitle: () => _t(translations.Department.SectionTitle),
  Dashboard: () => _t(translations.common.Dashboard),
  'Department name A-Z': () => _t(translations.Division['Department name A-Z']),
  Division: () => _t(translations.Division.Division),
  ChooseDivision: () => _t(translations.Division.ChooseDivision),
  ChooseSection: () => _t(translations.Department.ChooseSection),
  TypeToFind: () => _t(translations.common.TypeToFind)
}
