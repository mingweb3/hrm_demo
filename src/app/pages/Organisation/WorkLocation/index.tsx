import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/app/components/Button'
import Flyout from '@/app/components/Flyout'
import { useToggleFlyout } from '@/app/components/Flyout/hooks'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import WCard from '@/app/components/WCard'
import NoData from '@/app/components/WTable/NoData'
import { staleTimeConfig } from '@/app/components/WTable/configTable'
import { WBreadcrums } from '@/components/WBreadcrumbs'
import WDropMenu from '@/components/WDropMenu'
import { orgMenu } from '@/menu-items/organization'
import { getOrganizationByIdFn, removeWorkPlaceFn } from '@/apis/organization.api'
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { IWorkPlaceForm } from '@/types/IOrganization'
import { messages } from '../messages'
import { CreateLocationForm } from './components/CreateLocationForm'
import { EditLocationForm } from './components/EditLocationForm'
import WorkLocationListTable from './components/WorkLocationListTable'

export const WorkLocationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const orgeMenuList = orgMenu(id || '1')
  const queryClient = useQueryClient()
  const { isVisibleFlyout, onCloseFlyout, onToggleFlyout } = useToggleFlyout()

  // query: Get Candidate Details
  const queryParams = new URLSearchParams({
    include: 'workLocations'
  })
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['organization', `${id}_locations`],
    queryFn: () => getOrganizationByIdFn(id || '', queryParams),
    keepPreviousData: true,
    staleTime: staleTimeConfig,
    retry: 0
  })

  // handle: Row Selection
  const [removeLoading, setRemoveLoading] = useState<boolean>(false)
  const [sltRows, setSltRows] = useState<IWorkPlaceForm[] | undefined>()
  const selectRows = useCallback((data?: IWorkPlaceForm[]) => {
    setSltRows(data)
  }, [])

  // handle: Delete WorkPlace / removeWorkPlaceFn
  const onRemove = async () => {
    if (removeLoading) return
    if (!sltRows || sltRows.length <= 0) return
    const removeMuList = sltRows.map((itm: IWorkPlaceForm) => removeWPMutaion.mutateAsync(itm.UUID || ''))
    setRemoveLoading(true)

    // Request multiple
    try {
      await Promise.all(removeMuList)
    } catch (e) {
      setRemoveLoading(false)
    }

    queryClient.invalidateQueries({
      queryKey: ['organization', `${id}_locations`],
      exact: true
    })
  }

  // ACTION : DELETE ITEM
  const removeWPMutaion = useMutation({
    mutationFn: (id: string) => removeWorkPlaceFn(id)
  })

  // handle: Edit WorkPlace
  const editModalState = useToggleFlyout()
  const [editWPlace, setEditWPlace] = useState<IWorkPlaceForm | null>(null)
  const openEditForm = (data: IWorkPlaceForm) => {
    setEditWPlace(data)
    editModalState.onToggleFlyout()
  }

  return (
    <>
      <Helmet>
        <title>Work Location in Organization Page | {AppConfig.title}</title>
        <meta name="description" content="Work Location in Organization" />
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
            {`${t(messages['Organization details']())}`}: #{id}
          </h1>
          <div>
            <WDropMenu dataList={orgeMenuList} />
          </div>
        </div>
        {/* PAGE TOOLBAR */}
        <WCard className="w-full shadow-card" padd="p-0">
          <div className="p-4 flex flex-row items-center justify-between flex-nowrap">
            <div className="flex flex-row items-center gap-2">
              <Button variant="primary" size="md" onClick={onToggleFlyout}>
                <span>+ {`${t(messages['Create new location']())}`}</span>
              </Button>
              {sltRows && sltRows.length > 0 && (
                <Button onClick={onRemove} variant="dangerous" size="md">
                  <span>
                    {t(messages.remove())} ({sltRows.length})
                  </span>
                </Button>
              )}
            </div>
          </div>
        </WCard>
        {/* PAGE CONTENT */}
        {isLoading && <LoadingBox />}
        {!isLoading && data && data?.attributes.workLocations && (
          <WCard className={`w-full shadow-card ${isFetching ? 'table-loading' : 'table-ready'}`} padd="p-0">
            {data?.attributes.workLocations.length > 0 && (
              <WorkLocationListTable
                listData={data?.attributes.workLocations}
                onRowSelect={selectRows}
                onClickEdit={openEditForm}
              />
            )}
            {data?.attributes.workLocations.length <= 0 && <NoData redirectLink="" />}
          </WCard>
        )}
        {/* {!isLoading && ((data?.attributes.workLocations && data?.attributes.workLocations.length <= 0) || !data) && <NoData />} */}
      </div>
      {/* FORM in MODAL */}
      {isVisibleFlyout && id && (
        <Flyout
          onClose={onCloseFlyout}
          title={<h4 className="f24Bold text-primary flex-1">{t(messages['Create new location']())}</h4>}
          content={<CreateLocationForm orgID={id} onClose={onCloseFlyout} />}
        />
      )}
      {editModalState.isVisibleFlyout && id && editWPlace && (
        <Flyout
          onClose={editModalState.onCloseFlyout}
          title={<h4 className="f24Bold text-primary flex-1">{t(messages.EditLocation())}</h4>}
          content={<EditLocationForm data={editWPlace} orgID={id} onClose={editModalState.onCloseFlyout} />}
        />
      )}
    </>
  )
}
