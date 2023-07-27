import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
// COMPS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@/app/components/Button'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import Pagination from '@/app/components/Pagination'
import { WBreadcrums } from '@/app/components/WBreadcrumbs'
import WCard from '@/app/components/WCard'
import { TopOfTable } from '@/app/components/WTable'
import NoData from '@/app/components/WTable/NoData'
import { itemsPerPage, itemsPerPageDefault, staleTimeConfig } from '@/app/components/WTable/configTable'
import { useToggle } from '@/hooks/useToggle'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { getDepartmentFn } from '@/apis/division.api'
import { DEFAULT_URL } from '@/constants/AppConfig'
import { DepartmentList, FilterForm } from './components'
import { messages } from './messages'

export const DepartmentsPage: React.FC = () => {
  const navigate = useNavigate()
  const redirectToCreateNew = () => navigate('/admin/departments/create-new')
  const { isVisible, onToggle } = useToggle()

  // GET DATA LIST
  const defaultQueryStr = `page[number]=1&page[size]=${itemsPerPageDefault}`
  const { searchParams, filterParamsObj, setSearchParams } = useFilterQueryUrl()

  // query: Table Data
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['departments', decodeURI(searchParams.toString()) || defaultQueryStr],
    queryFn: () => {
      return getDepartmentFn(searchParams)
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
        <title>Departments page</title>
        <meta name="description" content="Departments page" />
      </Helmet>
      <div className="flex flex-col gap-5">
        <WBreadcrums
          dataList={[
            {
              text: `${t(messages.Dashboard())}`,
              link: DEFAULT_URL
            },
            {
              text: `${t(messages.Departments())}`
            }
          ]}
        />
        {/* PAGE TITLE */}
        <div className="flex flex-row items-center flex-nowrap">
          <h1 className="sm:f24Bold sm:fh1">{t(messages.Departments())}</h1>
        </div>

        {/* PAGE TOOLBAR */}
        <WCard className="w-full shadow-card" padd="p-0">
          <TopOfTable
            leftSideItems={
              <Button variant="primary" size="md" onClick={redirectToCreateNew}>
                <span>+ {t(messages.Create())}</span>
              </Button>
            }
            rightSideItems={
              <Button className="flex-1 md:flex-[unset]" variant="outline-gray" size="md" onClick={onToggle}>
                <FontAwesomeIcon icon={faFilter} size="xs" />
                {!isVisible && <span className="ml-2">{`${t(messages.filter())}`}</span>}
                {isVisible && <span className="ml-2">{`${t(messages.close())}`}</span>}
              </Button>
            }
          />
          {isVisible && <FilterForm />}
        </WCard>

        {/* PAGE CONTENT */}
        {isLoading && <LoadingBox />}
        {!isLoading && data && data?.data.length > 0 && (
          <WCard className={`w-full bg-transparent ${isFetching ? 'table-loading' : 'table-ready'}`} padd="p-0">
            <DepartmentList listData={data.data} />
            {/* PAGINATION */}
            <WCard className="w-full shadow-card mt-4" padd="p-0">
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
          </WCard>
        )}
        {!isLoading && (data?.data.length <= 0 || !data) && <NoData redirectLink="/admin/departments" />}
      </div>
    </>
  )
}
