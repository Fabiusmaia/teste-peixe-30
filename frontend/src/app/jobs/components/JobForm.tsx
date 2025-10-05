'use client'
import React from 'react'
import { Form, Input, Button, Typography, FormInstance } from 'antd'

const { Title } = Typography
const { TextArea } = Input

type Props = {
  form: FormInstance<JobFormValues>
  loading: boolean
  jobId?: string
  onFinish: (values: JobFormValues) => void
}
export type JobFormValues = {
  title: string
  description: string
  location: string
  salaryRange: string
  skills: string
}

export default function JobForm({ form, loading, jobId, onFinish }: Props) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Title level={3}>{jobId ? 'Editar Vaga' : 'Criar Vaga'}</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={true}
      >
        <Form.Item
          label="Título"
          name="title"
          rules={[
            { required: true, message: 'Por favor, insira o título da vaga' },
          ]}
        >
          <Input placeholder="Título da vaga" />
        </Form.Item>

        <Form.Item
          label="Descrição"
          name="description"
          rules={[{ required: true, message: 'Por favor, insira a descrição' }]}
        >
          <TextArea rows={4} maxLength={800} placeholder="Descrição da vaga" />
        </Form.Item>

        <Form.Item
          label="Localização"
          name="location"
          rules={[
            { required: true, message: 'Por favor, insira a localização' },
          ]}
        >
          <Input placeholder="Localização" />
        </Form.Item>

        <Form.Item
          label="Faixa Salarial"
          name="salaryRange"
          rules={[
            { required: true, message: 'Por favor, insira a faixa salarial' },
          ]}
        >
          <Input placeholder="Ex: R$ 3.000 - R$ 5.000" />
        </Form.Item>

        <Form.Item label="Skills (separadas por vírgula)" name="skills">
          <Input placeholder="Ex: React, Node.js, TypeScript" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {jobId ? 'Atualizar' : 'Salvar'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
