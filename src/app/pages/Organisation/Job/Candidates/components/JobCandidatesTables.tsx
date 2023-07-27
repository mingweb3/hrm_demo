import React from 'react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { t } from 'i18next'
// COMPs
import { StyledTable } from '@/app/components/WTable'
import { IndCheckbox } from '@/app/components/WTable/IndCheckbox'
import { StatusLabel } from '@/app/pages/Candidate/Placement/components/StatusLabel'
import { overallGrades } from '@/constants/JsonData/eduCert'
import { jobLevels } from '@/constants/JsonData/jobLevel'
import { orgJobCandidateStatus } from '@/constants/JsonData/status'
import { IUserJob } from '@/types/IJob'
import { IPlacement } from '@/types/IPlacement'
import { getJobsInObj } from '@/utils/helper.candidate'
import { findOne } from '@/utils/helper.object'
import { messages } from '../../messages'
import { CandidateName } from './CandidateName'

interface JobCansTableProps {
  data: IPlacement[]
}

const JobCandidatesTable: React.FC<JobCansTableProps> = ({ data }) => {
  const columns = React.useMemo<ColumnDef<IPlacement>[]>(
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
        id: 'candidate',
        header: `${t(messages.Candidate())}`,
        cell: ({ row }) => {
          return <CandidateName {...row.original} />
        }
      },
      {
        id: 'jobSuitability',
        header: `${t(messages.JobSuitability())}`,
        cell: ({ row }) => {
          const { attributes } = row.original
          const { candidate } = attributes
          let reStr = '-'
          if (candidate?.userJobs && candidate?.userJobs.length > 0) {
            reStr = getJobsInObj(candidate?.userJobs as IUserJob[])
          }
          return <span className="f14Regular">{reStr}</span>
        }
      },
      {
        id: 'jobLevel',
        header: `${t(messages['Job Level / Grade']())}`,
        cell: ({ row }) => {
          const { attributes } = row.original
          const { candidate } = attributes
          return (
            <div>
              <p className="f14Regular mb-4">
                {findOne(candidate?.userBio?.jobLevel || '', 'value', jobLevels)?.label || '-'}
              </p>
              {candidate?.userBio?.grade && (
                <p className="f14Regular">{findOne(candidate?.userBio?.grade || '', 'value', overallGrades)?.label}</p>
              )}
            </div>
          )
        }
      },
      {
        id: 'time',
        header: `${t(messages.Time())}`,
        cell: ({ row }) => {
          const { attributes } = row.original
          return (
            <div>
              <div className="mb-2">
                <p className="f14Regular">{t(messages.assignedOn())}</p>
                <p className="f14Regular">{dayjs(attributes?.createdAt).format('DD.MM.YYYY')}</p>
                <p className="f14Regular">{dayjs(attributes?.createdAt).format('HH:mm:ss')}</p>
              </div>
              <div>
                <p className="f14Regular">{t(messages.updatedOn())}</p>
                <p className="f14Regular">{dayjs(attributes?.modifiedAt).format('DD.MM.YYYY')}</p>
                <p className="f14Regular">{dayjs(attributes?.modifiedAt).format('HH:mm:ss')}</p>
              </div>
            </div>
          )
        }
      },
      {
        id: 'status',
        header: `${t(messages.Status())}`,
        cell: ({ row }) => {
          const { attributes } = row.original
          return (
            <StatusLabel
              text={findOne(attributes?.decision || '', 'value', orgJobCandidateStatus)?.label}
              variant={attributes?.decision}
            />
          )
        }
      },
      {
        id: 'interviewDate',
        header: `${t(messages.InterviewDate())}`,
        cell: ({ row }) => {
          const { attributes } = row.original
          return attributes?.interviewDate ? (
            <p className="f14Regular">{dayjs(attributes?.interviewDate).format('DD.MM.YYYY')}</p>
          ) : (
            '-'
          )
        }
      },
      {
        id: 'Recruiter',
        header: `${t(messages.Recruiter())}`,
        cell: ({ row }) => {
          const { attributes } = row.original
          const { candidate } = attributes
          return <p className="f14Regular text-blue2">{candidate?.creatorUser?.name}</p>
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
      <div>
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
      </div>
    </StyledTable>
  )
}

export default JobCandidatesTable
