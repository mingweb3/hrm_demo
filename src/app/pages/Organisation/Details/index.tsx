import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/app/components/Button'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
// COMPS
import WCard from '@/app/components/WCard'
import { WBreadcrums } from '@/components/WBreadcrumbs'
import WDropMenu from '@/components/WDropMenu'
import { orgMenu } from '@/menu-items/organization'
import { getOrganizationByIdFn, updateOrgnizationFn } from '@/apis/organization.api'
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { IErrorForm } from '@/types/IErrorForm'
import { IOrganizationForm } from '@/types/IOrganization'
import { isAxiosError } from '@/utils/helpers'
import { messages } from '../messages'
import { EditClientForm } from './components'

export const OrgDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const orgeMenuList = orgMenu(id || '0')
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // query: Get Candidate Details
  const { data, isLoading } = useQuery({
    queryKey: ['organization', id],
    queryFn: () => getOrganizationByIdFn(id || ''),
    keepPreviousData: true,
    retry: 0
  })

  // API Update ORG: Mutation
  const updateOrgQuery = useMutation(
    (formData: IOrganizationForm) => updateOrgnizationFn(data?.attributes.UUID || '', formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organization', data?.attributes.UUID], exact: true })
        enqueueSnackbar(t(messages.UpdateSuccess(), { UID: data?.attributes.UUID }), { variant: 'success' })
      },
      onError: e => {
        if (isAxiosError<{ error: IErrorForm }>(e)) {
          const _errorMsg = e.response?.data?.error?.data?.toString() || 'There is an issue on saving'
          enqueueSnackbar(`${e.response?.data?.error.code} - ${_errorMsg}`, { variant: 'error' })
        }
      }
    }
  )

  const updateOrgStatus = (newStatus: string) => {
    if (updateOrgQuery.isLoading) return
    updateOrgQuery.mutate({ status: newStatus })
  }

  return (
    <>
      <Helmet>
        <title>Organisation details | {AppConfig.title}</title>
        <meta name="description" content="Compose details of Organization" />
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
            {`${t(messages.Organization())}`}
            <span className="f14Bold">: #{id}</span>
          </h1>
          <div>
            <WDropMenu dataList={orgeMenuList} />
          </div>
        </div>
        {/* PAGE TOOLBAR */}
        <WCard className="w-full shadow-card" padd="p-0">
          <div className="p-4 flex flex-row items-center justify-between flex-nowrap">
            <div className="flex flex-row items-center gap-2">
              {data && (
                <>
                  {(data?.attributes.status === 'pending' || data?.attributes.status === 'stopped') && (
                    <Button
                      onClick={() => updateOrgStatus('active')}
                      variant="primary"
                      size="md"
                      disabled={updateOrgQuery.isLoading}
                    >
                      <span>Activate</span>
                    </Button>
                  )}
                  {data?.attributes.status === 'active' && (
                    <Button
                      onClick={() => updateOrgStatus('stopped')}
                      variant="outline-red"
                      size="md"
                      disabled={updateOrgQuery.isLoading}
                    >
                      <span>Stop Contract</span>
                    </Button>
                  )}
                </>
              )}
            </div>
            <div className="flex flex-row items-center gap-2">
              <Button onClick={() => navigate(`/admin/organizations/${id}/jobs`)} variant="outline" size="md">
                <span>Jobs (36)</span>
              </Button>
            </div>
          </div>
        </WCard>
        {/* PAGE CONTENT */}
        <WCard className="w-full shadow-card" padd="p-0">
          {isLoading && <LoadingBox />}
          {data && !isLoading && <EditClientForm data={data} />}
        </WCard>
      </div>
    </>
  )
}
