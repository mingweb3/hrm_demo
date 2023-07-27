import { itemsPerPageDefault } from '@/app/components/WTable'
import {
  IDepartment,
  IDepartmentForm,
  IDepartments,
  IDivision,
  IDivisionForm,
  IDivisions,
  ISection,
  ISectionForm,
  ISections,
  ISkill
} from '@/types/IJob'
import clientRequest from '@/utils/Request'

/* **
JOB: DIVISION
.
This block of code defines four functions:
- getDivisionFn: a function that makes an asynchronous GET request to the server to retrieve a list of divisions.
It takes two optional arguments: searchParams (an object that contains search parameters to be passed to the server) and signal (an AbortSignal object that can be used to cancel the request).
It returns a Promise that resolves to an array of divisions.
- createDivisionFn: a function that makes an asynchronous POST request to the server to create a new division. It takes one argument: body (an object that contains the division's data). It returns a Promise that resolves to the created division object.
- updateDivisionFn: a function that makes an asynchronous PUT request to the server to update an existing division. It takes two arguments: id (a string representing the division's ID) and body (an object that contains the division's updated data). It returns a Promise that resolves to the updated division object.
- removeDivisionFn: a function that makes an asynchronous DELETE request to the server to remove a division. It takes one argument: id (a string representing the division's ID). It returns a Promise that resolves to the response from the server.

The code block also sets default query parameters for the getDivisionFn function and merges them with any additional searchParams that may be passed in. It uses the Axios clientRequest library to make HTTP requests to the server.
**
*/
export const getDivisionFn = async (searchParams?: URLSearchParams, signal?: AbortSignal): Promise<any> => {
  // Default Query Params
  const paramQuery: any = {
    'page[number]': 1,
    'page[size]': 500, // itemsPerPageDefault
    sort: 'title'
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  const response = await clientRequest.get<IDivisions>('/divisions', {
    params: paramQuery,
    signal
  })
  return response.data
}

export const createDivisionFn = async (body: IDivisionForm): Promise<IDivision> => {
  const response = await clientRequest.post('/divisions', body)
  return response.data?.data
}

export const updateDivisionFn = async (id: string, body: IDivisionForm): Promise<IDivision> => {
  const response = await clientRequest.put(`/divisions/${id}`, body)
  return response.data?.data
}

export const removeDivisionFn = async (id: string) => {
  const response = await clientRequest.delete(`/divisions/${id}`)
  return response
}

export const getDivisionByIdFn = async (id: string, signal?: AbortSignal): Promise<IDivision> => {
  const response = await clientRequest.get(`/divisions/${id}`, {
    signal
  })
  return response.data?.data
}

/* **
  JOB: Departments
  API - CRUD
** */
export const getDepartmentFn = async (searchParams?: URLSearchParams, signal?: AbortSignal): Promise<any> => {
  // Default Query Params
  const paramQuery: any = {
    include: 'sections,division,skills',
    'page[number]': 1,
    'page[size]': itemsPerPageDefault, // itemsPerPageDefault
    sort: 'categoryTitle'
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  const response = await clientRequest.get<IDepartments>('/department', {
    params: paramQuery,
    signal
  })
  return response.data
}

export const createDepartmentFn = async (body: IDepartmentForm): Promise<IDepartment> => {
  const response = await clientRequest.post('/department', body)
  return response.data?.data
}

export const getDepartmentByIdFn = async (id: string, signal?: AbortSignal): Promise<any> => {
  const paramQuery: Record<string, string> = {
    include: 'sections,division,skills'
  }

  const response = await clientRequest.get<IDepartment>(`/department/${id}`, {
    params: paramQuery,
    signal
  })
  return response.data
}

export const updateDepartmentFn = async (id: string, body: IDepartmentForm): Promise<IDepartment> => {
  const response = await clientRequest.put(`/department/${id}`, body)
  return response.data?.data
}

export const removeDepartmentFn = async (id: string) => {
  const response = await clientRequest.delete(`/department/${id}`)
  return response
}

/* **
  JOB: Section
  API - CRUD
** */
export const getSectionFn = async (searchParams?: URLSearchParams, signal?: AbortSignal): Promise<any> => {
  // Default Query Params
  const paramQuery: any = {
    'page[number]': 1,
    'page[size]': itemsPerPageDefault, // itemsPerPageDefault
    sort: 'title'
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  const response = await clientRequest.get<ISections>('/sections', {
    params: paramQuery,
    signal
  })
  return response.data
}

export const createSectionFn = async (body: ISectionForm): Promise<ISection> => {
  const response = await clientRequest.post('/sections', body)
  return response.data?.data
}

export const updateSectionFn = async (id?: string, body?: ISectionForm): Promise<ISection> => {
  const response = await clientRequest.put(`/sections/${id}`, body)
  return response.data?.data
}

export const removeSectionFn = async (id: string) => {
  const response = await clientRequest.delete(`/sections/${id}`)
  return response
}

export const getSectionByIdFn = async (id: string, signal?: AbortSignal): Promise<ISection> => {
  const response = await clientRequest.get(`/sections/${id}`, {
    signal
  })
  return response.data?.data
}

/**
 * * SKILLS */
export const getSkillsFn = async (searchParams?: URLSearchParams, signal?: AbortSignal): Promise<any> => {
  // Default Query Params
  const paramQuery: any = {
    'page[number]': 1,
    'page[size]': itemsPerPageDefault, // itemsPerPageDefault
    sort: 'title'
  }

  searchParams?.forEach((value, key) => {
    paramQuery[key] = value
  })

  const response = await clientRequest.get<ISections>('/skills', {
    params: paramQuery,
    signal
  })
  return response.data
}

export const addSkillFn = async (id: string, body: string[]): Promise<ISkill[]> => {
  const response = await clientRequest.post(`/sections/${id}/skills`, { skills: body })
  return response.data?.data
}

export const removeSkillFn = async (id: string) => {
  const response = await clientRequest.delete(`/skills/${id}`)
  return response
}
