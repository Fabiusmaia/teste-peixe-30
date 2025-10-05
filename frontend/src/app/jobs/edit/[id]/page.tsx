'use client'
import { toast } from 'react-toastify'
import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Form } from 'antd'
import {
  getJobById,
  updateJob,
  Job,
} from '../../../../services/jobs/jobsService'
import JobForm, { JobFormValues } from '../../components/JobForm'

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = params.id
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!jobId) return
    const loadJob = async () => {
      setLoading(true)
      try {
        const job = await getJobById(String(jobId))
        form.setFieldsValue({
          title: job.title,
          description: job.description,
          location: job.location,
          salaryRange: job.salaryRange,
          skills: job.skills.join(', '),
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadJob()
  }, [jobId, form])

  const handleSubmit = async (values: JobFormValues) => {
    setLoading(true)
    const job: Job = {
      title: values.title,
      description: values.description,
      location: values.location,
      salaryRange: values.salaryRange,
      skills: values.skills.split(',').map((s: string) => s.trim()),
    }

    try {
      await updateJob(String(jobId!), job)
      toast.success('Vaga editada com sucesso!')
      router.push('/jobs')
    } catch (err) {
      toast.error('Erro ao editar vaga. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <JobForm
      form={form}
      loading={loading}
      jobId={String(jobId)}
      onFinish={handleSubmit}
    />
  )
}
