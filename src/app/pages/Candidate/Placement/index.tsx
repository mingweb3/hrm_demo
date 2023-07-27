import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { t } from 'i18next'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/app/components/Button'
import Flyout from '@/app/components/Flyout'
import { useToggleFlyout } from '@/app/components/Flyout/hooks'
// COMPS
import WCard from '@/app/components/WCard'
import WDropMenu from '@/app/components/WDropMenu'
import { TopOfTable } from '@/app/components/WTable'
import { WBreadcrums } from '@/components/WBreadcrumbs'
import { candidateMenus } from '@/menu-items/candidate'
import { useToggle } from '@/hooks/useToggle'
import { messages } from '../messages'
import { AssignCandidateForm } from './components/AssignCandidateForm'
import CandidatePlacementListTable from './components/CandidatePlacementListTable'
import { EditCandidatePlacementForm } from './components/EditCandidatePlacementForm'
import { FilterForm } from './components/FilterForm'
import ToolBarForm from './components/ToolBarForm'

export const CandidatePlacementPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const candidateMenuList = candidateMenus(id || '0')

  // Action: Show / Hide FlyBox
  const { isVisibleFlyout, onCloseFlyout, onToggleFlyout } = useToggleFlyout()
  const {
    isVisibleFlyout: isVisibleFlyoutEdit,
    onCloseFlyout: onCloseFlyoutEdit,
    onToggleFlyout: onToggleFlyoutEdit
  } = useToggleFlyout()
  const { isVisible, onToggle } = useToggle()

  return (
    <>
      <Helmet>
        <title>Candidate placement</title>
        <meta name="description" content="Manage Candidate placement listing" />
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
          <h1 className="sm:f24Bold sm:fh1">{`${t(messages.editCandidate())}`}: #4532</h1>
          <div>
            <WDropMenu dataList={candidateMenuList} />
          </div>
        </div>
        {/* PAGE TOOLBAR */}
        <WCard className="w-full shadow-card" padd="p-0">
          <TopOfTable
            leftSideItems={
              <>
                <Button variant="primary" size="md" onClick={onToggleFlyout}>
                  <span>+ {t(messages.assignCandidate())}</span>
                </Button>
              </>
            }
            rightSideItems={
              <Button className="flex-1 md:flex-[unset]" variant="outline-gray" size="md" onClick={onToggle}>
                <span>{`${t(messages.filterData())}`}</span>
              </Button>
            }
          />
          {isVisible && <FilterForm onClose={onToggle} />}
        </WCard>
        {/* PAGE CONTENT */}
        <WCard className="w-full shadow-card" padd="p-0">
          <CandidatePlacementListTable onToggleFlyoutEdit={onToggleFlyoutEdit} />
        </WCard>
      </div>
      {/* MODAL  */}
      {isVisibleFlyout && (
        <Flyout
          onClose={onCloseFlyout}
          title={<h4 className="f24Bold text-primary flex-1">{t(messages.assignCandidate())}</h4>}
          content={
            <>
              <ToolBarForm>
                <>
                  <Button className="bg-white border border-[#E3E3E3]">
                    <span>{t(messages.Deactivate())}</span>
                  </Button>
                  <Button variant="primary">
                    <span className="uppercase">{t(messages.Assign())}</span>
                  </Button>
                </>
              </ToolBarForm>
              <AssignCandidateForm />
              <ToolBarForm>
                <>
                  <Button className="bg-white border border-[#E3E3E3]">
                    <span>{t(messages.Deactivate())}</span>
                  </Button>
                  <Button variant="primary">
                    <span className="uppercase">{t(messages.Assign())}</span>
                  </Button>
                </>
              </ToolBarForm>
            </>
          }
        />
      )}

      {isVisibleFlyoutEdit && (
        <Flyout
          title={<h4 className="f24Bold text-primary flex-1">{t(messages.EditPlacement())}</h4>}
          onClose={onCloseFlyoutEdit}
          content={
            <>
              <ToolBarForm>
                <>
                  <Button className="bg-white border border-[#E3E3E3]">
                    <span>{t(messages.Deactivate())}</span>
                  </Button>
                  <Button variant="primary">
                    <span className="uppercase">{t(messages.Update())}</span>
                  </Button>
                </>
              </ToolBarForm>
              <EditCandidatePlacementForm />
              <ToolBarForm>
                <>
                  <Button className="bg-white border border-[#E3E3E3]">
                    <span>{t(messages.Deactivate())}</span>
                  </Button>
                  <Button variant="primary">
                    <span className="uppercase">{t(messages.Update())}</span>
                  </Button>
                </>
              </ToolBarForm>
            </>
          }
        />
      )}
    </>
  )
}
