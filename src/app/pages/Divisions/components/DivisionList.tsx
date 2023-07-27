// COMPS
import * as React from 'react'
import { useState } from 'react'
import { Dialog, IconButton, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { t } from 'i18next'
import { PenIcon } from '@/app/components/Svg/PenIcon'
import { RemoveIcon } from '@/app/components/Svg/RemoveIcon'
import WCard from '@/app/components/WCard'
import AlertModal from '@/app/components/WModal/AlertModal'
// -- SERVICES
import { IDivision } from '@/types/IJob'
import { messages } from '../messages'
import EditDivisionForm from './EditDivisionForm'

const DivisionListStyled = styled('div')(`
  .tool-box {
    svg {
      width: 18px;
    }
  }
`)

interface DivisionListProps {
  data: IDivision[]
  removeItem: (id: string) => void
}

export const DivisionList: React.FC<DivisionListProps> = ({ data, removeItem }) => {
  // MODAL: EDIT
  const [curEditItem, setCurEditItem] = useState<null | IDivision>(null)
  const [openEditBox, setOpenEditBox] = useState(false)
  const closeEditBox = () => {
    setOpenEditBox(false)
  }
  const handleOpenEditBox = (data: IDivision) => {
    setCurEditItem(data)
    setOpenEditBox(true)
  }

  // MODAL: REMOVE ITEM
  const [removeId, setRemoveId] = useState<null | string>(null)
  const [openDelBox, setOpenDelBox] = useState(false)
  const closeDelBox = (res: boolean) => {
    setOpenDelBox(false)
    if (res && removeId) removeItem(removeId)
  }
  const handleOpenDelBox = (id: string) => {
    setRemoveId(id)
    setOpenDelBox(true)
  }

  return (
    <DivisionListStyled className="flex flex-col gap-4">
      {data.map((item: IDivision) => {
        const { id, attributes } = item

        return (
          <WCard key={id} className="w-full shadow-card flex flex-row items-center justify-between">
            <div className="readonly-box">
              <p className="f16Bold">{attributes.title}</p>
              {attributes.description && <div className="desc f12Regular">{attributes.description}</div>}
            </div>
            <div className="tool-box flex items-center gap-2">
              <Tooltip title={`${t(messages.EditThisItem())}`}>
                <IconButton onClick={() => handleOpenEditBox(item)} aria-hidden="true">
                  <PenIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={`${t(messages.RemoveThisItem())}`}>
                <IconButton onClick={() => handleOpenDelBox(id)} aria-hidden="true">
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
          </WCard>
        )
      })}
      <Dialog open={openEditBox} maxWidth="sm" fullWidth>
        {curEditItem && <EditDivisionForm onClose={closeEditBox} data={curEditItem} />}
      </Dialog>
      <Dialog open={openDelBox} maxWidth="sm" fullWidth>
        <AlertModal
          getResult={closeDelBox}
          title={t(messages.PleaseConfirm()) || 'TRANSLATE...'}
          content={`Do you really want to remove #${removeId}?`}
        />
      </Dialog>
    </DivisionListStyled>
  )
}
