import * as React from 'react'
import { Suspense, lazy, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { Helmet } from 'react-helmet-async'
// COMPS
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@/app/components/Button'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import WCard from '@/app/components/WCard'
import { TopOfTable } from '@/app/components/WTable'
import NoData from '@/app/components/WTable/NoData'
import { itemsPerPage, itemsPerPageDefault, staleTimeConfig } from '@/app/components/WTable/configTable'
import { WBreadcrums } from '@/components/WBreadcrumbs'
// Hooks
import { useToggle } from '@/hooks/useToggle'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { getCandidatesFn, postPublishCandiates } from '@/apis/candidate.api'
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { ICandidate } from '@/types/ICandidate'
import { FilterForm } from './components/FilterForm'
import { messages } from './messages'

// LazyLoad
const Pagination = lazy(() => import('@/components/Pagination'))
const CandidateListTable = lazy(() => import('./components/CandidateListTable'))

export const CandidatesPage: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isVisible, onToggle } = useToggle()
  const [selectedRow, setSelectedRow] = useState<ICandidate[] | undefined>()
  const onRedirectToCreateCandidate = () => navigate('/admin/candidates/create-candidate')

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // GET DATA LIST
  // https://www.mantine-react-table.com/docs/examples/react-query
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultQueryStr = `page[number]=1&page[size]=${itemsPerPageDefault}`
  const { searchParams, filterParamsObj, setSearchParams } = useFilterQueryUrl()

  // query: Table Data
  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['candidates', decodeURI(searchParams.toString()) || defaultQueryStr],
    queryFn: () => {
      return getCandidatesFn(searchParams)
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

  // handle: Row Selection
  const selectRows = useCallback((data?: ICandidate[]) => {
    setSelectedRow(data)
  }, [])

  // handle: Publish or Not Candidates
  const onDoPublishItems = (isPublished: 0 | 1) => {
    if (selectedRow && selectedRow.length > 0) {
      const uuids = selectedRow.map(item => item.attributes.UUID)
      if (uuids && uuids.length > 0) {
        publishCanQuery.mutate({ UUIDs: uuids, status: isPublished })
      }
    }
  }

  // API update Candidate: Mutation
  const publishCanQuery = useMutation(
    (data: { UUIDs: (string | undefined)[]; status: 0 | 1 }) => postPublishCandiates(data),
    {
      onSuccess: () => {
        enqueueSnackbar(t(messages.UpdatedItems()), { variant: 'success' })
        queryClient.invalidateQueries({
          queryKey: ['candidates', decodeURI(searchParams.toString()) || defaultQueryStr],
          exact: true
        })
      }
    }
  )

  return (
    <>
      <Helmet>
        <title>
          {t(messages.CandidatePage())} | {AppConfig.title}
        </title>
        <meta name="description" content="Manage Candidates listing" />
      </Helmet>
      <div className="flex flex-col gap-5">
        <WBreadcrums
          dataList={[
            {
              text: `${t(messages.Dashboard())}`,
              link: DEFAULT_URL
            },
            {
              text: `${t(messages.Candidates())}`
            }
          ]}
        />
        {/* PAGE TITLE */}
        <div className="flex flex-row items-center flex-nowrap">
          <h1 className="sm:f24Bold sm:fh1">{t(messages.Candidates())}</h1>
        </div>
        {/* PAGE TOOLBAR */}
        <WCard className="w-full shadow-card" padd="p-0">
          <TopOfTable
            leftSideItems={
              <>
                <Button variant="primary" size="md" onClick={onRedirectToCreateCandidate}>
                  <span>+ {t(messages.AddCandidate())}</span>
                </Button>
                {searchParams.get('filter[isPublished]') !== '1' && selectedRow && selectedRow?.length > 0 && (
                  <Button
                    onClick={() => onDoPublishItems(1)}
                    variant="outline-gray"
                    size="md"
                    className={`${publishCanQuery.isLoading ? 'section-loading' : ''}`}
                  >
                    <span>
                      {t(messages.Publish())} [{selectedRow?.length}]
                    </span>
                  </Button>
                )}
                {searchParams.get('filter[isPublished]') !== '0' && selectedRow && selectedRow?.length > 0 && (
                  <Button
                    onClick={() => onDoPublishItems(0)}
                    variant="outline-gray"
                    size="md"
                    className={`${publishCanQuery.isLoading ? 'section-loading' : ''}`}
                  >
                    <span>
                      {t(messages.unPublish())} [{selectedRow?.length}]
                    </span>
                  </Button>
                )}
              </>
            }
            rightSideItems={
              <Button className="flex-1 md:flex-[unset]" variant="outline-gray" size="md" onClick={onToggle}>
                <FontAwesomeIcon icon={faFilter} size="xs" />
                {!isVisible && <span className="ml-2">{`${t(messages.filter())}`}</span>}
                {isVisible && <span className="ml-2">{`${t(messages.close())}`}</span>}
              </Button>
            }
          />
          {isVisible && <FilterForm isTableLoading={isFetching} />}
        </WCard>
        {/* PAGE CONTENT */}
        {isLoading && <LoadingBox />}
        <Suspense fallback={<LoadingBox />}>
          {!isLoading && data && data?.data.length > 0 && (
            <WCard className={`w-full shadow-card ${isFetching ? 'table-loading' : 'table-ready'}`} padd="p-0">
              <CandidateListTable listData={data} onRowSelect={selectRows} />
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
        </Suspense>
        {!isLoading && (data?.data.length <= 0 || !data) && <NoData redirectLink="/admin/candidates" />}
      </div>
    </>
  )
}
