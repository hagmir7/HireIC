import React, { useEffect, useState } from 'react'
import { Button, Checkbox, message, Modal, Popconfirm, Select, Tag } from 'antd'
import { RefreshCcw, PlusCircle, Undo2, Trash, Edit } from 'lucide-react'
import { api } from '../utils/api'
import Skeleton from '../components/ui/Sketelon'
import InvitationForm from '../components/ui/InvitationForm'
import { formatDate } from '../utils/config'

const { Option } = Select

export default function Invitation() {
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [openResponsive, setOpenResponsive] = useState(false)
  const [editId, setEditId] = useState(null);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(data.map((item) => item.id))
    } else {
      setSelected([])
    }
  }

  const fetchData = async () => {
    setLoading(true)
    setOpenResponsive(false)
    try {
      const res = await api.get('invitations') // Adjust API route
      setData(res.data)
    } catch (error) {
      message.error(error.response?.data?.message || 'Erreur serveur')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const InvitationStatus = {
    0: { label: 'En attente', color: 'text-gray-600', bg: 'bg-gray-100' },
    1: { label: 'En cours', color: 'text-blue-600', bg: 'bg-blue-100' },
    2: { label: 'Annulé', color: 'text-red-600', bg: 'bg-red-100' },
    3: { label: 'Exécuté', color: 'text-green-600', bg: 'bg-green-100' },
  }

  const renderStatus = (statusCode) => {
    const status = InvitationStatus[statusCode]
    if (!status) return null
    return (
      <span
        className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${status.bg} ${status.color}`}
      >
        {status.label}
      </span>
    )
  }



  const deleteInvitation = async (invetation_id)=>{
    try {
      await api.delete(`invitations/${invetation_id}`)
      message.success("Invitation supprimée avec succès.")
      fetchData();
    } catch (error) {
      message.error(error.response.data.message);
    }
  }


  return (
    <div className='h-full flex flex-col bg-gray-50'>
      <div className='flex-shrink-0 bg-white border-b border-gray-200 shadow-sm'>
        <div className='p-4'>
          {/* Table Actions */}
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold text-gray-800'>Invitations</h2>
            <div className='flex gap-3 flex-wrap'>
              <Popconfirm
                title='Réinitialiser la commande'
                description='Êtes-vous sûr de vouloir réinitialiser cette tâche ?'
                okText='Réinitialiser'
                cancelText='Annuler'
              >
                <Button
                  danger
                  className='flex items-center gap-2 hover:shadow-md'
                >
                  Réinitialiser <Undo2 size={18} />
                </Button>
              </Popconfirm>

              <Button
                onClick={fetchData}
                className='flex items-center gap-2 hover:shadow-md'
              >
                {loading ? (
                  <RefreshCcw className='animate-spin h-4 w-4' />
                ) : (
                  <RefreshCcw className='h-4 w-4' />
                )}
                Rafraîchir
              </Button>

              <Button type='primary' onClick={() => setOpenResponsive(true)}>
                <PlusCircle className='h-4 w-4' />
                Créer
              </Button>

              <Modal
                title='Créer une invitation'
                centered
                open={openResponsive}
                onOk={() => setOpenResponsive(false)}
                onCancel={() => setOpenResponsive(false)}
                footer={null}
                width='60%'
              >
                <InvitationForm id={editId} fetchItems={fetchData} />
              </Modal>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className='flex-1 overflow-hidden'>
        <div className='mx-auto pt-4 h-full'>
          <div className='h-full'>
            <div className='bg-white border border-gray-200 h-full flex flex-col overflow-hidden'>
              <div className='flex-1 overflow-hidden'>
                <div className='w-full overflow-x-auto'>
                  <table className='min-w-[900px] w-full border-collapse'>
                    <thead className='sticky top-0 bg-gradient-to-b from-gray-50 to-gray-100  shadow-sm z-10'>
                      <tr>
                        <th className='px-2 py-2 border-r border-gray-200'>
                          <Checkbox
                            onChange={handleSelectAll}
                            checked={
                              selected.length === data.length && data.length > 0
                            }
                          />
                        </th>
                        <th className='px-2 py-2 whitespace-nowrap text-left text-sm font-semibold text-gray-600 border-r border-gray-200'>
                          Nom CV
                        </th>
                        <th className='px-2 py-2 whitespace-nowrap text-left text-sm font-semibold text-gray-600 border-r border-gray-200'>
                          Date d’envoi
                        </th>
                        <th className='px-2 py-2 whitespace-nowrap text-left text-sm font-semibold text-gray-600 border-r border-gray-200'>
                          Entretien
                        </th>
                        <th className='px-2 py-2 whitespace-nowrap text-left text-sm font-semibold text-gray-600 border-r border-gray-200'>
                          Accepté
                        </th>
                        <th className='px-2 py-2 whitespace-nowrap text-left text-sm font-semibold text-gray-600 border-r border-gray-200'>
                          Type
                        </th>
                        <th className='px-2 py-2 whitespace-nowrap text-left text-sm font-semibold text-gray-600 border-r border-gray-200'>
                          Statut
                        </th>
                        <th className='px-2 py-2 whitespace-nowrap text-left text-sm font-semibold text-gray-600 border-r border-gray-200'>
                          Créé le
                        </th>
                         <th className='px-2 py-2 whitespace-nowrap text-left text-sm font-semibold text-gray-600'>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white'>
                      {loading ? (
                        <Skeleton rows={3} columns={9} />
                      ) : data.length > 0 ? (
                        data.map((item, index) => (
                          <tr
                            key={item.id}
                            className={`border-b border-gray-200 hover:bg-blue-50 whitespace-nowrap ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className='px-2 py-1 border-r border-gray-200 whitespace-nowrap pl-3'>
                              <Checkbox checked={selected.includes(item.id)} onChange={(e) => {
                                if (e.target.checked) {
                                  setSelected([...selected, item.id]);
                                } else {
                                  setSelected(selected.filter(id => id !== item.id));
                                }
                              }}
                              />
                            </td>

                            <td className='px-2 py-1 text-sm border-r border-gray-200 whitespace-nowrap'>
                              <div className='font-medium text-gray-900'>
                                {item?.resume?.full_name}
                              </div>
                              <div className='text-xs text-gray-500'>
                                {item?.resume?.email}
                              </div>
                            </td>
                            <td className='px-2 py-1 text-sm border-r border-gray-200 whitespace-nowrap'>
                              {formatDate(item.date)}
                            </td>
                            <td className='px-2 py-1 text-sm border-r border-gray-200 whitespace-nowrap'>
                              {formatDate(item.interview_date)}
                            </td>
                            <td className='px-2 py-1 text-sm border-r border-gray-200 whitespace-nowrap'>
                              {item.accepted ? (
                                <Tag color='green'>Oui</Tag>
                              ) : (
                                <Tag color='red'>Non</Tag>
                              )}
                            </td>
                            <td className='px-2 py-1 text-sm border-r border-gray-200 whitespace-nowrap'>
                              {item.type === 1
                                ? 'En présentiel'
                                : 'À distance'
                              }
                            </td>
                            <td className='px-2 py-1 text-sm border-r border-gray-200 whitespace-nowrap'>
                              {renderStatus(item.status)}
                            </td>
                            <td className='px-2 py-1 text-sm'>
                              {formatDate(item.created_at)}
                            </td>
                             <td className='px-2 py-1 text-sm flex gap-2 pt-2 whitespace-nowrap'>
                               <Button onClick={()=>{
                                setEditId(item.id)
                                setOpenResponsive(true);
                               }} color="green" size="small" variant="solid" type="primary">
                                  <Edit className="h-4 w-4" />
                              </Button>
                              <Popconfirm
                                title="Supprimer l'invitation"
                                description="Êtes-vous sûr de vouloir supprimer cette invitation ?"
                                onConfirm={() => deleteInvitation(item.id)}
                              >
                                <Button color="red" size="small" variant="solid" type="primary">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </Popconfirm>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan='8' className='p-8 text-center'>
                            <div className='text-center'>
                              <svg
                                className='mx-auto h-12 w-12 text-gray-400'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={1}
                                  d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                                />
                              </svg>
                              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                                Aucune invitation trouvée
                              </h3>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
