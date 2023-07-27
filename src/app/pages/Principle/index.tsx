// COMPs
import { useQuery } from '@tanstack/react-query'
import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import { useAuthContext } from '@/context/AuthProvider'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import { WBreadcrums } from '@/app/components/WBreadcrumbs'
import WCard from '@/app/components/WCard'
import { getPrincipleFn } from '@/apis/principle.api'
import { AppConfig } from '@/constants/AppConfig'
import { PrincipleForm } from './components/PrincipleForm'
import { messages } from './messages'

export const PrincipleDetailsPage: React.FC = () => {
  const authCtx = useAuthContext()

  // query: Get Candidate Details
  const { data, isLoading } = useQuery({
    queryKey: ['candidate', authCtx.state.currentUser?.attributes.principalUUID],
    queryFn: () => {
      const uuid = authCtx.state.currentUser?.attributes.principalUUID
      return getPrincipleFn(uuid || '')
    },
    keepPreviousData: true,
    retry: 0
  })

  return (
    <>
      <Helmet>
        <title>Principle page | {AppConfig.title}</title>
        <meta name="description" content="Manage principle listing" />
      </Helmet>
      <div className="flex flex-col gap-5">
        <WBreadcrums
          dataList={[
            {
              text: `${t(messages.Dashboard())}`,
              link: '/'
            },
            {
              text: `${t(messages['Principle details']())}`
            }
          ]}
        />
        {/* PAGE TITLE */}
        <div className="flex flex-row items-center flex-nowrap">
          <h1 className="f16Regular sm:f24Regular sm:fh1">
            {`${t(messages['Principle details']())}`}:{authCtx.state.currentUser?.attributes.principalUUID}
          </h1>
        </div>
        {/* PAGE CONTENT */}
        <WCard className="w-full shadow-card">
          {isLoading && <LoadingBox />}
          {data && !isLoading && <PrincipleForm data={data} />}
        </WCard>
      </div>
    </>
  )
}
