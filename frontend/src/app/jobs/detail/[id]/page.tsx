'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import {
  Candidate,
  getJobById,
  getJobMatches,
  Job,
} from '../../../../services/jobs/jobsService'
import CandidateCard from '../../components/CandidateCard'
import { Card, Typography, Divider, Spin, Space } from 'antd'

const { Title, Text, Paragraph } = Typography

export default function JobDetailPage() {
  const { id } = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMatches = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const [jobData, matchesData] = await Promise.all([
        getJobById(String(id)),
        getJobMatches(String(id)),
      ])

      setJob(jobData)

      const candidatesArray: Candidate[] = Array.isArray(matchesData)
        ? matchesData
        : matchesData?.matches || []

      setCandidates(candidatesArray)
    } catch (err) {
      console.error('Erro ao buscar vaga ou candidatos:', err)
      setCandidates([])
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchMatches()
  }, [fetchMatches])

  if (!job) return <Spin tip="Carregando vaga..." className="my-6" />

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <Title level={3}>{job.title}</Title>
        <Paragraph>{job.description}</Paragraph>
        <Space direction="vertical" size={4}>
          <Text strong>Local:</Text> <Text>{job.location}</Text>
          <Text strong>Salário:</Text> <Text>{job.salaryRange}</Text>
          <Text strong>Skills:</Text> <Text>{job.skills.join(', ')}</Text>
        </Space>

        <Divider />

        <Title level={4}>Candidatos Compatíveis</Title>

        {loading ? (
          <Spin tip="Carregando candidatos..." className="my-4" />
        ) : candidates.length > 0 ? (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {candidates.map((candidate) => (
              <CandidateCard
                jobSkills={job.skills}
                key={candidate._id}
                candidate={candidate}
                jobId={String(id)}
                onInvited={fetchMatches}
              />
            ))}
          </Space>
        ) : (
          <Text>Nenhum candidato compatível encontrado.</Text>
        )}
      </Card>
    </div>
  )
}
