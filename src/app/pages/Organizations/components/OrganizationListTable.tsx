import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { styled } from '@mui/system'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { t } from 'i18next'
import { StyledTable } from '@/app/components/WTable'
import { IndCheckbox } from '@/app/components/WTable/IndCheckbox'
import { IOrganization, IOrganizations } from '@/types/IOrganization'
import { messages } from '../messages'
import { CompanyItemRow } from './Company'
import { StatusLabel } from './StatusLabel'

const StyledOrganisationListTable = styled('div')(``)

interface OrgListTableProps {
  className?: string
  listData: IOrganizations
  onRowSelect: (data: IOrganization[]) => void
}

const OrganizationListTable: React.FC<OrgListTableProps> = ({ listData, onRowSelect }) => {
  // const theme = useTheme()
  const { data } = listData
  const [rowSelection, setRowSelection] = useState({})

  const columns = useMemo<ColumnDef<IOrganization>[]>(
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
        id: 'company',
        header: `${t(messages.company())}`,
        cell: ({ row }) => <CompanyItemRow data={row.original.attributes} />
      },
      {
        id: 'jobs',
        header: `${t(messages.jobs())}`,
        cell: ({ row }) => {
          return (
            <>
              <p>142 {t(messages.openning())}</p>
              <p>10 {t(messages.closed())}</p>
            </>
          )
        }
      },
      {
        id: 'candidates',
        header: `${t(messages.candidates())}`,
        cell: ({ row }) => {
          return <span>134</span>
        }
      },
      {
        id: 'status',
        header: `${t(messages.status())}`,
        cell: ({ row }) => (
          <StatusLabel
            text={row.original.attributes.status || 'pending'}
            variant={row.original.attributes.status || 'pending'}
          />
        )
      }
    ],
    []
  )

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
      <StyledOrganisationListTable>
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
      </StyledOrganisationListTable>
    </StyledTable>
  )
}

export default OrganizationListTable
