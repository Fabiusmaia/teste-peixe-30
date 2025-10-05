'use client'
import { toast } from 'react-toastify'
import React, { useState } from 'react'
import { Candidate } from '@/services/jobs/jobsService'
import api from '../../../services/api'
import {
  Card,
  Typography,
  Button,
  Modal,
  Input,
  Tag,
  Space,
  message,
} from 'antd'

const { Text, Paragraph, Title } = Typography
const { TextArea } = Input

interface CandidateCardProps {
  candidate: Candidate
  jobId: string
  jobSkills: string[] 
  onInvited: () => void
}

export default function CandidateCard({
  candidate,
  jobId,
  jobSkills,
  onInvited,
}: CandidateCardProps) {
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [disqualifyReason, setDisqualifyReason] = useState('')

  const isInvited = candidate.invitedJobs?.includes(jobId)

  const handleInvite = async () => {
    setLoading(true)
    try {
      await api.post(`/jobs/${jobId}/invite/${candidate._id}`)
      toast.success('Candidato convidado com sucesso!')
      onInvited()
    } catch (err) {
      console.log(err)
      toast.error('Erro ao convidar candidato.')
    } finally {
      setLoading(false)
    }
  }

  const handleDisqualify = async () => {
    if (!disqualifyReason) {
      message.warning('Informe o motivo da desclassificação.')
      return
    }
    setLoading(true)
    try {
      await api.post(`/jobs/${jobId}/disqualify/${candidate._id}`, {
        reason: disqualifyReason,
      })
      toast.success('Candidato desqualificado com sucesso!')
      setIsModalOpen(false)
      setDisqualifyReason('')
      onInvited()
    } catch (err) {
      console.error(err)
      toast.error('Candidato convidado com sucesso!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card style={{ marginBottom: 16 }} bordered>
        <Title level={5}>{candidate.name}</Title>
        <Paragraph>
          <Text strong>Email:</Text> {candidate.email}
        </Paragraph>
        <Paragraph>
          <Text strong>Skills:</Text>{' '}
          {candidate.skills.map((skill) => {
            const isMatch = jobSkills.includes(skill)
            return (
              <Tag
                key={skill}
                color={isMatch ? 'green' : 'blue'}
                style={{ fontWeight: isMatch ? 'bold' : 'normal' }}
              >
                {skill}
              </Tag>
            )
          })}
        </Paragraph>
        <Paragraph>
          <Text strong>Experiência:</Text> {candidate.experienceYears} anos
        </Paragraph>
        <Paragraph>
          <Text strong>Score:</Text> {candidate.score}
        </Paragraph>

        <Space>
          {isInvited ? (
            <>
              <Button
                type="primary"
                danger
                onClick={() => setIsModalOpen(true)}
              >
                Desclassificar
              </Button>
              <Text type="secondary">Já convidado</Text>
            </>
          ) : (
            <Button type="primary" onClick={handleInvite} loading={loading}>
              Convidar
            </Button>
          )}
        </Space>
      </Card>

      <Modal
        title="Motivo da desclassificação"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleDisqualify}
        okText="Confirmar"
        cancelText="Cancelar"
        confirmLoading={loading}
      >
        <TextArea
          rows={4}
          value={disqualifyReason}
          onChange={(e) => setDisqualifyReason(e.target.value)}
          placeholder="Informe o motivo da desclassificação"
        />
      </Modal>
    </>
  )
}
