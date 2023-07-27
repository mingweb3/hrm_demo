import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import { WBreadcrums } from '@/app/components/WBreadcrumbs'
import WCard from '@/app/components/WCard'
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { messages } from '../messages'
import CreateCandidateForm from './components/CreateCandidateForm'

export const CreateCandidatePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Create candidate page | {AppConfig.title}</title>
        <meta name="description" content="Manage candidate listing" />
      </Helmet>
      <div className="flex flex-col gap-5">
        <WBreadcrums
          dataList={[
            {
              text: `${t(messages.Dashboard())}`,
              link: DEFAULT_URL
            },
            {
              text: `${t(messages.Candidates())}`,
              link: '/admin/candidates'
            },
            {
              text: `${t(messages.CreateCandidate())}`
            }
          ]}
        />
        {/* PAGE TITLE */}
        <div className="flex flex-row items-center justify-between flex-nowrap">
          <h1 className="f16Bold sm:f24Bold sm:fh1">{`${t(messages.CreateCandidate())}`}</h1>
        </div>
        {/* PAGE CONTENT */}
        <WCard className="w-full shadow-card">
          <CreateCandidateForm />
        </WCard>
      </div>
    </>
  )
}
