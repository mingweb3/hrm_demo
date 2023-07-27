import { useState } from 'react'
import { getDivisionByIdFn } from '@/apis/division.api'
import { IDivisionForm } from '@/types/IJob'

const useDivision = (): {
  division: IDivisionForm | undefined
  getDivision: (divisionId: string) => void
} => {
  const [division, setDivision] = useState<IDivisionForm | undefined>()

  const getDivision = async (divisionId: string) => {
    if (divisionId) {
      const data = await getDivisionByIdFn(divisionId)
      if (data) {
        setDivision({ id: data.id, title: data.attributes.title })
      } else {
        setDivision(undefined)
      }
    }
  }

  return {
    division,
    getDivision
  }
}

export default useDivision
