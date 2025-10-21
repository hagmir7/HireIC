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
  Modal,
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
import { Plus, Trash, Edit, Eye, MessageSquare, CircleAlert, MessageCircleCode, CircleCheck, Activity } from 'lucide-react'
import RightClickMenu from '../components/ui/RightClickMenu'
import { handleShow } from '../utils/config'

const { Title, Text } = Typography
const { confirm } = Modal

// Ligne draggable avec right-click
const DraggableRow = ({ onMenuClick, menuItems, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props['data-row-key'] })

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  }

  return (
    <RightClickMenu
      menuItems={menuItems || []}
      onItemClick={onMenuClick}
    >
      <tr
        {...props}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      />
    </RightClickMenu>
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
  }, []);

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

  const deleteResume = async (need_resume_id) => {
    try {
      const response = await api.delete(`needs/resume/${need_resume_id}/delete`)
      message.success(response.data.message || 'CV supprimé avec succès')
      fetchData()
    } catch (error) {
      console.error(error)
      message.error(error?.response?.data?.message || "Erreur de supprimer le cv")
    }
  }


  const createInvitation = async (resumeId) => {
    try {
      const response = await api.post('needs/invitation/create', { resume_id: resumeId, need_id: id })
      message.success("Invitation créée avec succès")
      fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || "Erreur de création d'invitation")
      console.error(error)
    }
  }

  const showDeleteConfirm = (needResumeId) => {
    confirm({
      title: 'Êtes-vous sûr de vouloir retirer ce CV du besoin ?',
      icon: <CircleAlert size={25} className='text-red-600 mt-1 mr-2' color='red' />,
      content: 'Cette action ne peut pas être annulée.',
      okText: 'Oui, retirez-le',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk() {
        deleteResume(needResumeId)
      },
    })
  }

  const newInvitationConfirm = (resumeId) => {
    confirm({
      title: 'Voulez-vous créer une nouvelle invitation ?',
      icon: <CircleAlert size={25} className='text-green-600 mt-1 mr-2' color='green' />,
      content: "Confirmez la création de l'invitation pour ce candidat.",
      okText: 'Oui, créer',
      okType: 'primary',
      cancelText: 'Annuler',
      onOk() {
        createInvitation(resumeId)
      },
    })
  }

  const handleMenuClick = (key, itemData) => {
    switch (key) {
      case 'view':
        handleShow(`view-resume/${itemData}`)
        break
      case 'edit':
        handleViewResume(itemData)
        break
      case 'newInvitation':
        newInvitationConfirm(itemData)
        break
      case 'delete':
        showDeleteConfirm(itemData)
        break
      default:
        break
    }
  }

  const handleViewResume = async (id) => {
    try {
      const isValidId = typeof id === 'string' || typeof id === 'number';
      const url = `/resume/create${isValidId ? `/${id}` : ''}`;
      if (window.electron && typeof window.electron.openShow === 'function') {
        await window.electron.openShow({ path: url, width: 1000, height: 800 });
      } else {
        navigate(`/layout${url}`);
      }
    } catch (error) {
      console.error('Error navigating to resume:', error);
    }
  };

  // Menu items for right-click
  const menuItems = (record) => [
    { label: 'Voir le CV', key: 'view', icon: <Eye size={15} />, id: record.id },
    { label: 'Modifier', key: 'edit', icon: <Edit size={15} />, id: record.id },
     
    // { label: 'Traçabilité', key: 'traceability', icon: <Activity size={15} />, id: record.id },
    { label: 'Nouvelle invitation', key: 'newInvitation', icon: <MessageSquare size={15} />, id: record.id },
    { type: 'divider' },
    { label: 'Retirer du besoin', key: 'delete', icon: <Trash size={15} />, danger: true, id: record.pivot?.id || record.id },
  ]

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
          <div className='pl-3'>
            <div className='font-medium'>{text}</div>
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
      title: 'Invitations',
      key: 'invitations',
      render: (_, record) => (
        <div className='flex gap-2 text-md font-semibold'>
          {record.invitations.length}
          {record.pivot.invitation_id ? (<CircleCheck className='text-green-500' size={20} />) : ''}
        </div>
      ),
    }
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

      // Envoie le nouvel ordre à l'API
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
        message.error("Erreur lors de la sauvegarde de l'ordre")
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
    <div className='p-6 bg-gray-50'>
      <div className='max-w-7xl mx-auto space-y-6'>

        <Card
          title={
            <div className='flex items-center space-x-2 w-full justify-between'>
              <div className="flex gap-2">
                <FileTextOutlined className='text-2xl' />
                <div>
                  <span>Besoin #{need.id}</span>
                  <div className='text-xs text-gray-500'>
                    Créé le : {new Date(need.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className='flex gap-2'>
                <Button
                  type="primary"
                  warning
                  icon={<MessageCircleCode size={20} className='mt-1' />}
                > Invitation pour tous</Button>
                <Button
                  type="primary"
                  danger
                  icon={<Trash size={15} />}
                >Supprimer</Button>
              </div>
            </div>
          }
          className='shadow-sm h-full w-full mt-3'
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
                    <Tooltip key={level.id} title={level.description}>
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
                    row: (props) => {
                      const record = need.resumes?.find(r => r.id === props['data-row-key'])
                      return (
                        <DraggableRow
                          {...props}
                          onMenuClick={handleMenuClick}
                          menuItems={record ? menuItems(record) : []}
                        />
                      )
                    },
                  },
                }}
                dataSource={need.resumes}
                scroll={{ x: 1200}}
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