'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pagination, Input } from 'antd'
import JobCard from './components/JobCard'
import { getJobs, PaginatedJobs } from '../../services/jobs/jobsService'

export default function JobsPage() {
  const router = useRouter()

  const [jobsData, setJobsData] = useState<PaginatedJobs>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  })
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const fetchJobs = async (page = 1, pageSize = 10, searchTerm = '') => {
    setLoading(true)
    try {
      const data = await getJobs({ page, limit: pageSize, search: searchTerm })
      setJobsData(data)
    } catch (error) {
      console.error('Erro ao buscar vagas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs(jobsData.page, jobsData.pageSize, search)
  }, [])

  const handlePageChange = (page: number, pageSize?: number) => {
    fetchJobs(page, pageSize || jobsData.pageSize, search)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    fetchJobs(1, jobsData.pageSize, value) 
  }

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Vagas</h1>
        <button
          onClick={() => router.push('/jobs/add')}
          className="bg-green-600 text-white cursor-pointer px-4 py-2 rounded hover:bg-green-700"
        >
          Criar Vaga
        </button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Buscar por título ou localização"
          value={search}
          onChange={handleSearch}
          allowClear
        />
      </div>

      {loading ? (
        <p>Carregando vagas...</p>
      ) : jobsData.data && jobsData.data.length > 0 ? (
        <>
          {jobsData.data.map((job) => (
            <JobCard key={job._id} job={job} onDeleted={fetchJobs} />
          ))}

          <div className="flex justify-center mt-6">
            <Pagination
              current={jobsData.page}
              pageSize={jobsData.pageSize}
              total={jobsData.total}
              onChange={(page, pageSize) => handlePageChange(page, pageSize)}
              showSizeChanger
              pageSizeOptions={['5', '10', '20', '50']}
            />
          </div>
        </>
      ) : (
        <p>Nenhuma vaga encontrada.</p>
      )}
    </div>
  )
}
