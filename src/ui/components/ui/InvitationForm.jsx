import React, { useEffect, useState } from 'react'
import {
  Form,
  Select,
  Button,
  DatePicker,
  message,
  Card,
  Space,
  Spin,
} from 'antd'
import dayjs from 'dayjs';
import { api } from '../../utils/api';


const InvitationForm = ({ id = null, fetchItems }) => {
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
      date: values.date?.format('YYYY-MM-DD HH:mm:ss'),
      interview_date: values.interview_date?.format('YYYY-MM-DD HH:mm:ss'),
    }

    try {
      if (isEdit) {
        await api.put(`invitations/${id}`, payload)
        fetchItems()
        message.success('Invitation mise à jour avec succès')
      } else {
        await api.post('invitations', payload)
        message.success('Invitation créée avec succès')
        form.resetFields()
        fetchItems()
      }
    } catch (error) {
      console.error(error)
      const errors = error.response?.data?.errors
      if (errors) {
        const firstKey = Object.keys(errors)[0]
        message.error(errors[firstKey][0])
      } else {
        message.error(error.response.data.message, "Erreur lors de l'enregistrement")
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


  const invitationStatus = [
    { value: 1, label: "En attente" },
    { value: 2, label: "Entretien planifié" },
    { value: 3, label: "Appel manqué" },
    { value: 4, label: "Refusé" }
  ]

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
              disabled={id}
               filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            ></Select>
          </Form.Item>


          <Form.Item
            name='date'
            label='Date d’envoi'
            className='flex-1'
          >
             <DatePicker className='w-full' size='large' showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

    
        </div>

        <div className='flex flex-col md:flex-row gap-4 w-full'>
          <Form.Item name='interview_date' className='w-full' label='Date d’entretien'>
             <DatePicker className='w-full' size='large' showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name='type'
            label='Type d’invitation'
            className='w-full'
          >
            <Select
              placeholder='Sélectionnez un type'
              options={[{ value: 1, label: "En présentiel" },{ value: 2, label: "À distance" }]}
              size='large'
            >

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
