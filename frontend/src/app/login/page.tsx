'use client'
import { toast } from 'react-toastify'
import React, { useState, useContext } from 'react'
import { Form, Input, Button, Card, Typography } from 'antd'
import { AuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'

const { Title, Text } = Typography

const LoginPage: React.FC = () => {
  const { login } = useContext(AuthContext)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    try {
      await login(values.email, values.password)
      toast.success('Login realizado com sucesso!')
      router.push('/jobs')
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>
      const message = error.response?.data?.message || 'Erro ao logar'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card style={{ width: 400 }}>
        <Title level={2} className="text-center">
          Login
        </Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Digite seu email' }]}
          >
            <Input placeholder="seu@email.com" />
          </Form.Item>
          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Digite sua senha' }]}
          >
            <Input.Password placeholder="Sua senha" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage
