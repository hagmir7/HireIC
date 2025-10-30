import { Button, Checkbox, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { api } from '../utils/api'
import Skeleton from '../components/ui/Sketelon'
import ServiceForm from '../components/ServiceForm'

function ViewDepartement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState([]) // changed from {services: []} to []
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const { id } = useParams()
  const [currentService, setCurrentService] = useState(null);

  const services = data?.services || []

  const isIndeterminate =
    selected.length > 0 && selected.length < services.length
  const isAllSelected =
    selected.length > 0 && selected.length === services.length

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get(`departements/${id}`)
      console.log(res.data)
      setData(res.data)
    } catch (error) {
      message.error(error.response?.data?.message || 'Erreur serveur')
    }
    setLoading(false)
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(services.map((item) => item.id))
    } else {
      setSelected([])
    }
  }

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    )
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='h-full flex flex-col'>
      <div className='shadow-sm p-2 flex items-center justify-between from-gray-50 to-gray-100 border-b'>
        <h2 className='text-md font-semibold text-gray-800'>
          Département ({data?.name})
        </h2>
        <div className='flex gap-3'>
          <Modal
            title='Département'
            open={isModalOpen}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
          >

            <ServiceForm
              initialValues={currentService}
              onSubmit={async (data) => {
                if (currentService) {
                  await api.put(`services/${currentService.id}`, data);
                } else {
                  await api.post("services", data);
                }
                setIsModalOpen(false);
                fetchData();
                se('')
              }}
            />
          </Modal>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        <table className='w-full border-collapse'>
          <thead className='sticky top-0 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-300 shadow-sm z-10'>
            <tr>
              <th className='px-2 py-1 text-left border-r border-gray-300'>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                />
              </th>
              <th className='px-2 py-2 text-left border-r border-gray-300 text-sm font-semibold text-gray-600'>
                Service
              </th>
              <th className='px-2 py-2 text-left border-r border-gray-300 text-sm font-semibold text-gray-600'>
                Posts
              </th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {loading ? (
              <Skeleton rows={3} columns={3} />
            ) : services.length > 0 ? (
              services.map((item, index) => (
                <tr
                  onClick={()=> {setIsModalOpen(true); setCurrentService(services.find((service) => Number(service.id) === Number(item.id)))}}
                  key={item.id}
                  className={`border-b border-gray-200 hover:bg-blue-50 transition ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className='px-2 py-1 border-r border-gray-300'>
                    <Checkbox
                      checked={selected.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                  </td>
                  <td className='px-2 py-1 border-r border-gray-300 text-sm font-medium text-gray-800'>
                    {item.name || '__'}
                  </td>
                  <td className='px-2 py-1 border-r border-gray-300 text-sm text-gray-700'>
                    {item.posts_count}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className='p-8 text-center text-gray-500'>
                  Aucun département trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md p-4 flex justify-end'>
        <Button type='primary' onClick={() => {setIsModalOpen(true); setCurrentService(null)}}>
          <PlusCircle size={18} className='mr-2' /> Créer
        </Button>
      </div>
    </div>
  )
}

export default ViewDepartement
