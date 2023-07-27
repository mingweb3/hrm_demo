import React, { useMemo } from 'react'
// COMPS
import { Link, useNavigate } from 'react-router-dom'
import { FormControl, TextField } from '@mui/material'
// APi
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAuthContext } from '@/context/AuthProvider'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { Button } from '@/components/Button'
import LoadingBtn from '@/components/Button/LoadingBtn'
import { SocialBox } from '@/components/Button/SocialBox'
import { FacebookIcon } from '@/components/Svg/FacebookIcon'
import { GoogleIcon } from '@/components/Svg/GoogleIcon'
import { LinkedInIcon } from '@/components/Svg/LinkedInIcon'
import { loginUserFn } from '@/apis/auth.api'
import { DEFAULT_URL } from '@/constants/AppConfig'
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/constants/form/validation'
import { ILoginInput } from '@/types/IAuth'
import { IErrorForm } from '@/types/IErrorForm'
import { isAxiosError } from '@/utils/helpers'
import { AuthWrapper } from '../AuthWrapper'
import { messages } from '../messages'

export const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const authCtx = useAuthContext()

  // API Login Mutation
  const {
    mutate: loginUser,
    isLoading,
    error
  } = useMutation((userData: ILoginInput) => loginUserFn(userData), {
    onSuccess: data => {
      authCtx.dispatch({ type: 'LOGIN_USER', payload: data })
      navigate(DEFAULT_URL)
    }
  })

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  // Submit Login Form
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<ILoginInput>()

  const onSubmit: SubmitHandler<ILoginInput> = data => {
    loginUser(data)
  }

  return (
    <AuthWrapper>
      <h1 className="mb-8 f24Bold sm:fh1 text-primary">{t(messages['Sign in']())}</h1>
      <div>
        <div className="mb-4 f14Bold sm:f16Bold text-black444">{t(messages['Sign in your account with email.']())}</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 mb-16">
            <FormControl className="flex-1 int-group">
              <TextField
                {...register('email', { pattern: EMAIL_REGEX, required: true })}
                error={!!errors.email}
                size="small"
                label={`${t(messages['Your email']())}`}
                variant="outlined"
              />
              {errors.email && (
                <div className="error msg" role="alert">
                  Email is invaild!
                </div>
              )}
            </FormControl>
            <FormControl className="flex-1 int-group">
              <TextField
                {...register('password', { pattern: PASSWORD_REGEX, required: true })}
                error={!!errors.password}
                type="password"
                size="small"
                label={`${t(messages['Your password']())}`}
                variant="outlined"
              />
              {errors.password && (
                <div className="error msg" role="alert">
                  Password is invaild!
                </div>
              )}
            </FormControl>
            {errorForm && <ErrorForm error={errorForm?.error} />}
            <Button type="submit" variant="primary">
              {!isLoading && <span className="uppercase">{t(messages.Login())}</span>}
              {isLoading && <LoadingBtn />}
            </Button>

            <div className="flex items-center justify-between">
              <Link to="/" className="cursor-pointer f12Bold sm:f14Bold text-black444">
                {t(messages['Forgot password?']())}
              </Link>
              <Link to="/register" className="cursor-pointer f12Bold sm:f14Bold text-primary">
                {t(messages['Register new account']())}
              </Link>
            </div>
          </div>
        </form>
        <div>
          <div className="mb-4 f14Bold sm:f16Bold text-black444"> {t(messages['Or sign up with']())}</div>
          <div className="flex items-center justify-between">
            <SocialBox iconComp={<GoogleIcon />} text="Gmail" />
            <SocialBox iconComp={<FacebookIcon />} text="Facebook" />
            <SocialBox iconComp={<LinkedInIcon />} text="LinkedIn" />
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
