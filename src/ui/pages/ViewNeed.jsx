import React, { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { useParams } from 'react-router-dom'
import {
  message,
  Card,
  Descriptions,
  Tag,
  Table,
  Avatar,
  Spin,
  Typography,
  Badge,
  Tooltip,
  Button,
  Popconfirm,
} from 'antd'
import { UserOutlined, FileTextOutlined, MenuOutlined, QuestionCircleOutlined } from '@ant-design/icons'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Trash } from 'lucide-react'

const { Title, Text } = Typography

// Ligne draggable
const DraggableRow = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props['data-row-key'] })

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  }

  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  )
}

const ViewNeed = () => {
  const [need, setNeed] = useState({})
  const { id } = useParams()
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await api.get(`needs/${id}/resumes`)
      setNeed(response.data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
      message.error(
        error.response?.data?.message || 'Erreur lors de la récupération'
      )
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getGenderText = (gender) => {
    switch (gender) {
      case 1:
        return 'Homme'
      case 2:
        return 'Femme'
      default:
        return 'Non spécifié'
    }
  }

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <Badge status='success' text='Actif' />
    ) : (
      <Badge status='default' text='Inactif' />
    )
  }

  const deleteResume = async (need_resume_id) =>{
    try {
      const response = await api.delete(`needs/resume/${need_resume_id}/delete`)
      message.success(response.data.message);
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Erreur de supprimer le cv")
    }
  }

  // Colonnes du tableau
  const resumeColumns = [
    {
      title: '',
      key: 'sort',
      width: 40,
      render: () => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />,
    },
    {
      title: 'Ordre',
      key: 'order',
      width: 70,
      render: (_, __, index) => <Text strong>{index + 1}</Text>,
    },
    {
      title: 'Candidat',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text, record) => (
        <div className='flex items-center'>
          {/* <Avatar icon={<UserOutlined />} /> */}
          <div className='pl-3'>
            <div className='font-medium'>{text}</div>
            <div className='text-gray-500 text-sm'>{record.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Âge',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) =>
        new Date().getFullYear() -
        new Date(a.birth_date).getFullYear() -
        (new Date().getFullYear() - new Date(b.birth_date).getFullYear()),
      render: (_, record) => (
        <Text>
          <span className='font-bold text-lg'>
            {new Date().getFullYear() -
              new Date(record.birth_date).getFullYear()}
          </span>{' '}
          ans
        </Text>
      ),
    },
    {
      title: 'Sexe',
      key: 'gender',
      dataIndex: 'gender',
      filters: [
        { text: 'Homme', value: 1 },
        { text: 'Femme', value: 2 },
      ],
      onFilter: (value, record) => record.gender === value,
      render: (gender) => <Text>{getGenderText(gender)}</Text>,
    },

    {
      title: 'Diplôme',
      key: 'top_level',
      sorter: (a, b) =>
        (a.top_level?.coefficient || 0) - (b.top_level?.coefficient || 0),
      render: (_, record) => (
        <Tooltip title={record.top_level?.pivot?.name}>
          <Tag color='blue'>
            {record.top_level?.name || record.top_level?.name || 'N/A'}
          </Tag>
        </Tooltip>
      ),
    },

    {
      title: 'Expérience',
      dataIndex: 'experience_monthe',
      key: 'experience_monthe',
      sorter: (a, b) => a.experience_monthe - b.experience_monthe,
      render: (months) => (
        <Tag color='blue'>
          {Math.floor(months / 12)} ans {months % 12} mois
        </Tag>
      ),
    },
    {
      title: 'Ville',
      dataIndex: ['city', 'name'],
      key: 'city',
      filters: need.resumes
        ? [
          ...new Set(need.resumes.map((r) => r.city?.name).filter(Boolean)),
        ].map((cityName) => ({
          text: cityName,
          value: cityName,
        }))
        : [],
      onFilter: (value, record) => record.city?.name === value,
      render: (city) => city,
    },

    {
      title: 'Actions',
      dataIndex: ['city', 'name'],
      key: 'actions',
      render: (city) => <div className='flex gap-2'>
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={confirmDelete}
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        >
          <Button
            type="primary"
            danger
            icon={<Trash size={15} />}
            size="small"
          />
        </Popconfirm>
        <Tooltip title='Ajouter'>
          <Button
            type='primary'
            icon={<Plus size={15} />}
            size='small'
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          />
        </Tooltip>

      </div>,
    },
  ]

  // DnD config
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = need.resumes.findIndex((item) => item.id === active.id)
      const newIndex = need.resumes.findIndex((item) => item.id === over?.id)
      const newResumes = arrayMove(need.resumes, oldIndex, newIndex)

      // Met à jour le state local
      setNeed((prev) => ({ ...prev, resumes: newResumes }))

      // Envoie le nouvel ordre à l’API
      try {
        await api.post(`needs/${id}/resumes/order`, {
          order: newResumes.map((r, index) => ({
            resume_id: r.id,
            order: index + 1,
          })),
        })
        message.success('Ordre sauvegardé')
      } catch (error) {
        console.error(error)
        message.error('Erreur lors de la sauvegarde de l’ordre')
      }
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spin size='large' />
      </div>
    )
  }

  if (!need.id) {
    return <div className='text-center p-8'>Aucune donnée trouvée</div>
  }

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* <Card className='shadow-sm'>
          <div className='flex items-center justify-between'>
            <div>
              <Title level={4} className='mb-2 text-blue-600'>
                Besoin #{need.id}
              </Title>
              <Text className='text-xl text-gray-600'>
                Service : {need.service?.name}
              </Text>
            </div>
            <div className='text-right'>
              {getStatusBadge(need.status)}
              <div className='text-sm text-gray-500 mt-2'>
                Créé le : {new Date(need.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </Card> */}

        {/* <div className='mt-3'></div> */}

        <Card
          title={
            <div className='flex items-center space-x-2'>
              <FileTextOutlined />
              <div>
                <span>Besoin #{need.id}</span>
                <div className='text-xs text-gray-500'>
                  Créé le : {new Date(need.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          }
          className='shadow-sm h-full mt-3'
        >
          <Descriptions column={2} bordered size='small'>
            <Descriptions.Item label='Service'>
              {need.service?.name}
            </Descriptions.Item>

            <Descriptions.Item label='Responsible Person'>
              {need.responsible?.full_name}
            </Descriptions.Item>

            <Descriptions.Item label='Diplômes requis'>
              {need.levels?.length > 0 ? (
                <div className='space-y-3'>
                  {need.levels.map((level) => (
                    <Tooltip title={level.description}>
                      <Tag color='blue' className='text-lg'>
                        {level.name}
                      </Tag>
                    </Tooltip>
                  ))}
                </div>
              ) : (
                <Text type='secondary'>__</Text>
              )}
            </Descriptions.Item>

            <Descriptions.Item label='Expérience minimale'>
              <Tag color='green'>{need.experience_min} ans</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Tranche d'âge">
              {need.min_age} - {need.max_age} ans
            </Descriptions.Item>
            {need.gender ? 
            <Descriptions.Item label='Exigence de sexe'>
              {getGenderText(need.gender)}
            </Descriptions.Item> : null}
            
          {need.description ?
            <Descriptions.Item label='Description'>
              {need.description}
            </Descriptions.Item>
            : null}


            <Descriptions.Item label='État'>
              {getStatusBadge(need.status)}
            </Descriptions.Item>

            
            
          </Descriptions>
        </Card>

        <div className='shadow-sm bg-white rounded-xl overflow-hidden mt-3'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={need.resumes?.map((r) => r.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <Table
                className='whitespace-nowrap'
                components={{
                  body: {
                    row: DraggableRow,
                  },
                }}
                dataSource={need.resumes}
                scroll={{ x: 1200, y: 400 }}
                columns={resumeColumns}
                rowKey='id'
                pagination={false}
              />
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

export default ViewNeed
