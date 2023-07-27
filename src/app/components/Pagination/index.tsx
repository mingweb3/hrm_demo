import * as React from 'react'
import { useState } from 'react'
import { t } from 'i18next'
import { faAnglesLeft, faAnglesRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@/app/components/Button'
import { messages } from './messages'

interface PaginationProps {
  totalPage: number
  curPage: number
  itemsPerPage: number
  itemsPerPageOptions: number[]
  onChangeItemsPerPage: (pageSize: number) => void
  onChangePage: (pageNumber: number) => void
  canPrevPage: boolean
  canNextPage: boolean
  onPrevPage: () => void
  onNextPage: () => void
}

const Pagination: React.FC<PaginationProps> = props => {
  const {
    totalPage,
    curPage,
    itemsPerPage,
    itemsPerPageOptions,
    onChangeItemsPerPage,
    onChangePage,
    canPrevPage,
    canNextPage,
    onPrevPage,
    onNextPage
  } = props

  // Action: GoToPage
  const [goToPage, setGoToPage] = useState<number>(1)
  const handleGoToPage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (goToPage !== curPage) {
      onChangePage(goToPage)
    }
  }

  return (
    <div className="pagination flex justify-center py-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* ARROWS NAVIGATION */}
        <div className="flex gap-2">
          {/* FIRST PAGE BUTTON */}
          <Button
            className="border rounded p-1 w-[34px]"
            onClick={() => {
              onChangePage(1)
            }}
            disabled={canPrevPage}
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </Button>
          {/* PREV PAGE BUTTON */}
          <Button className="border rounded p-1 w-[34px]" onClick={onPrevPage} disabled={canPrevPage}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          {/* NEXT PAGE BUTTON */}
          <Button className="border rounded p-1 w-[34px]" onClick={onNextPage} disabled={canNextPage}>
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
          {/* LAST PAGE BUTTON  */}
          <Button
            className="border rounded p-1 w-[34px]"
            onClick={() => {
              onChangePage(totalPage)
            }}
            disabled={canNextPage}
          >
            <FontAwesomeIcon icon={faAnglesRight} />
          </Button>
        </div>

        <div className="flex flex-row gap-2">
          {/* CURRENT PAGE */}
          <div className="flex items-center gap-1">
            <div>{t(messages.Page())}</div>
            <strong>
              {curPage} {t(messages.of())} {totalPage}
            </strong>
          </div>

          {/* GOTO PAGE */}
          <div className="flex items-center gap-1 ">
            <form onSubmit={e => handleGoToPage(e)}>
              {t(messages['Go to page']())}:
              <input
                type="number"
                defaultValue={curPage}
                placeholder="1"
                min="1"
                max={totalPage}
                onChange={e => {
                  const pageNumber = e.target.value ? Number(e.target.value) : 1
                  setGoToPage(pageNumber)
                }}
                className="border p-1 rounded w-14 sm:w-16"
              />
            </form>
          </div>

          {/* ITEMS PER PAGE */}
          <select
            value={itemsPerPage}
            onChange={e => {
              onChangeItemsPerPage(Number(e.target.value))
            }}
          >
            {itemsPerPageOptions.map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {t(messages.Show())} {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default Pagination
