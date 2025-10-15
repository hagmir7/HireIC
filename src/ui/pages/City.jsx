import React, { useEffect, useState } from 'react'
import Skeleton from '../components/ui/Sketelon';
import { api } from '../utils/api';
import { PlusCircle } from 'lucide-react';
import { Button, Form, Input, message, Modal } from 'antd'

export default function City() {

    const [loading, setLoading] = useState(false);
    
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form] = Form.useForm()

    const fetchData = async () => {
        try {
            const response = await api.get('cities');
            setData(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])



    const handleCreate = async () => {
        form.validateFields().then(async (values) => {
            try {
                const response = await api.post('cities', {
                    name: values.name
                });
                form.resetFields()
                setIsModalOpen(false)
                fetchData()
                message.success("Company created successfully");
            } catch (error) {
                message.error()
            }

        })
    }

    return (
       <div className='relative min-h-screen flex flex-col'>
      {/* Table Section */}
      <div className='flex-1 overflow-auto pb-20'>
        <table className='w-full border-collapse'>
          <thead className='sticky top-0 bg-gradient-to-b from-gray-50 to-gray-100 shadow-sm z-10'>
            <tr>
              <th className='px-2 py-2 whitespace-nowrap text-left text-sm font-semibold text-gray-600 border-r border-gray-200'>
                Ville
              </th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {loading ? (
              <Skeleton rows={3} columns={8} />
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-gray-200 hover:bg-blue-50 whitespace-nowrap ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className='px-2 py-1 border-r border-gray-200 whitespace-nowrap pl-3'>
                    {item.name}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className='p-8 text-center'>
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

      {/* Fixed Footer */}
      <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md p-4 flex justify-end'>
        <Button
          type='primary'
          icon={<PlusCircle size={16} />}
          onClick={() => setIsModalOpen(true)}
          className='flex items-center gap-2'
        >
          Créer
        </Button>
      </div>

       <Modal
        title='Créer une ville'
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={() => setIsModalOpen(false)}
        okText='Enregistrer'
        cancelText='Annuler'
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Nom de la ville'
            name='name'
            rules={[{ required: true, message: 'Veuillez entrer le nom de la ville' }]}
          >
            <Input placeholder='Exemple : Casablanca' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
    )
}
