'use client'
import { toast } from 'react-toastify'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form } from 'antd'
import { createJob, Job } from '../../../services/jobs/jobsService'
import JobForm, { JobFormValues } from '../components/JobForm'

export default function CreateJobPage() {
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

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
      await createJob(job)
      toast.success('Vaga criada com sucesso!')
      router.push('/jobs')
    } catch (err) {
      console.error(err)
      toast.error('Erro ao criar vaga. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return <JobForm form={form} loading={loading} onFinish={handleSubmit} />
}
