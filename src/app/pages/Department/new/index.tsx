import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import { WBreadcrums } from '@/app/components/WBreadcrumbs'
import WCard from '@/app/components/WCard'
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { messages } from '../messages'
import { CreateDepartmentForm } from './components'

export const CreateDepartmentPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>
          {t(messages.CreateNewDepartment())} | {AppConfig.title}
        </title>
        <meta name="description" content={t(messages.CreateNewDepartment()) || 'CreateNewDepartment'} />
      </Helmet>
      <div className="flex flex-col gap-5">
        <WBreadcrums
          dataList={[
            {
              text: `${t(messages.Dashboard())}`,
              link: DEFAULT_URL
            },
            {
              text: `${t(messages.Departments())}`,
              link: '/admin/departments'
            },
            {
              text: `${t(messages.CreateNewDepartment())}`
            }
          ]}
        />
        {/* PAGE TITLE */}
        <div className="flex flex-row items-center justify-between flex-nowrap">
          <h1 className="f16Bold sm:f24Bold sm:fh1">{t(messages.CreateNewDepartment())}</h1>
        </div>
        {/* PAGE CONTENT */}
        <WCard className="w-full shadow-card">
          <CreateDepartmentForm />
        </WCard>
      </div>
    </>
  )
}
