import { IUserJob } from '@/types/IJob'

export const getJobsInObj = (data: IUserJob[]): string => {
  const _arr = data.map(item => item.section.title)
  return _arr.join(', ')
}
