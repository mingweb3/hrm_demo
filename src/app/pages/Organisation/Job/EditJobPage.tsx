/* eslint-disable import/order */
import { useParams } from 'react-router-dom'
import { orgJobTabs } from '@/tab-items/orgJob'
import { useQuery } from '@tanstack/react-query'
import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import { WBreadcrums } from '@/app/components/WBreadcrumbs'
import WCard from '@/app/components/WCard'
import WDropMenu from '@/app/components/WDropMenu'
import { itemsPerPageDefault } from '@/app/components/WTable'
import WTabs from '@/app/components/WTabs'
import { orgMenu } from '@/menu-items/organization'
import { getJobById } from '@/apis/org.job.api'
import { getPlacementsByJobIdFn } from '@/apis/placement.api'
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { EditJobForm } from './components'
import { messages } from './messages'

export const EditJobPage: React.FC = () => {
  const { id, jobId } = useParams<{ id: string; jobId: string }>()

  // query: Get Candidate Details
  const { data, isLoading } = useQuery({
    queryKey: ['job_details', jobId],
    queryFn: () => {
      return getJobById(jobId || '')
    },
    keepPreviousData: true,
    retry: 0
  })

  // GET Placement by job id
  const defaultQueryStr = `page[number]=1&page[size]=${itemsPerPageDefault}`
  const { data: dataPlacements } = useQuery({
    queryKey: ['job_placements', defaultQueryStr],
    queryFn: () => {
      return getPlacementsByJobIdFn(jobId || '')
    },
    keepPreviousData: true,
    retry: 0
  })

  // Menu & Tabs
  const orgeMenuList = orgMenu(id || '1')
  const orgJobTabList = orgJobTabs(id || '0', jobId || '0', dataPlacements?.meta.pagination.total || 0)

  return (
    <>
      <Helmet>
        <title>Edit job page | {AppConfig.title}</title>
        <meta name="description" content="Edit job page" />
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
              text: t(messages['Edit job']())
            }
          ]}
        />
        {/* PAGE TITLE */}
        <div className="flex flex-row items-center justify-between flex-nowrap">
          <h1 className="f16Bold sm:f24Bold sm:fh1">
            {`${t(messages['Edit job']())}`}
            <span className="f14Bold">: #{jobId}</span>
          </h1>
          <div>
            <WDropMenu dataList={orgeMenuList} />
          </div>
        </div>
        {/* TABS */}
        <WCard className="w-full shadow-card mb-[-1.25rem] px-0 pb-0">
          <WTabs dataList={orgJobTabList} />
        </WCard>
        {/* PAGE CONTENT */}
        {id && (
          <WCard className="w-full shadow-card">
            {isLoading && <LoadingBox />}
            {data && !isLoading && <EditJobForm orgId={id} data={data} />}
          </WCard>
        )}
      </div>
    </>
  )
}
