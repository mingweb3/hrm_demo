import * as React from 'react'
import { Link } from 'react-router-dom'
import { styled } from '@mui/system'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { t } from 'i18next'
// COMPs
import { StyledTable, itemsPerPage } from '@/app/components/WTable'
import { IndCheckbox } from '@/app/components/WTable/IndCheckbox'
import Pagination from '@/components/Pagination'
import { ICandidatePlacement } from '@/types/ICandidate'
import { candidatePlacements } from '@/fake-data/candidatePlacements'
import { messages } from '../../messages'
import { StatusLabel } from './StatusLabel'

const StyledCandidatePlacementListTable = styled('div')(``)

interface CandidatePlacementListTableProps {
  onToggleFlyoutEdit: () => void
}
const CandidatePlacementListTable: React.FC<CandidatePlacementListTableProps> = props => {
  const { onToggleFlyoutEdit } = props
  const [data] = React.useState(() => [...candidatePlacements])

  const handleChangeItemsPerPage = (pageSize: number) => {
    table.setPageSize(pageSize)
    // implement your code here
  }
  const handleGoToPage = (pageNumber: number) => {
    table.setPageIndex(pageNumber)
    // implement your code here
  }
  const columns = React.useMemo<ColumnDef<ICandidatePlacement>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <div className="checkbox-div">
            <IndCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler()
              }}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="checkbox-div">
            <IndCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          </div>
        )
      },
      {
        id: 'jobTitle',
        header: `${t(messages.jobTitle())}`,
        cell: ({ row }) => {
          const { jobTitle, jobType } = row.original
          return (
            <div>
              <p
                role="presentation"
                onClick={onToggleFlyoutEdit}
                onKeyDown={onToggleFlyoutEdit}
                className="f16Bold hover:underline cursor-pointer"
              >
                {jobTitle}
              </p>
              <p className="f16Regular">{jobType}</p>
            </div>
          )
        }
      },
      {
        id: 'organization',
        header: `${t(messages.organization())}`,
        cell: ({ row }) => {
          const { organization } = row.original
          return <p className="f16Regular">{organization}</p>
        }
      },
      {
        id: 'time',
        header: `${t(messages.time())}`,
        cell: ({ row }) => {
          const { assignedOn, updatedOn } = row.original
          return (
            <div>
              <div>
                <p className="f14Regular">{t(messages.assignedOn())}</p>
                <p className="f14Regular">{assignedOn.date}</p>
                <p className="f14Regular">{assignedOn.time}</p>
              </div>
              <div className="mt-6">
                <p className="f14Regular">{t(messages.updatedOn())}</p>
                <p className="f14Regular">{updatedOn.date}</p>
                <p className="f14Regular">{updatedOn.time}</p>
              </div>
            </div>
          )
        }
      },
      {
        id: 'status',
        header: `${t(messages.status())}`,
        cell: ({ row }) => {
          const { status } = row.original
          return <StatusLabel text={status} variant={status} />
        }
      },
      {
        id: 'Assigned recruiter',
        header: `${t(messages.assignedRecruiter())}`,
        cell: ({ row }) => {
          const { assignedRecruiter } = row.original
          return (
            <Link to="/" className="f14Bold text-blue2 hover:underline">
              {assignedRecruiter}
            </Link>
          )
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })
  return (
    <StyledTable>
      <StyledCandidatePlacementListTable>
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </StyledCandidatePlacementListTable>
      {/* PAGINATION */}
      <Pagination
        totalPage={table.getPageCount()}
        curPage={table.getState().pagination.pageIndex + 1}
        itemsPerPageOptions={itemsPerPage}
        itemsPerPage={table.getState().pagination.pageSize}
        onChangeItemsPerPage={handleChangeItemsPerPage}
        onChangePage={handleGoToPage}
        canPrevPage={!table.getCanPreviousPage()}
        canNextPage={!table.getCanNextPage()}
        onPrevPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
      />
    </StyledTable>
  )
}

export default CandidatePlacementListTable
