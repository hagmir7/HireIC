import React, { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { Button, Checkbox, message, Modal, Popconfirm, Select, Tag } from 'antd'
import { ArrowRight, PlusCircle, RefreshCcw, Undo2 } from 'lucide-react' // Added missing Undo2 import
import Skeleton from '../components/ui/Sketelon'
import NeedForm from '../components/NeedForm'

const Needs = () => {
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [transferSpin, setTransferSpin] = useState(false)
  const [data, setData] = useState([])

   const [openResponsive, setOpenResponsive] = useState(false)
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(data.map((item) => item.id))
    } else {
      setSelected([])
    }
  }

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get('needs')
      setData(res.data)
      console.log(res.data);
      
    } catch (error) {
      message.error(error.response?.data?.message || 'Erreur serveur')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const transfer = () => {
    setTransferSpin(true)
    setTimeout(() => setTransferSpin(false), 1500)
  }

  return (
    <div className='h-full flex flex-col bg-gray-50'>
      <div className='flex-shrink-0 bg-white border-b border-gray-200 shadow-sm'>
        <div className='max-w-7xl mx-auto p-4'>
          {/* Header */}
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center space-x-3'>
              <h1 className='text-md font-bold text-gray-900 flex gap-3 items-center'>
                <span>Title</span>

                {data?.docentete?.document && (
                  <Tag>{data?.docentete?.document?.status.name}</Tag>
                )}
              </h1>
            </div>
            <div className='flex gap-3'>
              <Button
                onClick={fetchData} // Fixed: uncommented onClick
                className='flex items-center gap-2 hover:shadow-md transition-shadow'
              >
                {loading ? (
                  <RefreshCcw className='animate-spin h-4 w-4' />
                ) : (
                  <RefreshCcw className='h-4 w-4' />
                )}
                Rafraîchir
              </Button>
            </div>
          </div>

          {/* Document Info Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
            {[
              {
                label: 'Client',
                value: 'This is the ref',
              },
              {
                label: 'Référence',
                value: 'Ref',
              },
              {
                label: 'Expédition',
                value: 'Test Exp',
              },
              {
                label: 'Type de document',
                value: 'Doc type',
              },
            ].map(({ label, value }, idx) => (
              <div
                key={idx}
                className='bg-white border border-gray-200 rounded-lg p-2 shadow-sm'
              >
                <div className='flex flex-col gap-2'>
                  <span className='text-sm text-gray-500 uppercase tracking-wider font-medium'>
                    {label}
                  </span>
                  <span className='text-sm font-semibold text-gray-900'>
                    {value || <Skeleton />}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Table Header Controls */}
          <div className='flex justify-between items-center'>
            <h2 className='text-md font-semibold text-gray-800'>Articles</h2>
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

              <Select placeholder='Transférer vers' style={{ width: 200 }} />

              {/* Responsive */}
              <Button type='primary' onClick={() => setOpenResponsive(true)}>
                <PlusCircle />
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
                <NeedForm />
              </Modal>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 overflow-hidden'>
        <div className='max-w-7xl mx-auto p-4 h-full'>
          {/* Desktop Table */}
          <div className='hidden md:block h-full'>
            <div className='bg-white border border-gray-200 rounded-lg h-full flex flex-col overflow-hidden'>
              <div className='flex-1 overflow-hidden'>
                <div className='h-full overflow-auto'>
                  <table className='w-full border-collapse'>
                    <thead className='sticky top-0 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-300 shadow-sm z-10'>
                      <tr>
                        <th className='px-2 py-1 text-left border-r border-gray-200'>
                          <Checkbox
                            onChange={handleSelectAll}
                            checked={
                              selected.length === data?.doclignes?.length &&
                              data?.doclignes?.length > 0 // Fixed: added optional chaining
                            }
                          />
                        </th>
                        <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                          Service
                        </th>
                        <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                          Responsable
                        </th>
                        <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                          Deplome
                        </th>
                        <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                          Min Experince
                        </th>
                        <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                          Etat
                        </th>
                        <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                          Cree le
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white'>
                      {loading ? (
                        <Skeleton rows={3} columns={7} />
                      ) : data?.length > 0 ? (
                        data.map((item, index) => (
                          <tr
                            key={index}
                            className={`
                              border-b border-gray-200 
                              hover:bg-blue-50 
                              transition-colors 
                              duration-150 
                              ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            `}
                          >
                            <td className='px-2 py-2 whitespace-nowrap border-r border-gray-100'>
                              <Checkbox />
                            </td>

                            <td className='px-2 py-2 whitespace-nowrap border-r border-gray-100'>
                              <span className='text-sm font-semibold text-gray-900'>
                                {item?.service?.name}
                              </span>
                            </td>

                            <td className='px-2 tex2-sm border-r border-gray-100'>
                              <div className='text-sm font-medium text-gray-900'>
                                {item?.responsible?.full_name}
                              </div>
                            </td>

                            <td className='px-2 tex2-sm border-r border-gray-100'>
                              {item?.level?.name}
                            </td>

                            <td className='px-2 tex2-sm border-r border-gray-100'>
                              {item.experience_min || 'Pas nécessaire'}
                            </td>

                            <td className='px-2 tex2-sm border-r border-gray-100'>
                              {item.status}
                            </td>

                            <td className='px-2 tex2-sm border-r border-gray-100'>
                              {item.created_at}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan='11' className='p-8'>
                            {' '}
                            {/* Fixed: proper colspan */}
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
                                Aucun article trouvé
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

export default Needs
