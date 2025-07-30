import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Switch,
  message,
  Card,
  Space,
  Spin,
} from 'antd'
import dayjs from 'dayjs';
import { api } from '../../utils/api';

const { Option } = Select

const InvitationForm = ({ id = null }) => {
  const [form] = Form.useForm()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const isEdit = Boolean(id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resumeRes = await api.get('resumes')
        setResumes(
          resumeRes.data.data.map((item) => ({
            label: item.first_name + ' ' + item.last_name,
            value: item.id,
          }))
        )

        if (isEdit) {
          const response = await api.get(`invitations/${id}`)
          const data = response.data
          form.setFieldsValue({
            ...data,
            date: data.date ? dayjs(data.date) : null,
            interview_date: data.interview_date
              ? dayjs(data.interview_date)
              : null,
          })
        }
      } catch (error) {
        console.error(error)
        message.error('Erreur lors du chargement des données')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchData()
  }, [id, isEdit, form])

  const onFinish = async (values) => {
    setLoading(true)
    const payload = {
      ...values,
      date: values.date?.format('YYYY-MM-DD'),
      interview_date: values.interview_date?.format('YYYY-MM-DD'),
    }

    try {
      if (isEdit) {
        await api.put(`invitations/${id}`, payload)
        message.success('Invitation mise à jour avec succès')
      } else {
        await api.post('invitations', payload)
        message.success('Invitation créée avec succès')
        form.resetFields()
      }
    } catch (error) {
      console.error(error)
      const errors = error.response?.data?.errors
      if (errors) {
        const firstKey = Object.keys(errors)[0]
        message.error(errors[firstKey][0])
      } else {
        message.error("Erreur lors de l'enregistrement")
      }
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Spin size='large' />
      </div>
    )
  }

  return (
    <Card>
      <Form
        form={form}
        // layout='vertical'
        onFinish={onFinish}
        initialValues={{ accepted: false }}
        className='space-y-4'
      >
        {/* Row with two inputs */}
        <div className='flex flex-col md:flex-row gap-4'>
          <Form.Item
            name='date'
            label='Date d’envoi'
            className='flex-1'
            rules={[{ required: true, message: 'Date obligatoire' }]}
          >
            <DatePicker className='w-full' size='large' format='YYYY-MM-DD' />
          </Form.Item>

          <Form.Item
            name='resume_id'
            label='CV concerné'
            className='flex-1'
            rules={[{ required: true, message: 'CV obligatoire' }]}
          >
            <Select
              options={resumes}
              placeholder='Sélectionnez un CV'
              size='large'
              showSearch
            ></Select>
          </Form.Item>
        </div>

        <div className='flex flex-col md:flex-row gap-4 w-full'>
          <Form.Item name='interview_date' className='w-full' label='Date d’entretien'>
            <DatePicker className='w-full' size='large' format='YYYY-MM-DD' />
          </Form.Item>

          <Form.Item
            name='type'
            label='Type d’invitation'
            className='w-full'
            rules={[{ required: true, message: 'Type obligatoire' }]}
          >
            <Select placeholder='Sélectionnez un type' size='large'>
              <Option value='1'>Email</Option>
              <Option value='2'>Téléphone</Option>
              <Option value='in_person'>En personne</Option>
            </Select>
          </Form.Item>
        </div>

        {/* <Form.Item name='accepted' label='Accepté' valuePropName='checked'>
          <Switch />
        </Form.Item>

        <Form.Item name='status' label='Statut'>
          <Input placeholder='Statut actuel' size='large' />
        </Form.Item> */}

        <Form.Item className='pt-4'>
          <Space>
            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
              size='large'
              className='min-w-32'
            >
              {isEdit ? 'Mettre à jour' : 'Créer'}
            </Button>
            <Button
              size='large'
              onClick={() => form.resetFields()}
              disabled={loading}
            >
              Réinitialiser
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default InvitationForm
