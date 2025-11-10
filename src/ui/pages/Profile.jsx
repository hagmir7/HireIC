import { useState, useEffect } from 'react'
import { Mail, Phone, Save, Loader2, Info, Building, Shield, Lock } from 'lucide-react'
import { data, useParams } from 'react-router-dom'
import { api } from '../utils/api'
import { useAuth } from '../contexts/AuthContext'
import { message, Form, Input, Button, Checkbox, Card, Tabs, Select, } from 'antd'
import AvatarUpdate from '../components/AvatarUpdate'
import PasswordUpdate from '../components/PasswordUpdate'
import ProfileSkeleton from '../components/ui/ProfileSkeleton'

export default function Profile() {

  const [userData, setUserData] = useState({
    name: '',
    full_name: '',
    email: '',
    phone: '',
    company_id: '',
    roles: [],
    avatar: '',
  })

  const [activeKey, setActiveKey] = useState('1')
  const [userRoles, setUserRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { id } = useParams()
  const { roles, permissions } = useAuth()
  const [form] = Form.useForm()
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const url = `user/${id || ''}`
        const response = await api.get(url)
        const data = response.data
        setUserRoles(data.roles)

        const userRoleNames = Array.isArray(data.user.roles)
          ? data.user.roles.map(role => role.name.toString())
          : []

        const userInfo = {
          name: data.user.name || '',
          full_name: data.user.full_name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          company_id: data.user.company_id || '',
          roles: userRoleNames,
          avatar: data.user.avatar || '',
        }

        setUserData(userInfo)
        form.setFieldsValue(userInfo)
      } catch (err) {
        console.error('Erreur de chargement:', err)
        message.error('Erreur lors du chargement du profil')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
    getCompanies()

  }, [id, form])

  const getCompanies = async () => {
    const { data } = await api.get('companies');
    setCompanies(data.map(item => ({
      label: item.name,
      value: String(item.id)
    })));
  };


  const handleSubmit = async (values) => {

    try {
      setSaving(true)

      const payload = {
        ...values,
        roles: userData.roles,
        avatar: userData.avatar
      }

      const url = `user/update/${id || ''}`
      await api.post(url, payload)
      message.success("Profil mis à jour avec succès")

    } catch (err) {
      console.error(err)
      message.error(err.response?.data?.message || 'Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const handleRoleChange = (checkedValues) => {
    setUserData(prevData => ({
      ...prevData,
      roles: checkedValues
    }))
  }

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields()
      await handleSubmit(values)
    } catch (err) {
      console.error('Validation failed:', err)
    }
  }

  if (loading) {
    return (
      <ProfileSkeleton />
    )
  }

  const tabs = [
    {
      label: (
        <span className='flex items-center gap-2 ml-3'>
          <Info size={16} />
          Info
        </span>
      ),
      key: '1',
      children: (
        <div className=''>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-4"
          >
            <AvatarUpdate id={id} defaultAvatar={userData.avatar} />


            <div className=''>
              <div className='px-3 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Form.Item
                  label="Nom d'utilisateur"
                  name="name"
                  rules={[{ required: true, message: 'Le nom d\'utilisateur est requis' }]}
                >
                  <Input
                    placeholder='Ex. BonnieG'
                    className='h-10'
                  />
                </Form.Item>

                <Form.Item
                  label="Nom complet"
                  name="full_name"
                  rules={[{ required: true, message: 'Le nom complet est requis' }]}
                >
                  <Input
                    placeholder='Ex. Bonnie Green'
                    className='h-10'
                  />
                </Form.Item>
              </div>

              <div className='px-3 grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'L\'email est requis' },
                    { type: 'email', message: 'Format d\'email invalide' }
                  ]}
                >
                  <Input
                    prefix={<Mail size={18} className="text-gray-400" />}
                    placeholder='nom@exemple.com'
                    className='h-10'
                  />
                </Form.Item>

                <Form.Item
                  label="Numéro de téléphone"
                  name="phone"
                >
                  <Input
                    prefix={<Phone size={18} className="text-gray-400" />}
                    placeholder='01-23-45-67-89'
                    className='h-10'
                  />
                </Form.Item>

                <Form.Item
                  label="Société"
                  name="company_id"
                >
                  <Select
                    style={{ height: '40px' }}
                    prefix={<Building size={18} className="text-gray-400" />}
                    placeholder="Société"
                    options={companies}
                  >

                  </Select>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      ),
    },
    {
      label: (
        <span className='flex items-center gap-2'>
          <Shield size={16} />
          Rôles
        </span>
      ),
      key: '2',
      children: (
        <div className='px-3'>
          {(permissions('view:roles') || roles('supper_admin')) && (
            <div className=''>
              <h2 className='text-md font-semibold mb-2'>Rôles utilisateur</h2>

              <Card className='bg-gray-50 border-gray-200'>
                <Checkbox.Group
                  value={userData.roles}
                  onChange={handleRoleChange}
                  className='w-full'
                >
                  <div className='grid grid-cols-2 sm:md:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                    {userRoles.map((role) => (
                      <div key={role.id} className="p-2"> {/* Added padding around each Checkbox */}
                        <Checkbox value={role.name} className="text-gray-700">
                          {role.name}
                        </Checkbox>
                      </div>
                    ))}
                  </div>

                </Checkbox.Group>
              </Card>
            </div>
          )}
        </div>
      ),
    },
    {
      label: (
        <span className='flex items-center gap-2'>
          <Lock size={16} />
          Mot de passe
        </span>
      ),
      key: '3',
      children: (
        <div className='px-3 gap-4'><PasswordUpdate UserId={id} /></div>
      ),
    },
  ]

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <div className='min-h-screen flex flex-col mx-auto bg-white'>
      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        size="middle"
        type="line"
        items={tabs}
        style={{ marginBottom: 32 }}
      />

      <div className="flex-grow"></div>

      {/* Boutons d'action */}
      <div className="mt-8 flex justify-end space-x-3 px-4 pb-4">
        <Button
          type="primary"
          htmlType="submit"
          loading={saving}
          onClick={handleFormSubmit}
          icon={saving ? <Loader2 size={18} className='animate-spin' /> : <Save size={18} />}
          className='h-10 px-8 bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700'
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>
    </div>
  )
}