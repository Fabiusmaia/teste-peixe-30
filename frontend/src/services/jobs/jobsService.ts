import api from '../api'

export type Job = {
  _id?: string
  title: string
  description: string
  location: string
  salaryRange: string
  skills: string[]
  createdAt?: string
  invitedCandidates?: string[]
}

export type Candidate = {
  _id: string
  name: string
  email: string
  skills: string[]
  experienceYears: number
  score: number
  createdAt: string
  invitedJobs?: string[]
}

export interface PaginatedJobs {
  data: Job[]
  total: number
  page: number
  pageSize: number
}


export const getJobs = async ({
  page = 1,
  limit = 10,
  search,
  sortCol,
}: {
  page?: number
  limit?: number
  search?: string
  sortCol?: string
}): Promise<PaginatedJobs> => {
  const params: Record<string, string | number> = { page, limit }
  if (search) params.search = search
  if (sortCol) params.sortCol = sortCol

  const response = await api.get('/jobs', { params })
  return response.data
}

export const createJob = async (job: Job): Promise<Job> => {
  const response = await api.post('/jobs', job)
  return response.data
}

export const updateJob = async (id: string, job: Job): Promise<Job> => {
  const response = await api.put(`/jobs/${id}`, job)
  return response.data
}

export const getJobById = async (id: string): Promise<Job> => {
  const response = await api.get(`/jobs/${id}`)
  return response.data
}

export const inviteCandidate = async (jobId: string, candidateId: string) => {
  const response = await api.post(`/jobs/${jobId}/invite/${candidateId}`)
  return response.data
}

export const deleteJob = async (id: string): Promise<void> => {
  await api.delete(`/jobs/${id}`)
}

export const getJobMatches = async (
  jobId: string,
): Promise<{ matches: Candidate[]; invited: Candidate[] }> => {
  const response = await api.get(`/jobs/${jobId}/matches`)
  return response.data
}
