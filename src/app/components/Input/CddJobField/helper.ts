import { ICddJobItem, IJobPackForm, ISkillForm, IUserJob, IUserJobDto } from '@/types/IJob'

export const transformDto = (data: IJobPackForm): IUserJobDto[] | undefined => {
  if (!data || !data.jobs || data.jobs.length <= 0) return undefined

  let reArr: IUserJobDto[] = []
  data.jobs.forEach((item: ICddJobItem) => {
    const { job, skills, otherSkills } = item

    if (job) {
      let _skills: ISkillForm[] = []

      if (skills && skills.length > 0) {
        _skills = skills.map((skill: ISkillForm) => {
          return { id: parseInt(`${skill.id}`) }
        })
      }
      reArr = [
        ...reArr,
        {
          departmentId: parseInt(`${data.department.id}`),
          sectionId: parseInt(`${job.id}`),
          skills: _skills,
          otherSkills
        }
      ]
    }
  })
  return reArr
}

export const convertToForm = (data: IUserJob[]): IJobPackForm | undefined => {
  if (data.length <= 0) return undefined

  const redata: IJobPackForm = {
    department: data[0].department,
    jobs: []
  }

  data.forEach(job => {
    redata.jobs?.push({
      job: job.section,
      skills: job.skills || [],
      otherSkills: job.otherSkills || ''
    })
  })

  return redata
}
// export const convertToForm = (data: ILangItemDto[]) => {
//     const newData = data.map(item => {
//       const { langaugeId, languageCompetency, languageProficiency } = item

//       const lang = Languages.find(item => item.code === langaugeId)
//       const _langCompetency = convertTxtToObj(languageCompetency)

//       return {
//         lang: { text: lang?.name || 'English', value: lang?.code || 'en' },
//         oral: _langCompetency === undefined ? true : _langCompetency.oral === undefined ? false : _langCompetency.oral,
//         written:
//           _langCompetency === undefined ? false : _langCompetency.written === undefined ? false : _langCompetency.written,
//         level: languageProficiency
//       }
//     })

//     return {
//       langItem: newData
//     }
//   }
