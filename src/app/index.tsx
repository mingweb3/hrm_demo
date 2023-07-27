import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { AppRoutes } from '@/routes'

export const App: React.FC = () => {
  const { i18n } = useTranslation()
  return (
    <BrowserRouter>
      <Helmet htmlAttributes={{ lang: i18n.language }} />
      <AppRoutes />
    </BrowserRouter>
  )
}
