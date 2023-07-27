import * as React from 'react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { Helmet } from 'react-helmet-async'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
// COMPS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@/app/components/Button'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import { WBreadcrums } from '@/app/components/WBreadcrumbs'
import WCard from '@/app/components/WCard'
import { TopOfTable } from '@/app/components/WTable'
import NoData from '@/app/components/WTable/NoData'
import { staleTimeConfig } from '@/app/components/WTable/configTable'
import { useToggle } from '@/hooks/useToggle'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { getDivisionFn, removeDivisionFn } from '@/apis/division.api'
import { DEFAULT_URL } from '@/constants/AppConfig'
import CreateDivisionForm from './components/CreateDivisionForm'
import { DivisionList } from './components/DivisionList'
import { FilterForm } from './components/FilterForm'
import { messages } from './messages'

export const DivisionsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const { isVisible, onToggle } = useToggle()
  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false)

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // GET DATA LIST
  const defaultQueryStr = `page[number]=1&page[size]=500`
  const { searchParams } = useFilterQueryUrl()

  // query: Table Data
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['divisions', decodeURI(searchParams.toString()) || defaultQueryStr],
    queryFn: () => {
      return getDivisionFn(searchParams)
    },
    keepPreviousData: true,
    staleTime: staleTimeConfig,
    retry: 0
  })

  // ACTION : DELETE ITEM
  const removeDiMutaion = useMutation({
    mutationFn: (id: string) => removeDivisionFn(id),
    onSuccess: () => {
      enqueueSnackbar(t(messages.RemoveThisItem()), { variant: 'success' })
      queryClient.invalidateQueries({
        queryKey: ['divisions', decodeURI(searchParams.toString()) || defaultQueryStr],
        exact: true
      })
    }
  })

  const removeDiItem = (id: string) => {
    removeDiMutaion.mutate(id)
  }

  return (
    <>
      <Helmet>
        <title>{t(messages['Division page']())}</title>
        <meta name="description" content={`${t(messages['Manage Divisions listing']())}`} />
      </Helmet>
      <div className="flex flex-col gap-5">
        <WBreadcrums
          dataList={[
            {
              text: `${t(messages.Dashboard())}`,
              link: DEFAULT_URL
            },
            {
              text: `${t(messages.Division())}`
            }
          ]}
        />
        {/* PAGE TITLE */}
        <div className="flex flex-row items-center flex-nowrap">
          <h1 className="sm:f24Bold sm:fh1">{t(messages.Division())}</h1>
        </div>

        {/* PAGE TOOLBAR */}
        <WCard className="w-full shadow-card" padd="p-0">
          <TopOfTable
            leftSideItems={
              <Button variant="primary" size="md" onClick={() => setIsOpenCreateForm(true)}>
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

        {isOpenCreateForm && <CreateDivisionForm onClose={() => setIsOpenCreateForm(false)} />}

        {/* PAGE CONTENT */}
        {isLoading && <LoadingBox />}
        {!isLoading && data && data?.data.length > 0 && (
          <WCard className={`w-full bg-transparent ${isFetching ? 'table-loading' : ''}`} padd="p-0">
            <DivisionList data={data?.data} removeItem={removeDiItem} />
          </WCard>
        )}
        {(!isLoading && data?.data.length <= 0) || (!isLoading && !data && <NoData redirectLink="/admin/divisions" />)}
      </div>
    </>
  )
}
