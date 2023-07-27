import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/system/useTheme'
import { useQuery } from '@tanstack/react-query'
import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/app/components/Button'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import WCard from '@/app/components/WCard'
import { TopOfTable, itemsPerPage, itemsPerPageDefault } from '@/app/components/WTable'
import NoData from '@/app/components/WTable/NoData'
import { staleTimeConfig } from '@/app/components/WTable/configTable'
import Pagination from '@/components/Pagination'
import { WBreadcrums } from '@/components/WBreadcrumbs'
import WDropMenu from '@/components/WDropMenu'
import { orgMenu } from '@/menu-items/organization'
import { useToggle } from '@/hooks/useToggle'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { getOrgJobsByIdFn } from '@/apis/org.job.api'
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { messages } from '../messages'
import { FilterForm, FilterNav, JobListTable } from './components'

export const OrgJobsPage: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const matchUpSm = useMediaQuery(theme.breakpoints.up('sm'))
  const { isVisible, onToggle } = useToggle()
  // VAR
  const { id } = useParams<{ id: string }>()
  const orgeMenuList = orgMenu(id || '1')

  const goToCreatePage = () => navigate(`/admin/organizations/${id}/jobs/create-job`)

  // GET DATA LIST
  const defaultQueryStr = `page[number]=1&page[size]=${itemsPerPageDefault}`
  const { searchParams, filterParamsObj, setSearchParams } = useFilterQueryUrl()

  // query: Table Data
  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['org_jobs', decodeURI(searchParams.toString()) || defaultQueryStr],
    queryFn: () => {
      return getOrgJobsByIdFn(id || '', searchParams)
    },
    keepPreviousData: true,
    staleTime: staleTimeConfig,
    retry: 0
  })

  // handle: Pagination TABLE
  const handleChangeItemsPerPage = (pageSize: number) => {
    setSearchParams({ ...filterParamsObj, 'page[size]': pageSize.toString() })
  }
  const handleGoToPage = (pageNumber: number) => {
    setSearchParams({ ...filterParamsObj, 'page[number]': pageNumber.toString() })
  }

  return (
    <>
      <Helmet>
        <title>
          {t(messages.orgJobsPage())} | {AppConfig.title}
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
              text: `Details`
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
        {/* PAGE TOOLBAR */}
        <WCard className="w-full shadow-card" padd="p-0">
          <TopOfTable
            leftSideItems={
              <>
                <Button onClick={goToCreatePage} variant="primary" size="md">
                  <span>+ {`${t(messages['Create new job']())}`}</span>
                </Button>
                {/* <Button variant="dangerous" size="md">
                  <span>{`${t(messages.remove())}`} [1]</span>
                </Button>
                <Button variant="warning" size="md">
                  <span>{`${t(messages.hold_on())}`} [2]</span>
                </Button>
                <Button variant="outline-gray" size="md">
                  <span>{`${t(messages.close())}`} [2]</span>
                </Button> */}
              </>
            }
            rightSideItems={
              <>
                {matchUpSm && <FilterNav />}
                <Button className="flex-1 md:flex-[unset]" variant="outline-gray" size="md" onClick={onToggle}>
                  <span>{`${t(messages.filter_data())}`}</span>
                </Button>
              </>
            }
          />
          {isVisible && <FilterForm closeFilter={onToggle} isTableLoading={isFetching} />}
        </WCard>
        {/* PAGE CONTENT */}
        {isLoading && <LoadingBox />}
        {!isLoading && data && data?.data.length > 0 && (
          <WCard className={`w-full shadow-card ${isFetching ? 'table-loading' : 'table-ready'}`} padd="p-0">
            {data && <JobListTable listData={data} />}
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
        {!isLoading && (!data || data?.data.length <= 0) && <NoData redirectLink={`/admin/organizations/${id}/jobs`} />}
      </div>
    </>
  )
}
