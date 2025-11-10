import { useEffect, useState } from 'react'
import { Search, Plus, Edit, Loader2 } from 'lucide-react'
import CModal from '../components/ui/CModal'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import RegisterForm from '../components/RegisterForm'
import { useAuth } from '../contexts/AuthContext'
import { Button } from 'antd'
import { handleShow } from '../utils/config'

export default function Users() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const { permissions } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }






  return (
    <div className='relative overflow-x-auto'>
      <div className='flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between p-4 bg-gray-200'>
        <div className='relative'>
          <div className='flex'>
            <CModal
              label='Ajouter'
              title='Ajouter un utilisatuer'
              icon={
                <Plus className='w-4 h-4 mt-1 text-gray-500 dark:text-gray-400 mr-1' />
              }
              btnClass='ms-3 inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
            >
              <RegisterForm />
            </CModal>
          </div>
        </div>

        <div className='relative'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <Search className='text-gray-500 dark:text-gray-400' />
          </div>
          <input
            type='text'
            className='block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Search for items'
          />
        </div>
      </div>

      <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
   
            <th scope='col' className='px-6 py-2 font-bold whitespace-nowrap'>
              Nom et prénom
            </th>
            <th scope='col' className='px-6 py-2 font-bold whitespace-nowrap'>
              Code (Username)
            </th>
            <th scope='col' className='px-6 py-2 font-bold whitespace-nowrap'>
              Email
            </th>
            <th scope='col' className='px-6 py-2 font-bold whitespace-nowrap'>
              Phone
            </th>
            <th scope='col' className='px-6 py-2 font-bold whitespace-nowrap'>
              Créé le
            </th>
            <th scope='col' className='px-6 py-2 font-bold whitespace-nowrap'>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
            >
         
              <th
                scope='row'
                className='px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white'
              >
                {user.full_name}
              </th>
                <td className='px-6 py-2'>{user.name}</td>
                <td className='px-6 py-2'>{user.email}</td>
                <td className='px-6 py-2'>{user.phone || '__'}</td>
                <td className='px-6 py-2'>
                  {new Date(user.created_at).toLocaleDateString()}
              </td>

              <td className='px-6 py-2'>
                {permissions('edit:users') ? (
                  <Button onClick={()=> handleShow(`/user/${user.id}` )} >
                    <Edit size={19} />
                  </Button>
                ) : (
                  '__'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading && (
        <div className='flex flex-col items-center justify-center h-64'>
          <Loader2 className='animate-spin text-blue-500 mb-2' size={32} />
          <span className='text-gray-600'>Chargement...</span>
        </div>
      )}
    </div>
  )
}
