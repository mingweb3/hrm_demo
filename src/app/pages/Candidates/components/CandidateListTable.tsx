/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/system'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { t } from 'i18next'
import { FemaleIcon } from '@/app/components/Svg/FemaleIcon'
import { MaleIcon } from '@/app/components/Svg/MaleIcon'
// COMPS
import { IndCheckbox, StyledTable } from '@/app/components/WTable'
import { PrefCommitment, jobLevels } from '@/constants/JsonData/jobLevel'
// TYPES
import { ICandidate, ICandidates } from '@/types/ICandidate'
import { IUserJob } from '@/types/IJob'
import { getJobsInObj } from '@/utils/helper.candidate'
import { getNationByCode } from '@/utils/helper.national'
import { findOne } from '@/utils/helper.object'
import { messages } from '../messages'
import { StatusLabel } from './StatusLabel'

const StyledCandidateListTable = styled('div')(``)

type CandidateListTableProps = {
  className?: string
  listData: ICandidates
  onRowSelect: (data: ICandidate[]) => void
}

const CandidateListTable: React.FC<CandidateListTableProps> = ({ listData, onRowSelect }) => {
  const theme = useTheme()
  const { data } = listData
  const [rowSelection, setRowSelection] = React.useState({})

  // Render Columns in Table
  const columns = useMemo<ColumnDef<ICandidate>[]>(
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
        id: 'name',
        header: `${t(messages.Name())}`,
        cell: ({ row }) => {
          const { attributes } = row.original

          return (
            <div>
              <Link to={`/admin/candidates/${attributes.UUID}/info`} className="f16Bold">
                {attributes.name}
              </Link>
              {attributes.gender === 'male' && (
                <span className="nm-icon ml-1">
                  <MaleIcon color={theme.palette.blue2} />
                </span>
              )}
              {attributes.gender === 'female' && (
                <span className="nm-icon ml-1">
                  <FemaleIcon color={theme.palette.red2} />
                </span>
              )}
              <p className="f14Regular">{attributes.email}</p>
              {attributes.userBio?.prefCommitmentId && (
                <p className="f14Regular">
                  {findOne(attributes.userBio?.prefCommitmentId, 'value', PrefCommitment).label}
                </p>
              )}
            </div>
          )
        }
      },
      {
        id: 'jobSuitability',
        header: `${t(messages.JobSuitability())}`,
        cell: ({ row }) => {
          const { attributes } = row.original
          let reStr = '-'
          if (attributes.userJobs && attributes.userJobs.length > 0) {
            reStr = getJobsInObj(attributes.userJobs as IUserJob[])
          }
          return <span className="f14Regular">{reStr}</span>
        }
      },
      {
        id: 'level',
        header: `${t(messages.Level())}`,
        cell: ({ row }) => {
          const { attributes } = row.original
          if (attributes.userBio?.jobLevel)
            return (
              <span className="f14Regular">
                {findOne(attributes.userBio?.jobLevel, 'value', jobLevels)?.label || '-'}
              </span>
            )
          return <span className="f14Regular">-</span>
        }
      },
      {
        id: 'nationality',
        header: `${t(messages.Nationality())}`,
        cell: ({ row }) => {
          const { attributes } = row.original
          return (
            <>
              <span className="f14Bold text-primary">
                {getNationByCode(attributes.nationality)?.nationality || '-'}
              </span>
            </>
          )
        }
      },
      {
        id: 'isPublished',
        header: `${t(messages.Status())}`,
        cell: ({ row }) => {
          const { attributes } = row.original
          return <StatusLabel data={attributes.isPublished || false} />
        }
      }
    ],
    [theme.palette.blue2, theme.palette.red2]
  )

  // Register TABLE
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection
    },
    onRowSelectionChange: setRowSelection
  })

  // Action: Selected Rows -> Emit higher Comp
  useEffect(() => {
    if (Object.keys(rowSelection).length > 0) {
      const newList = table.getSelectedRowModel().flatRows.map(item => item.original)
      onRowSelect(newList)
    } else {
      onRowSelect([])
    }
  }, [onRowSelect, rowSelection, table])

  // Action: Reset selection when dataTable changed
  useEffect(() => {
    setRowSelection({})
  }, [data])

  return (
    <StyledTable>
      <StyledCandidateListTable>
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
      </StyledCandidateListTable>
    </StyledTable>
  )
}

export default CandidateListTable
