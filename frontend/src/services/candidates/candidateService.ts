import api from "../api"

export interface Candidate {
  id: string
  name: string
  email: string
  skills: string[]
  experienceYears: number
  score: number
  invited: boolean
}

export const getCandidates = async (): Promise<Candidate[]> => {
  const response = await api.get('/candidates')
  return response.data
}

export const inviteCandidate = async (id: string): Promise<void> => {
  await api.patch(`/candidates/${id}/invite`)
}
