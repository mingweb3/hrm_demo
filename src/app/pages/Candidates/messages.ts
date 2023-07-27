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
  AddCandidate: () => _t(translations.Candidate['Add candidate']),
  Name: () => _t(translations.Candidate.Name),
  JobSuitability: () => _t(translations.Candidate['Job Suitability']),
  Level: () => _t(translations.Candidate.Level),
  Nationality: () => _t(translations.Candidate.Nationality),
  Status: () => _t(translations.Candidate.Status),
  Email: () => _t(translations.Candidate.Email),
  Unavailable: () => _t(translations.Candidate.Unavailable),
  CloseFilterForm: () => _t(translations.common['Close filter form']),
  Candidates: () => _t(translations.Candidate.Candidates),
  CandidatePage: () => _t(translations.Candidate['Candidates page']),
  Dashboard: () => _t(translations.common.Dashboard),
  minLength3: () => _t(translations.form.minLength3),
  TypeToFind: () => _t(translations.common.TypeToFind),
  UpdatedItems: () => _t(translations.common.UpdatedItems),
  Publish: () => _t(translations.common.Publish),
  unPublish: () => _t(translations.common.unPublish)
}
