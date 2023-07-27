import React, { useMemo } from 'react'
import { styled } from '@mui/system'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { t } from 'i18next'
import { StyledTable } from '@/app/components/WTable'
import { IndCheckbox } from '@/app/components/WTable/IndCheckbox'
// TYPES
import { IOrgJob, IOrgJobs } from '@/types/IOrgJob'
// COMPS
import { messages } from '../../messages'
import { JobTitle } from './JobTitle'
import { StatusLabel } from './StatusLabel'

const StyledJobListTable = styled('div')(``)

type JobListTableProps = {
  className?: string
  listData: IOrgJobs
  onRowSelect?: (data: IOrgJob[]) => void
}

const JobListTable: React.FC<JobListTableProps> = ({ listData }) => {
  const { data } = listData

  const columns = useMemo<ColumnDef<IOrgJob>[]>(
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
        id: 'title',
        header: `${t(messages['Job title']())}`,
        cell: ({ row }) => <JobTitle {...row.original} />
      },
      {
        id: 'department',
        header: `${t(messages.Department())}`,
        cell: ({ row }) => {
          const { attributes } = row.original

          return <span>{attributes.department?.categoryTitle}</span>
        }
      },
      {
        id: 'openings',
        header: `${t(messages.Openings())}`,
        cell: ({ row }) => {
          const { attributes } = row.original

          return <span>{attributes.numberOpen}</span>
        }
      },
      {
        id: 'salary',
        header: `${t(messages.Salary())}`,
        cell: ({ row }) => {
          const { attributes } = row.original

          return (
            <div>
              <div>
                {attributes.minSalary} - {attributes.maxSalary}
              </div>
              {attributes.currency}
            </div>
          )
        }
      },
      {
        id: 'startCloseDate',
        header: `${t(messages.StartClose())}`,
        cell: ({ row }) => {
          const { attributes } = row.original

          return (
            <p>
              {dayjs(attributes.startDate).format('DD/MM/YYYY')}
              <br />
              {dayjs(attributes.endDate).format('DD/MM/YYYY')}
            </p>
          )
        }
      },
      {
        id: 'status',
        header: `${t(messages.Status())}`,
        cell: ({ row }) => {
          const { attributes } = row.original

          return <StatusLabel text={attributes.status || ''} variant={attributes.status} />
        }
      }
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <StyledTable>
      <StyledJobListTable>
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
      </StyledJobListTable>
    </StyledTable>
  )
}

export default JobListTable
