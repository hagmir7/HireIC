import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Switch,
  message,
  Card,
  Divider,
  Space,
  Spin,
} from 'antd'
import axios from 'axios'
import { api } from '../utils/api'

const { Option } = Select
const { TextArea } = Input

const NeedForm = () => {
  const [form] = Form.useForm()
  const [services, setServices] = useState([])
  const [users, setUsers] = useState([])
  const [levels, setLevels] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true)
      try {
        const [servicesRes, usersRes, levelsRes, skillsRes] = await Promise.all(
          [
            api.get('services'),
            api.get('users'),
            api.get('levels'),
            api.get('skills'),
          ]
        )

        setServices(servicesRes.data || [])
        setUsers(usersRes.data || [])
        setLevels(levelsRes.data || [])
        setSkills(skillsRes.data || [])
      } catch (error) {
        console.error('Échec de récupération des données :', error)
        message.error(
          'Échec du chargement du formulaire. Veuillez actualiser la page.'
        )
      } finally {
        setInitialLoading(false)
      }
    }

    fetchData()
  }, [])

  const validateAgeRange = (rule, value) => {
    const minAge = form.getFieldValue('min_age')
    const maxAge = form.getFieldValue('max_age')

    if (minAge && maxAge && minAge >= maxAge) {
      return Promise.reject(
        new Error('L’âge maximum doit être supérieur à l’âge minimum')
      )
    }
    return Promise.resolve()
  }

  const onFinish = async (values) => {
    setLoading(true)
    console.log(values)
    try {
      await api.post('needs', values)
      message.success('Besoin créé avec succès !')
      form.resetFields()
    } catch (error) {
      console.error('Erreur de soumission du formulaire :', error)

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        const firstError = errors[firstErrorKey]
        message.error(Array.isArray(firstError) ? firstError[0] : firstError)
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message)
      } else {
        message.error('Échec de la création du besoin. Veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Échec :', errorInfo)
    message.error('Veuillez vérifier tous les champs obligatoires')
  }

  if (initialLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Spin size='large' />
      </div>
    )
  }

  return (
    <Card>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{ status: true }}
        className='space-y-4'
      >
        {/* Section Service et Responsable */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          <Form.Item
            name='service_id'
            label='Service'
            rules={[
              { required: true, message: 'Veuillez sélectionner un service' },
            ]}
          >
            <Select
              placeholder='Sélectionnez un service'
              size='large'
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {services.map((service) => (
                <Option key={service.id} value={service.id}>
                  {service.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name='responsable_id'
            label='Responsable'
            rules={[
              {
                required: true,
                message: 'Veuillez sélectionner un responsable',
              },
            ]}
          >
            <Select
              placeholder='Sélectionnez un responsable'
              size='large'
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.full_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Section Exigences */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          <Form.Item
            name='level_id'
            label='Niveau requis'
            rules={[
              { required: true, message: 'Veuillez sélectionner un niveau' },
            ]}
          >
            <Select
              placeholder='Sélectionnez un niveau requis'
              size='large'
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {levels.map((level) => (
                <Option key={level.id} value={level.id}>
                  {level.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name='experience_min'
            label='Expérience minimale (années)'
            rules={[
              {
                required: true,
                message: 'Veuillez saisir une expérience minimale',
              },
              {
                type: 'number',
                min: 0,
                message: "L'expérience ne peut pas être négative",
              },
            ]}
          >
            <InputNumber
              className='w-full'
              min={0}
              max={50}
              size='large'
              placeholder='0'
            />
          </Form.Item>

          <Form.Item
            name='gender'
            label='Sexe préféré'
            rules={[
              {
                required: true,
                message: 'Veuillez sélectionner une préférence de sexe',
              },
            ]}
          >
            <Select
              placeholder='Sélectionnez une préférence de sexe'
              size='large'
            >
              <Option value='1'>Homme</Option>
              <Option value='2'>Femme</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name='status'
            label='Statut actif'
            valuePropName='checked'
            extra='Activer/Désactiver ce besoin'
          >
            <Switch size='default' />
          </Form.Item>
        </div>

        {/* Section Âge */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          <Form.Item
            name='min_age'
            label='Âge minimum'
            rules={[
              { required: true, message: 'Veuillez entrer l’âge minimum' },
              {
                type: 'number',
                min: 16,
                max: 100,
                message: 'L’âge doit être compris entre 16 et 100 ans',
              },
              { validator: validateAgeRange },
            ]}
          >
            <InputNumber
              className='w-full'
              min={16}
              max={100}
              size='large'
              placeholder='18'
            />
          </Form.Item>

          <Form.Item
            name='max_age'
            label='Âge maximum'
            rules={[
              { required: true, message: 'Veuillez entrer l’âge maximum' },
              {
                type: 'number',
                min: 16,
                max: 100,
                message: 'L’âge doit être compris entre 16 et 100 ans',
              },
              { validator: validateAgeRange },
            ]}
          >
            <InputNumber
              className='w-full'
              min={16}
              max={100}
              size='large'
              placeholder='65'
            />
          </Form.Item>
        </div>

        {/* Section Compétences et Description */}
        <Form.Item
          name='skills'
          label='Compétences requises'
          extra='Sélectionnez plusieurs compétences si nécessaire'
        >
          <Select
            mode='multiple'
            placeholder='Sélectionnez les compétences requises'
            size='large'
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            maxTagCount='responsive'
          >
            {skills.map((skill) => (
              <Option key={skill.id} value={skill.id}>
                {skill.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name='description'
          label='Description du poste'
          rules={[
            {
              max: 1000,
              message: 'La description ne peut pas dépasser 1000 caractères',
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder='Fournissez une description détaillée du poste, des responsabilités et des attentes...'
            showCount
            maxLength={1000}
          />
        </Form.Item>

        {/* Section Soumission */}
        <Form.Item className='mb-0 pt-4'>
          <Space>
            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
              size='large'
              className='min-w-32'
            >
              {loading ? 'Création en cours...' : 'Créer le besoin'}
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

export default NeedForm
