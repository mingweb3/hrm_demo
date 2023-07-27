import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import { WBreadcrums } from '@/app/components/WBreadcrumbs'
import WCard from '@/app/components/WCard'
import { getPlacementByIdFn } from '@/apis/placement.api'
// COMPs
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { messages } from '../messages'
import { EditForm } from './components/EditForm'

export const EditPlacementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  // GET Placement detail
  const { data, isLoading } = useQuery({
    queryKey: ['placement_detail', id],
    queryFn: () => {
      return getPlacementByIdFn(id || '')
    },
    keepPreviousData: true,
    retry: 0
  })

  return (
    <>
      <Helmet>
        <title>
          {t(messages['Edit Placement Page']())} | {AppConfig.title}
        </title>
        <meta name="description" content="Edit placement" />
      </Helmet>
      <div className="flex flex-col gap-5">
        <WBreadcrums
          dataList={[
            {
              text: `${t(messages.Dashboard())}`,
              link: DEFAULT_URL
            },
            {
              text: t(messages['Edit placement']())
            }
          ]}
        />
        {/* PAGE TITLE */}
        <div className="flex flex-row items-center justify-between flex-nowrap">
          <h1 className="f16Bold sm:f24Bold sm:fh1">
            {`${t(messages['Edit placement']())}`}
            <span className="f14Bold">: #{id}</span>
          </h1>
        </div>
        {/* PAGE CONTENT */}
        {id && (
          <WCard className="w-full shadow-card">
            {isLoading && <LoadingBox />}
            {data && !isLoading && <EditForm data={data} />}
          </WCard>
        )}
      </div>
    </>
  )
}
