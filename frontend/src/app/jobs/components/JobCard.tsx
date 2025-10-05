'use client'
import {toast} from 'react-toastify'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteJob, Job } from '../../../services/jobs/jobsService'
import { Card, Button, Typography, Popconfirm } from 'antd'

const { Text, Paragraph, Title } = Typography

type Props = {
  job: Job
  onDeleted?: () => void 
}

export default function JobCard({ job, onDeleted }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteJob(job._id as string)
      toast.success('Vaga deletada com sucesso!')
      if (onDeleted) {
        onDeleted() 
      } else {
        router.refresh() 
      }
    } catch (err) {
      console.log(err)
      toast.error('Erro ao deletar a vaga.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      title={<Title level={5}>{job.title}</Title>}
    >
      <Paragraph ellipsis={{ rows: 3 }}>{job.description}</Paragraph>
      <Text strong>Local: </Text>
      <Text>{job.location}</Text>
      <br />
      <Text strong>Salário: </Text>
      <Text>{job.salaryRange}</Text>
      <br />
      <Text strong>Skills: </Text>
      <Text>{job.skills.join(', ')}</Text>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <Button
          type="default"
          onClick={() => router.push(`/jobs/edit/${job._id}`)}
        >
          Editar
        </Button>

        <Popconfirm
          title="Deseja realmente deletar esta vaga?"
          onConfirm={handleDelete}
          okText="Sim"
          cancelText="Não"
        >
          <Button type="primary" danger loading={loading}>
            Deletar
          </Button>
        </Popconfirm>

        <Button
          type="primary"
          onClick={() => router.push(`/jobs/detail/${job._id}`)}
        >
          Ver Match
        </Button>
      </div>
    </Card>
  )
}
