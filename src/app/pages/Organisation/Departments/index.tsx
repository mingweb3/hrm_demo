import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/app/components/Button'
import Flyout from '@/app/components/Flyout'
import { useToggleFlyout } from '@/app/components/Flyout/hooks'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import WCard from '@/app/components/WCard'
import NoData from '@/app/components/WTable/NoData'
import { WBreadcrums } from '@/components/WBreadcrumbs'
import WDropMenu from '@/components/WDropMenu'
import { orgMenu } from '@/menu-items/organization'
import { getOrganizationByIdFn } from '@/apis/organization.api'
import { AppConfig, DEFAULT_URL } from '@/constants/AppConfig'
import { messages } from '../messages'
import { OrgDepartments, OrgNewDepartmentForm } from './components'

export const OrgDepartmentsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const orgeMenuList = orgMenu(id || '0')

  const { isVisibleFlyout, onCloseFlyout, onToggleFlyout } = useToggleFlyout()

  // query: Get Candidate Details
  const queryParams = new URLSearchParams({
    include: 'departments,division'
  })
  const { data, isLoading } = useQuery({
    queryKey: ['organization', `${id}_departments_divisions`],
    queryFn: () => getOrganizationByIdFn(id || '', queryParams),
    keepPreviousData: true,
    retry: 0
  })

  return (
    <>
      <Helmet>
        <title>Organisation details - Departments | {AppConfig.title}</title>
        <meta name="description" content="Organisation details - Departments" />
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
              <Button onClick={onToggleFlyout} variant="primary" size="md">
                <span>Add Department</span>
              </Button>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Button variant="outline" size="md">
                <span>Jobs (36)</span>
              </Button>
            </div>
          </div>
        </WCard>
        {/* PAGE CONTENT */}
        {id && (
          <WCard className="w-full shadow-card" padd="p-0">
            {isLoading && <LoadingBox />}
            {data && data?.attributes.departments && data?.attributes.departments?.length > 0 && !isLoading && (
              <OrgDepartments id={id} data={data?.attributes.departments} />
            )}
            {!isLoading && ((data?.attributes.departments && data?.attributes.departments?.length <= 0) || !data) && (
              <NoData redirectLink="" />
            )}
          </WCard>
        )}
        {!id && <NoData redirectLink="" />}
      </div>
      {/* MODAL  */}
      {isVisibleFlyout && id && (
        <Flyout
          onClose={onCloseFlyout}
          title={<h4 className="f24Bold text-primary flex-1">{t(messages.CreateNewDepartment())}</h4>}
          content={<OrgNewDepartmentForm id={id} onClose={onCloseFlyout} />}
        />
      )}
    </>
  )
}
