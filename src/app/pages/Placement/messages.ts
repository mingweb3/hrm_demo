/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */
import { translations } from '@/locales/translations'
import { _t } from '@/utils/messages'

export const messages = {
  'Edit Placement Page': () => _t(translations.Placement['Edit Placement Page']),
  Dashboard: () => _t(translations.common.Dashboard),
  'Edit placement': () => _t(translations.CandidatePlacement['Edit placement']),
  cancel: () => _t(translations.common.cancel),
  update: () => _t(translations.common.update),
  Candidate: () => _t(translations.Candidate.Candidate),
  'Current job': () => _t(translations.Candidate['Current job']),
  InterviewDate: () => _t(translations.CandidatePlacement['Interview date']),
  PanelOfInterviewers: () => _t(translations.CandidatePlacement['Panel of interviewers']),
  MeetingRoomUrl: () => _t(translations.CandidatePlacement['Meeting room url']),
  Status: () => _t(translations.common.Status),
  Offer: () => _t(translations.CandidatePlacement.Offer),
  ProbationaryPeriod: () => _t(translations.CandidatePlacement['Probationary Period']),
  CommencementDate: () => _t(translations.CandidatePlacement['Commencement Date']),
  ConfirmationDate: () => _t(translations.CandidatePlacement['Confirmation Date']),
  LastDay: () => _t(translations.CandidatePlacement['Last Day']),
  OfferMade: () => _t(translations.CandidatePlacement['Offer Made']),
  LOASigned: () => _t(translations.CandidatePlacement['LOA Signed']),
  BasicOffered: () => _t(translations.CandidatePlacement['Basic offered']),
  OfferAccepted: () => _t(translations.CandidatePlacement['Offer accepted']),
  Currency: () => _t(translations.CandidatePlacement.Currency),
  TransportAllowance: () => _t(translations.CandidatePlacement['Transport Allowance']),
  OtherAllowance: () => _t(translations.CandidatePlacement['Other Allowance']),
  Interview: () => _t(translations.CandidatePlacement.Interview),
  VideoInterviewLink: () => _t(translations.CandidatePlacement['Video interview link']),
  ReasonForRejection: () => _t(translations.CandidatePlacement['Reason For Rejection']),
  Notes: () => _t(translations.common.Notes),
  Remark: () => _t(translations.CandidatePlacement.Remark),
  YearOfRelevantExperience: () => _t(translations.CandidatePlacement['Year of Relevant Experience']),
  UpdateSuccess: () => _t(translations.common.UpdateSuccess)
}
