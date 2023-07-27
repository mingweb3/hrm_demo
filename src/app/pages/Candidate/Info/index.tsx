import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
// COMPS
import { WBreadcrums } from '@/app/components/WBreadcrumbs'
import WCard from '@/app/components/WCard'
import WDropMenu from '@/app/components/WDropMenu'
import { candidateMenus } from '@/menu-items/candidate'
// SERVICES
import { getCandidateByIdFn } from '@/apis/candidate.api'
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { messages } from '../messages'
import { EditCandidateInfoForm } from './components/EditCandidateInfoForm'

export const CandidateInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const candidateMenuList = candidateMenus(id || '0')

  // query: Get Candidate Details
  const { data, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => {
      return getCandidateByIdFn(id || '')
    },
    keepPreviousData: true,
    retry: 0
  })

  return (
    <>
      <Helmet>
        <title>Edit candidate page | {AppConfig.title}</title>
        <meta name="description" content="Update candidate information" />
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
              text: `${t(messages.editCandidate())}`
            }
          ]}
        />
        {/* PAGE TITLE */}
        <div className="flex flex-row items-center justify-between flex-nowrap">
          <h1 className="sm:f24Bold sm:fh1">
            {`${t(messages.editCandidate())}`}
            <span className="f14Bold">: #{id}</span>
          </h1>
          <div>
            <WDropMenu dataList={candidateMenuList} />
          </div>
        </div>
        {/* PAGE CONTENT */}
        <WCard className="w-full shadow-card">
          {isLoading && <LoadingBox />}
          {data && !isLoading && <EditCandidateInfoForm data={data.data} />}
        </WCard>
      </div>
    </>
  )
}
