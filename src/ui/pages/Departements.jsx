import React, { useEffect, useState } from 'react'
import { ArrowRight, PlusCircle, Undo2 } from 'lucide-react'
import { Button, Checkbox, message } from 'antd'
import { api } from '../utils/api'
import Skeleton from '../components/ui/Sketelon'

const Departements = () => {
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [transferSpin, setTransferSpin] = useState(false)
  const [data, setData] = useState([])

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
      const res = await api.get('departements')
      setData(res.data)
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

  // Calculate indeterminate state for select all checkbox
  const isIndeterminate = selected.length > 0 && selected.length < data.length
  const isAllSelected = selected.length > 0 && selected.length === data.length

  return (
    <div className='h-full flex flex-col'>
      <div className='shadow-sm p-4 flex items-center justify-between from-gray-50 to-gray-100 border-b'>
        <h2 className='text-lg font-semibold text-gray-800'>
          Départements & Services
        </h2>
        <div className='flex gap-3'>
          <Button type='primary'>
            Create <PlusCircle size={18} />
          </Button>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        <table className='w-full border-collapse'>
          <thead className='sticky top-0 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-300 shadow-sm z-10'>
            <tr>
              <th className='px-2 py-2 text-left border-r border-gray-300'>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                />
              </th>
              <th className='px-2 py-2 text-left border-r border-gray-300 text-sm font-semibold text-gray-600'>
                Département
              </th>
              <th className='px-2 py-2 text-left border-r border-gray-300 text-sm font-semibold text-gray-600'>
                Services
              </th>
              <th className='px-2 py-2 text-left text-sm font-semibold text-gray-600'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {loading ? (
              <Skeleton />
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-gray-200 hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                >
                  <td className='px-2 py-2 border-r border-gray-300'>
                    <Checkbox
                      checked={selected.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />
                  </td>
                  <td className='px-2 py-1 border-r border-gray-300 text-sm font-medium text-gray-800'>
                    {item.name || '__'}
                  </td>
                  <td className='px-2 py-1 border-r border-gray-300 text-sm text-gray-700'>
                    {item.services_count}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className='p-8 text-center text-gray-500'>
                  Aucun département trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Departements
