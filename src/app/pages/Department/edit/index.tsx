import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import { WBreadcrums } from '@/app/components/WBreadcrumbs'
import WCard from '@/app/components/WCard'
import NoData from '@/app/components/WTable/NoData'
import { getDepartmentByIdFn } from '@/apis/division.api'
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { messages } from '../messages'
import { EditDepartmentForm } from './components'

export const EditDepartmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  // query: Table Data
  const { data, isLoading } = useQuery({
    queryKey: ['department', id],
    queryFn: () => {
      if (id) return getDepartmentByIdFn(id)
      return null
    },
    keepPreviousData: true,
    retry: 0
  })

  return (
    <>
      <Helmet>
        <title>
          {t(messages.EditDepartment())} | {AppConfig.title}
        </title>
        <meta name="description" content="Edit department" />
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
              text: `${t(messages.EditDepartment())}`
            }
          ]}
        />
        {/* PAGE TITLE */}
        <div className="flex flex-row items-center justify-between flex-nowrap">
          <h1 className="f16Bold sm:f24Bold sm:fh1">
            {t(messages.EditDepartment())} #{id}
          </h1>
        </div>
        {/* PAGE CONTENT */}
        {isLoading && <LoadingBox />}
        {data && data?.data && !isLoading && (
          <WCard className="w-full shadow-card">
            <EditDepartmentForm data={data?.data} />
          </WCard>
        )}
        {!data && !isLoading && <NoData redirectLink="/admin/departments" redirectText="Get back" />}
      </div>
    </>
  )
}
