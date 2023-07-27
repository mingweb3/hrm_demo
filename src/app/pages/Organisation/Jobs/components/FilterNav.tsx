import React, { useEffect, useState } from 'react'
import { t } from 'i18next'
import { useFilterQueryUrl } from '@/hooks/userQueryString'
import { IQueryParamsOrgJobs } from '@/types/IOrgJob'
import { messages } from '../../messages'

export const FilterNav: React.FC = () => {
  const { filterParamsObj, setSearchParams, cleanEmptyFilterData } = useFilterQueryUrl()
  const [status, setStatus] = useState<string>('')

  const changeStatus = (data: string) => {
    if (status !== data) {
      setStatus(data)
      const params: IQueryParamsOrgJobs = {
        status: data
      }
      const filterData = cleanEmptyFilterData(params)

      setSearchParams({ ...filterParamsObj, ...filterData, 'page[number]': '1' })
    }
  }

  useEffect(() => {
    if (filterParamsObj) {
      if (filterParamsObj['filter[status]'] && filterParamsObj['filter[status]'] !== '') {
        setStatus(filterParamsObj['filter[status]'])
      } else {
        setStatus('active') // default active
      }
    }
  }, [filterParamsObj])

  return (
    <div className="flex flex-row gap-4">
      <button
        type="button"
        className={`f14Bold text-green2 capitalize cursor-pointer hover:text-green3 ${
          status === 'active' ? 'underline' : ''
        }`}
        onClick={() => changeStatus('active')}
      >
        {t(messages.active())}
      </button>
      <button
        type="button"
        className={`f14Bold text-orange1 cursor-pointer hover:text-orange2 ${status === 'on-hold' ? 'underline' : ''}`}
        onClick={() => changeStatus('on-hold')}
      >
        {t(messages['on-hold']())}
      </button>
      <button
        type="button"
        className={`f14Bold text-gray3 capitalize cursor-pointer hover:text-gray2 ${
          status === 'closed' ? 'underline' : ''
        }`}
        onClick={() => changeStatus('closed')}
      >
        {t(messages.closed())}
      </button>
      <button
        type="button"
        className={`f14Bold text-gray5 capitalize cursor-pointer hover:text-gray6 ${
          status === 'draft' ? 'underline' : ''
        }`}
        onClick={() => changeStatus('draft')}
      >
        {t(messages.draft())}
      </button>
    </div>
  )
}
