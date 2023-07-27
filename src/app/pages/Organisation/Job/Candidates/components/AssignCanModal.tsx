import React, { lazy, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import qs from 'qs'
import LoadingBox from '@/app/components/FullScreenLoader/LoadingBox'
import { itemsPerPage, itemsPerPageDefault, staleTimeConfig } from '@/app/components/WTable/configTable'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { getCandidatesFn } from '@/apis/candidate.api'
import { getJobById } from '@/apis/org.job.api'
// COMPs
import { assignCanToJobSteps } from '@/constants/JsonData/jobAssignCandidate'
import { ICandidate } from '@/types/ICandidate'
import { IErrorForm } from '@/types/IErrorForm'
import { IFilterCanForm } from '@/types/IOrgJobCandidate'
import { isEmptyObject } from '@/utils/helper.object'
import { messages } from '../../messages'
import { AssignCanForm } from './AssignCanForm'
import { AssignCandidates } from './AssignCandidates'
import { FilterCanForm } from './FilterCanForm'

const Pagination = lazy(() => import('@/components/Pagination'))

interface AssignCanModalProps {
  onCloseModal: () => void
}

export const AssignCanModal: React.FC<AssignCanModalProps> = ({ onCloseModal }) => {
  const { jobId } = useParams<{ jobId: string }>()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // Action: change step
  const [step, setStep] = useState<number>(assignCanToJobSteps.filterStep)
  const onChangeStep = (_step: number) => {
    setStep(_step)
  }

  // query: Get Job Details
  const qsJobParams = new URLSearchParams({
    include: 'extendJob,department,skills,workLocation,organisation'
  })
  const { data: jobDetail, isLoading } = useQuery({
    queryKey: ['job_details', jobId],
    queryFn: () => {
      return getJobById(jobId || '', qsJobParams)
    },
    keepPreviousData: true,
    retry: 0
  })

  // query: Get Candidates
  const { cleanEmptyFilterData } = useFilterQueryUrl()
  const [qsFilterParams, setQsFilterParams] = useState({})
  const [fetchFilter, setFetchFilter] = useState<boolean>(false)
  const {
    data: candidates,
    isFetching,
    error
  } = useQuery({
    queryKey: ['candidates', decodeURI(qs.stringify(qsFilterParams))],
    queryFn: () => {
      return getCandidatesFn(new URLSearchParams(qsFilterParams))
    },
    onSuccess: data => {
      setFetchFilter(false)
      if (data.data.length > 0) {
        onChangeStep(assignCanToJobSteps.listStep)
      } else {
        // case data not found
        enqueueSnackbar(`${t(messages['No Candidates Found']())}`, { variant: 'error' })
      }
    },
    keepPreviousData: true,
    staleTime: staleTimeConfig,
    retry: 0,
    enabled: fetchFilter
  })

  // handle: Pagination
  const handleChangeItemsPerPage = (pageSize: number) => {
    setQsFilterParams({
      ...qsFilterParams,
      'page[size]': pageSize.toString()
    })
    setFetchFilter(true)
  }
  const handleGoToPage = (pageNumber: number) => {
    setQsFilterParams({
      ...qsFilterParams,
      'page[number]': pageNumber.toString()
    })
    setFetchFilter(true)
  }

  // Action: handle filter candidate
  const [currentFilter, setCurrentFilter] = useState<IFilterCanForm | null>(null)
  const handleFilter = (data: IFilterCanForm) => {
    setCurrentFilter(data)

    const _data = data
    const filterData = cleanEmptyFilterData(_data)

    if (!isEmptyObject(filterData)) {
      setQsFilterParams({
        ...filterData,
        'page[size]': itemsPerPageDefault,
        'fields[userBio]': 'jobLevel,prefCommitmentId,expSalary,currencyExpSalary',
        filterIgnoreJobUUID: jobId
      })
      setFetchFilter(true)
    }
  }

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  // Action: handle select candidate
  const [stdCandidate, setStdCandidate] = useState<ICandidate | null>(null)
  const handleSelect = (data: ICandidate) => {
    setStdCandidate(data)
    onChangeStep(assignCanToJobSteps.assignStep)
  }

  return (
    <>
      {isLoading && <LoadingBox />}
      {!isLoading && (
        <>
          {step === assignCanToJobSteps.filterStep && (
            <FilterCanForm
              onChange={handleFilter}
              defaultValue={currentFilter}
              currentJob={jobDetail}
              isLoading={isFetching}
              errorForm={errorForm}
            />
          )}
          {step === assignCanToJobSteps.listStep && (
            <>
              <AssignCandidates onSelect={handleSelect} listData={candidates?.data} />
              {/* PAGINATION */}
              <Pagination
                totalPage={candidates.meta?.pagination.totalPages}
                curPage={candidates.meta?.pagination.currentPage}
                itemsPerPageOptions={itemsPerPage}
                itemsPerPage={candidates.meta?.pagination.perPage}
                onChangeItemsPerPage={n => handleChangeItemsPerPage(n)}
                onChangePage={n => handleGoToPage(n)}
                canPrevPage={!(candidates.meta?.pagination.currentPage > 1)}
                canNextPage={!(candidates.meta?.pagination.currentPage < candidates.meta?.pagination.totalPages)}
                onPrevPage={() => handleGoToPage(candidates.meta?.pagination.currentPage - 1)}
                onNextPage={() => handleGoToPage(candidates.meta?.pagination.currentPage + 1)}
              />
            </>
          )}
          {step === assignCanToJobSteps.assignStep && (
            <AssignCanForm
              onBackStep={() => onChangeStep(assignCanToJobSteps.filterStep)}
              onCloseModal={onCloseModal}
              stdCandidate={stdCandidate}
              currentJob={jobDetail}
            />
          )}
        </>
      )}
    </>
  )
}
