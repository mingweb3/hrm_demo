import { translations } from '@/locales/translations'
import { _t } from '@/utils/messages'

export const messages = {
  'Sign in': () => _t(translations.auth['Sign in']),
  'Sign in your account with email.': () => _t(translations.auth['Sign in your account with email.']),
  'Your email': () => _t(translations.auth['Your email']),
  'Your password': () => _t(translations.auth['Your password']),
  'Forgot password?': () => _t(translations.auth['Forgot password?']),
  'Register new account': () => _t(translations.auth['Register new account']),
  'Or sign up with': () => _t(translations.auth['Or sign up with']),
  'Register now for free': () => _t(translations.auth['Register now for free']),
  'Sign up as HR Manager. You have 1-month free trial': () =>
    _t(translations.auth['Sign up as HR Manager. You have 1-month free trial']),
  'Sign up': () => _t(translations.auth['Sign up']),
  'By creating the account you agree to our': () => _t(translations.auth['By creating the account you agree to our']),
  'Terms of Services': () => _t(translations.auth['Terms of Services']),
  'Privacy Policy': () => _t(translations.auth['Privacy Policy']),
  '6-digits': () => _t(translations.auth['6-digits']),
  'Please check your email to get verified code': () =>
    _t(translations.auth['Please check your email to get verified code']),
  'Dont get code?': () => _t(translations.auth[`Don't get code?`]),
  'Verified code': () => _t(translations.auth['Verified code']),
  and: () => _t(translations.common.and),
  Login: () => _t(translations.auth.Login),
  Submit: () => _t(translations.common.Submit),
  Resend: () => _t(translations.auth.Resend)
}
