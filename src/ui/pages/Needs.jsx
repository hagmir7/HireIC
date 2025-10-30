import React, { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { Button, Checkbox, message, Modal, Popconfirm, Select } from 'antd'
import { PlusCircle, RefreshCcw, Undo2 } from 'lucide-react'
import Skeleton from '../components/ui/Sketelon'
import NeedForm from '../components/NeedForm'
import { formatDate } from '../utils/config'
import { useNavigate } from 'react-router-dom'

const Needs = () => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(0);
  const navigate = useNavigate();

  const [openResponsive, setOpenResponsive] = useState(false)
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(data.map((item) => item.id))
    } else {
      setSelected([])
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get(`needs?status=${statusFilter}`)
      setData(res.data)
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Erreur serveur');
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [statusFilter])

  const handleShow = async (need_id) => {
    try {

      const url = `needs/view/${need_id}`
      if (window.electron && typeof window.electron.openShow === 'function') {
        await window.electron.openShow({ path: url, width: 1300, height: 750 })
      } else {
        navigate(`/layout/${url}`)
      }
    } catch (error) {
      console.error('Error navigating to resume:', error)
    }
  }


  const updateStatus = async (need_id, value) => {
    try {
      const response = await api.post(`needs/${need_id}/update-status`, {
        status: value
      })
      message.success("Le besoin est édité avec succès")
    } catch (error) {
      message.error(error.response.data.message || "Erreur de modifier le besoin")
    }
  }

  return (
    <div className='h-full flex flex-col bg-gray-50'>
      <div className='bg-white border-b border-gray-200 shadow-sm'>
        <div className='p-4'>
          {/* Document Info Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
            {[
              {
                label: 'En attente',
                value: '0',
              },
              {
                label: 'En cours',
                value: '0',
              },
              {
                label: 'Annulé',
                value: '0',
              },
              {
                label: 'Exécuté',
                value: '0',
              },
            ].map(({ label, value }, idx) => (
              <div
                key={idx}
                className='bg-white border border-gray-200 rounded-lg p-2 shadow-sm'
              >
                <div className='flex flex-col gap-2'>
                  <span className='text-sm text-gray-500 uppercase tracking-wider font-medium'>
                    <span className='text-lg font-semibold text-gray-900'>
                      {value}
                    </span>{' '}
                    {'  '}
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Table Header Controls */}
          <div className='flex justify-between items-center'>
            <h2 className='text-lg font-semibold text-gray-800'>Besoins</h2>
            <div className='flex gap-3'>
              {/* Fixed: Added proper JSX syntax with curly braces */}
              {Number(data?.docentete?.document?.status_id) < 8 && (
                <Popconfirm
                  title='Réinitialiser la commande'
                  description='Êtes-vous sûr de vouloir réinitialiser cette tâche ?'
                  okText='Réinitialiser'
                  cancelText='Annuler'
                >
                  <Button
                    danger
                    className='flex items-center gap-2 hover:shadow-md transition-shadow'
                  >
                    Réinitialiser <Undo2 size={18} />
                  </Button>
                </Popconfirm>
              )}

              {/* <Select placeholder='Transférer vers' style={{ width: 200 }} /> */}

              <Button
                onClick={fetchData}
                className='flex items-center gap-2 hover:shadow-md transition-shadow'
              >
                {loading ? (
                  <RefreshCcw className='animate-spin h-4 w-4 [animation-direction:reverse]' />
                ) : (
                  <RefreshCcw className='h-4 w-4' />
                )}
                Rafraîchir
              </Button>

              <Select
                style={{ width: 200 }}
                placeholder="Filtre d'état"
                onChange={(value) => setStatusFilter(value)}
                options={[
                  { label: 'Toute', value: 0 },
                  { label: 'En attente', value: 1 },
                  { label: 'En cours', value: 2 },
                  { label: 'Annulé', value: 3 },
                  { label: 'Exécuté', value: 4 },
                ]}
              />
              {/* Responsive */}
              <Button type='primary' onClick={() => setOpenResponsive(true)}>
                <PlusCircle className='h-4 w-4' />
                Créer
              </Button>
              <Modal
                title='Créer un nouveau besoin'
                centered
                open={openResponsive}
                onOk={() => setOpenResponsive(false)}
                onCancel={() => setOpenResponsive(false)}
                width={{
                  xs: '90%',
                  sm: '80%',
                  md: '70%',
                  lg: '60%',
                  xl: '70%',
                  xxl: '60%',
                }}
              >
                <NeedForm fetchData={fetchData} />
              </Modal>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 overflow-hidden'>
        <div className='mx-auto pt-4 h-full'>
          {/* Desktop Table */}
          <div className='h-full'>
            <div className='bg-white border border-gray-200 h-full flex flex-col overflow-hidden'>
              <div className='flex-1 overflow-hidden'>
                <div className='w-full overflow-x-auto'>
                  <table className="min-w-full text-sm border-t border-gray-300 table-fixed">
                    <thead className="bg-gray-100 whitespace-nowrap">
                      <tr>
                        <th className="w-[40px] px-2 py-1 text-left">
                          <Checkbox
                            onChange={handleSelectAll}
                            checked={
                              selected.length === data?.doclignes?.length &&
                              data?.doclignes?.length > 0
                            }
                          />
                        </th>
                        <th className="w-[160px] px-3 py-2 text-left">Service</th>
                        <th className="w-[160px] px-3 py-2 text-left">Responsable</th>
                        <th className="w-[120px] px-3 py-2 text-left">Diplôme</th>
                        <th className="w-[120px] px-3 py-2 text-left">Min Expérience</th>
                        <th className="w-[150px] px-3 py-2 text-left">État</th>
                        <th className="w-[150px] px-3 py-2 text-left">Créé le</th>
                      </tr>
                    </thead>

                    <tbody className="bg-white border-b border-gray-300 hover:bg-gray-50 whitespace-nowrap">
                      {loading ? (
                        <Skeleton rows={3} columns={7} />
                      ) : data?.length > 0 ? (
                        data.map((item, index) => (
                          <tr
                            key={index}
                            className={`border-t border-gray-300 hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }`}
                          >
                            <td className="px-2 py-1 text-left">
                              <Checkbox />
                            </td>

                            <td
                              className="px-3 py-2 truncate cursor-pointer"
                              onClick={() => handleShow(item.id)}
                            >
                              {item?.service?.name}
                            </td>

                            <td className="px-3 py-2 truncate">
                              {item?.responsible?.full_name}
                            </td>

                            <td className="px-3 py-2 truncate">{item?.level?.name}</td>

                            <td className="px-3 py-2 truncate">
                              {item.experience_min ? `${item.experience_min} mois` : "Pas nécessaire"}
                            </td>

                            <td className="px-3 py-2">
                              <Select
                                style={{ width: "100%" }}
                                defaultValue={item.status}
                                size="small"
                                onChange={(value) => updateStatus(item.id, value)}
                                options={[
                                  { label: "En attente", value: 1 },
                                  { label: "En cours", value: 2 },
                                  { label: "Annulé", value: 3 },
                                  { label: "Exécuté", value: 4 },
                                ]}
                              />
                            </td>

                            <td className="px-3 py-2 text-gray-700">
                              {formatDate(item.created_at)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="p-8 text-center text-gray-500">
                            Aucun besoin trouvé
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

export default Needs
