/* eslint-disable import/order */
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { orgJobTabs } from '@/tab-items/orgJob'
import { Dialog } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
// COMPs
import { Button } from '@/app/components/Button'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import { WBreadcrums } from '@/app/components/WBreadcrumbs'
import WCard from '@/app/components/WCard'
import WToolBox from '@/app/components/WCard/WToolBox'
import WDropMenu from '@/app/components/WDropMenu'
import AlertModal from '@/app/components/WModal/AlertModal'
import { TopOfTable, itemsPerPage, itemsPerPageDefault } from '@/app/components/WTable'
import NoData from '@/app/components/WTable/NoData'
import WTabs from '@/app/components/WTabs'
import Pagination from '@/components/Pagination'
import { orgMenu } from '@/menu-items/organization'
import { useToggle } from '@/hooks/useToggle'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { getPlacementsByJobIdFn } from '@/apis/placement.api'
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { messages } from '../messages'
import { AssignCanModal } from './components/AssignCanModal'
import { FilterForm } from './components/FilterForm'
import JobCandidatesTable from './components/JobCandidatesTables'

export const OrgJobCandidatesPage: React.FC = () => {
  const { isVisible, onToggle } = useToggle()
  const { id, jobId } = useParams<{ id: string; jobId: string }>()

  // GET Placements by job id
  const defaultQueryStr = `page[number]=1&page[size]=${itemsPerPageDefault}`
  const { searchParams, filterParamsObj, setSearchParams } = useFilterQueryUrl()
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['job_placements', decodeURI(searchParams.toString()) || defaultQueryStr],
    queryFn: () => {
      return getPlacementsByJobIdFn(jobId || '', searchParams)
    },
    keepPreviousData: true,
    retry: 0
  })

  // handle: Pagination TABLE
  const handleChangeItemsPerPage = (pageSize: number) => {
    setSearchParams({ ...filterParamsObj, 'page[size]': pageSize.toString() })
  }
  const handleGoToPage = (pageNumber: number) => {
    setSearchParams({ ...filterParamsObj, 'page[number]': pageNumber.toString() })
  }

  // Menu & Tabs
  const orgeMenuList = orgMenu(id || '1')
  const orgJobTabList = orgJobTabs(id || '0', jobId || '0', data?.meta.pagination.total || 0)

  // MODAL ASSIGN CANDIDATE
  const [openAssignBox, setOpenAssignBox] = useState(false)
  const handleOpenAssignBox = () => {
    setOpenAssignBox(true)
  }
  const closeAssignBox = () => {
    setOpenAssignBox(false)
  }

  return (
    <>
      <Helmet>
        <title>
          {t(messages['Candidates in a job']())} | {AppConfig.title}
        </title>
        <meta name="description" content="Manage Jobs listing in ORG" />
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
        <WCard className="w-full shadow-card mb-[-1.25rem] pt-4" padd="p-0">
          <WTabs dataList={orgJobTabList} />
        </WCard>
        {/* PAGE TOOLBAR */}
        <WCard className="w-full shadow-card" padd="p-0">
          <WToolBox className="m-4">
            <TopOfTable
              leftSideItems={
                <>
                  <Button variant="primary" size="md" className="uppercase" onClick={handleOpenAssignBox}>
                    <span>+ {`${t(messages.ApplyCandidate())}`}</span>
                  </Button>
                </>
              }
              rightSideItems={
                <>
                  <Button className="flex-1 md:flex-[unset]" variant="white" size="md" onClick={onToggle}>
                    <span>{`${t(messages.filter())}`}</span>
                  </Button>
                </>
              }
            />
          </WToolBox>
          {isVisible && <FilterForm closeFilter={onToggle} isTableLoading={isFetching} />}
        </WCard>
        {/* PAGE CONTENT */}
        {isLoading && <LoadingBox />}
        {!isLoading && data && data?.data.length > 0 && (
          <WCard className={`w-full shadow-card ${isFetching ? 'table-loading' : 'table-ready'}`} padd="p-0">
            <JobCandidatesTable data={data.data} />
            {/* PAGINATION */}
            <Pagination
              totalPage={data.meta?.pagination.totalPages}
              curPage={data.meta?.pagination.currentPage}
              itemsPerPageOptions={itemsPerPage}
              itemsPerPage={data.meta?.pagination.perPage}
              onChangeItemsPerPage={n => handleChangeItemsPerPage(n)}
              onChangePage={n => handleGoToPage(n)}
              canPrevPage={!(data.meta?.pagination.currentPage > 1)}
              canNextPage={!(data.meta?.pagination.currentPage < data.meta?.pagination.totalPages)}
              onPrevPage={() => handleGoToPage(data.meta?.pagination.currentPage - 1)}
              onNextPage={() => handleGoToPage(data.meta?.pagination.currentPage + 1)}
            />
          </WCard>
        )}
        {!isLoading && (!data || data?.data.length <= 0) && (
          <NoData redirectLink={`/admin/organizations/${id}/jobs/${jobId}/candidates`} />
        )}
        {/* MODAL */}
        <Dialog open={openAssignBox} maxWidth="lg" fullWidth>
          <AlertModal
            hideActions
            showCloseIcon
            getResult={closeAssignBox}
            title={t(messages['Assign candidate']()) || ''}
            titleClassName="f24Bold text-blue4"
            content={<AssignCanModal onCloseModal={closeAssignBox} />}
          />
        </Dialog>
      </div>
    </>
  )
}
