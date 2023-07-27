import { useParams } from 'react-router-dom'
import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import { WBreadcrums } from '@/app/components/WBreadcrumbs'
import WCard from '@/app/components/WCard'
import WDropMenu from '@/app/components/WDropMenu'
import { orgMenu } from '@/menu-items/organization'
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { CreateJobForm } from './components'
import { messages } from './messages'

export const CreateJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const orgeMenuList = orgMenu(id || '1')

  return (
    <>
      <Helmet>
        <title>Create new job page | {AppConfig.title}</title>
        <meta name="description" content="Create new job in ORG" />
      </Helmet>
      <div className="flex flex-col gap-5">
        <WBreadcrums
          dataList={[
            {
              text: `${t(messages.Dashboard())}`,
              link: DEFAULT_URL
            },
            {
              text: `${t(messages.organisations())}`,
              link: '/admin/organizations'
            },
            {
              text: 'Details',
              link: `/admin/organizations/${id}/details`
            },
            {
              text: 'Jobs',
              link: `/admin/organizations/${id}/jobs`
            },
            {
              text: t(messages['Create new job']())
            }
          ]}
        />
        {/* PAGE TITLE */}
        <div className="flex flex-row items-center justify-between flex-nowrap">
          <h1 className="sm:f24Bold sm:fh1">
            {`${t(messages['Organization details']())}`}
            <span className="f14Bold">: #{id}</span>
          </h1>
          <div>
            <WDropMenu dataList={orgeMenuList} />
          </div>
        </div>
        {/* PAGE CONTENT */}
        <WCard className="w-full shadow-card relative">
          <h3 className="f18Bold absolute top-[-12px] bg-white px-4 rounded">{`${t(messages['Create new job']())}`}</h3>
          {id && <CreateJobForm orgId={id} />}
        </WCard>
      </div>
    </>
  )
}
