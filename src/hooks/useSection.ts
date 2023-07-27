import { useState } from 'react'
import { getSectionByIdFn } from '@/apis/division.api'
import { ISectionForm } from '@/types/IJob'

const useSection = (): {
  section: ISectionForm | undefined
  getSectionById: (divisionId: string) => void
} => {
  const [section, setSetion] = useState<ISectionForm | undefined>()

  const getSectionById = async (id: string) => {
    if (id) {
      const data = await getSectionByIdFn(id)
      if (data) {
        setSetion({ id: data.id, title: data.attributes.title })
      } else {
        setSetion(undefined)
      }
    }
  }

  return {
    section,
    getSectionById
  }
}

export default useSection
