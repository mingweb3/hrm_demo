import * as React from 'react'
import { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { Helmet } from 'react-helmet-async'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
// COMPS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@/app/components/Button'
import Flyout from '@/app/components/Flyout'
import { useToggleFlyout } from '@/app/components/Flyout/hooks'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import Pagination from '@/app/components/Pagination'
import WCard from '@/app/components/WCard'
import { TopOfTable, itemsPerPageDefault } from '@/app/components/WTable'
import NoData from '@/app/components/WTable/NoData'
import { itemsPerPage, staleTimeConfig } from '@/app/components/WTable/configTable'
import { WBreadcrums } from '@/components/WBreadcrumbs'
// HOOKs
import { useToggle } from '@/hooks/useToggle'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { getOrgnizationsFn, postStatusOrgsFn } from '@/apis/organization.api'
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { IOrganization } from '@/types/IOrganization'
import { FilterForm, OrganizationListTable } from './components'
import { CreateClientForm } from './components/CreateClientForm'
import { messages } from './messages'

export const OrganizationsPage: React.FC = () => {
  const { isVisible, onToggle } = useToggle()
  const queryClient = useQueryClient()
  const { isVisibleFlyout, onCloseFlyout, onToggleFlyout } = useToggleFlyout()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // GET DATA LIST
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultQueryStr = `page[number]=1&page[size]=${itemsPerPageDefault}`
  const { searchParams, filterParamsObj, setSearchParams } = useFilterQueryUrl()

  // query: Table Data
  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['organizations', decodeURI(searchParams.toString()) || defaultQueryStr],
    queryFn: () => {
      return getOrgnizationsFn(searchParams)
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
  const [sltRows, setSltRows] = useState<IOrganization[] | undefined>()
  const selectRows = useCallback((data?: IOrganization[]) => {
    setSltRows(data)
  }, [])

  // handle: Publish or Not Candidates
  const onDoPublishItems = (status: 'active' | 'pending' | 'stopped') => {
    if (sltRows && sltRows.length > 0) {
      const uuids = sltRows.map(item => item.attributes.UUID)
      if (uuids && uuids.length > 0) {
        publishOrgQuery.mutate({ UUIDs: uuids, status })
      }
    }
  }

  // API update Candidate: Mutation
  const publishOrgQuery = useMutation(
    (data: { UUIDs: (string | undefined)[]; status: 'active' | 'pending' | 'stopped' }) => postStatusOrgsFn(data),
    {
      onSuccess: () => {
        enqueueSnackbar(t(messages.UpdatedItems()), { variant: 'success' })
        queryClient.invalidateQueries({
          queryKey: ['organizations', decodeURI(searchParams.toString()) || defaultQueryStr],
          exact: true
        })
      }
    }
  )

  return (
    <>
      <Helmet>
        <title>
          {t(messages.Organizations())} | {AppConfig.title}
        </title>
        <meta name="description" content="Manage Organizations" />
      </Helmet>
      <div className="flex flex-col gap-5">
        <WBreadcrums
          dataList={[
            {
              text: `${t(messages.Dashboard())}`,
              link: DEFAULT_URL
            },
            {
              text: `${t(messages.Organizations())}`
            }
          ]}
        />
        {/* PAGE TITLE */}
        <div className="flex flex-row items-center justify-between flex-nowrap">
          <h1 className="sm:f24Bold sm:fh1">{`${t(messages.Organizations())}`}</h1>
        </div>
        {/* PAGE TOOLBAR */}
        <WCard className="w-full shadow-card" padd="p-0">
          <TopOfTable
            leftSideItems={
              <>
                <Button variant="primary" size="md" onClick={onToggleFlyout}>
                  <span>+ {`${t(messages['Create new client']())}`}</span>
                </Button>
                {sltRows && sltRows.length > 0 && (
                  <div className="flex flex-row gap-2">
                    {(searchParams.get('filter[status]') === 'stopped' ||
                      searchParams.get('filter[status]') === 'pending') && (
                      <Button onClick={() => onDoPublishItems('active')} variant="outline" size="md">
                        <span>Activate ({sltRows.length})</span>
                      </Button>
                    )}
                    {(!searchParams.get('filter[status]') || searchParams.get('filter[status]') === 'active') && (
                      <Button onClick={() => onDoPublishItems('stopped')} variant="outline-red" size="md">
                        <span>Stop Contract ({sltRows.length})</span>
                      </Button>
                    )}
                  </div>
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
        {!isLoading && data && data?.data.length > 0 && (
          <WCard className={`w-full shadow-card ${isFetching ? 'table-loading' : 'table-ready'}`} padd="p-0">
            <OrganizationListTable listData={data} onRowSelect={selectRows} />
            {/* PAGINATION */}
            <Pagination
              totalPage={data.meta?.pagination.totalPages}
              curPage={data.meta?.pagination.currentPage}
              itemsPerPageOptions={itemsPerPage}
              itemsPerPage={data.meta?.pagination.perPage}
              onChangeItemsPerPage={handleChangeItemsPerPage}
              onChangePage={handleGoToPage}
              canPrevPage={!(data.meta?.pagination.currentPage > 1)}
              canNextPage={!(data.meta?.pagination.currentPage < data.meta?.pagination.totalPages)}
              onPrevPage={() => handleGoToPage(data.meta?.pagination.currentPage - 1)}
              onNextPage={() => handleGoToPage(data.meta?.pagination.currentPage + 1)}
            />
          </WCard>
        )}
        {!isLoading && (!data || data?.data.length <= 0) && <NoData redirectLink="/admin/organizations" />}
      </div>
      {/* MODAL  */}
      {isVisibleFlyout && (
        <Flyout
          onClose={onCloseFlyout}
          title={<h4 className="f24Bold text-primary flex-1">{t(messages['Create new client']())}</h4>}
          content={<CreateClientForm />}
        />
      )}
    </>
  )
}
