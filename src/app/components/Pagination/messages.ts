import { translations } from '@/locales/translations'
import { _t } from '@/utils/messages'

export const messages = {
  Page: () => _t(translations.pagination.Page),
  of: () => _t(translations.pagination.of),
  'Go to page': () => _t(translations.pagination['Go to page']),
  Show: () => _t(translations.pagination.Show)
}
