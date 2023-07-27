import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import WCard from '@/app/components/WCard'
import WDropMenu from '@/app/components/WDropMenu'
import { WBreadcrums } from '@/components/WBreadcrumbs'
import { candidateMenus } from '@/menu-items/candidate'
import { getCandidateByIdFn } from '@/apis/candidate.api'
import { AppConfig } from '@/constants/AppConfig'
import { messages } from '../messages'
import { DropZone, FileList } from './components'

export const CandidateDocumentPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const candidateMenuList = candidateMenus(id || '0')

  // query: Get Candidate Details
  const queryStr = '?include=documents'
  const urlParams = new URLSearchParams(queryStr)

  const { data, isLoading } = useQuery({
    queryKey: ['candidate', id + queryStr],
    queryFn: () => {
      return getCandidateByIdFn(id || '', urlParams)
    },
    keepPreviousData: true,
    retry: 0
  })

  return (
    <>
      <Helmet>
        <title>
          Candidate #{id} - Upload document file | {AppConfig.title}
        </title>
        <meta name="description" content="Upload document file" />
      </Helmet>
      <div className="flex flex-col gap-5">
        <WBreadcrums
          dataList={[
            {
              text: `${t(messages.Dashboard())}`,
              link: '/'
            },
            {
              text: `${t(messages.Candidates())}`,
              link: '/candidates'
            },
            {
              text: `${t(messages.editCandidate())}`
            }
          ]}
        />
        {/* PAGE TITLE */}
        <div className="flex flex-row items-center justify-between flex-nowrap">
          <h1 className="sm:f24Bold sm:fh1">
            {`${t(messages.editCandidate())} / ${t(messages.Document())}`}
            <span className="f14Bold">: #{id}</span>
          </h1>
          <div>
            <WDropMenu dataList={candidateMenuList} />
          </div>
        </div>
        {/* PAGE CONTENT */}
        <WCard className="w-full shadow-card" padd="p-0">
          {isLoading && <LoadingBox />}
          {!isLoading && data && data.data && (
            <div className="p-4">
              <DropZone id={data.data.id} canUUID={data.data.attributes.UUID} />
            </div>
          )}
          {!isLoading && data && data.data && <FileList data={data.data} />}
        </WCard>
      </div>
    </>
  )
}
