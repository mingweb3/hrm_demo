import { useEffect, useMemo, useState } from 'react'
import { styled } from '@mui/system'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { t } from 'i18next'
import { PenIcon } from '@/app/components/Svg/PenIcon'
import { StyledTable } from '@/app/components/WTable'
import { IndCheckbox } from '@/app/components/WTable/IndCheckbox'
import { IWorkPlaceForm } from '@/types/IOrganization'
import { messages } from '../../messages'
import { IsDefaultLabel } from './IsDefaultLabel'

const StyledWorkLocationListTable = styled('div')(
  ({ theme }) => `
  .alink {
    color: ${theme.palette.blue2};
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
  .edit-icon {
    cursor: pointer;
    svg {
      width: 16px;
      path, polygon {
        stroke: ${theme.palette.blue2};
      }
    }
    &:hover {
      svg {
      width: 16px;
      path, polygon {
        stroke: ${theme.palette.primary};
      }
    }
    }
  }
`
)

interface WorkLocationListTableProps {
  className?: string
  listData: IWorkPlaceForm[]
  onRowSelect: (data: IWorkPlaceForm[]) => void
  onClickEdit: (data: IWorkPlaceForm) => void
}

const WorkLocationListTable: React.FC<WorkLocationListTableProps> = ({ listData, onRowSelect, onClickEdit }) => {
  const data = listData
  const [rowSelection, setRowSelection] = useState({})

  // TABLE
  const columns = useMemo<ColumnDef<IWorkPlaceForm>[]>(
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
        id: 'location',
        header: `${t(messages.location())}`,
        cell: ({ row }) => {
          const { address, geoTag } = row.original
          return (
            <>
              <div className="f16Bold flex flex-row gap-2">
                {address}
                <span onClick={() => onClickEdit(row.original)} className="edit-icon" aria-hidden="true">
                  <PenIcon />
                </span>
              </div>
              {geoTag && (
                <a href={geoTag} target="_blank" className="alink f12Regular" rel="noreferrer">
                  View on map
                </a>
              )}
            </>
          )
        }
      },
      {
        id: 'postalCode',
        header: `${t(messages['Postal code']())}`,
        cell: ({ row }) => {
          const { postalCode } = row.original
          return <span>{postalCode}</span>
        }
      },
      {
        id: 'isDefault',
        header: `${t(messages.isDefault())}`,
        cell: ({ row }) => {
          const { isDefault } = row.original
          return <IsDefaultLabel data={isDefault} />
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const newList = table.getSelectedRowModel().flatRows.map(item => item.original) as IWorkPlaceForm[]
      onRowSelect(newList)
    } else {
      onRowSelect([])
    }
  }, [onRowSelect, rowSelection, table])

  // Action: Reset selection when dataTable changed
  useEffect(() => {
    setRowSelection({})
  }, [listData])

  return (
    <StyledTable>
      <StyledWorkLocationListTable>
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
      </StyledWorkLocationListTable>
    </StyledTable>
  )
}

export default WorkLocationListTable
