import React, { useEffect, useState } from 'react'
import { CircleAlert, ClipboardList, Edit, MessageSquare, PlusCircle, Settings2, Trash } from 'lucide-react'
import { Button, Checkbox, message, Modal } from 'antd'
import { api } from '../utils/api'
import Skeleton from '../components/ui/Sketelon'
import RightClickMenu from '../components/ui/RightClickMenu'
import LevelForm from '../components/levels/LevelForm'


const Diplome = () => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [level, setLevel] = useState();
  const { confirm } = Modal;


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
      const res = await api.get('levels')
      setData(res.data)
    } catch (error) {
      message.error(error.response?.data?.message || 'Erreur serveur')
    }
    setLoading(false)
  }

  const handleDelete = async (diplome_id) => {
    try {
      await api.delete(`levels/${diplome_id}`)
      message.success("Diplôme supprimé avec succès")
      fetchData();
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Erreur de supprimer la diplôme");
    }
  }

  const showDeleteConfirm = (id) => {
    confirm({
      title: '  Etes-vous sûr de vouloir supprimer cet élément ?',
      icon: <CircleAlert size={25} className='text-red-600 mt-1 mr-2' color='red' />,
      content: 'Cette action ne peut pas être annulée.',
      okText: 'Oui, supprimez-le',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk() {
        handleDelete(id);
      },
    });
  };


  useEffect(() => {
    fetchData()
  }, [])

  const handleMenuClick = (key, id) => {
    switch (key) {
      case "edit":
        setLevel(data.find((item) => Number(item.id) === Number(id)))
        setIsModalOpen(true)
        break;
      case 'delete':
        showDeleteConfirm(id);
        break;
    }
  };

  const items = [
    { label: "Modifier", key: "edit", icon: <Edit size={15} /> },
    { label: "Supprimer", key: "delete", icon: <Trash size={15} />, danger: true, },
  ];


  const isIndeterminate = selected.length > 0 && selected.length < data.length
  const isAllSelected = selected.length > 0 && selected.length === data.length

  return (
    <div className='h-full flex flex-col'>
      <div className='shadow-sm p-2 flex items-center justify-between from-gray-50 to-gray-100 border-b'>
        <h2 className='text-md font-semibold text-gray-800'>
          Diplômes
        </h2>
        <div className='flex gap-3'>


          <Modal
            title="Diplôme"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            footer={false}
            onCancel={() => setIsModalOpen(false)}
          >
           <LevelForm
                initialValues={level}
                onSubmit={async (data) => {
                    try {
                    if (level) {
                        await api.put(`levels/${level.id}`, data);
                        message.success("Niveau mis à jour avec succès !");
                    } else {
                        await api.post("levels", data);
                        message.success("Niveau ajouté avec succès !");
                    }
                    setIsModalOpen(false);
                    fetchData();
                    setLevel('');
                    } catch (error) {
                      console.error("Erreur lors de l’enregistrement du niveau :", error);
                      message.error("Une erreur s’est produite. Veuillez réessayer.");
                      return false;
                    }
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
                Département
              </th>
              <th className='px-2 py-2 text-left border-r border-gray-300 text-sm font-semibold text-gray-600'>
                Années (Bac+)
              </th>
               <th className='px-2 py-2 text-left border-r border-gray-300 text-sm font-semibold text-gray-600'>
                Coefficient
              </th>

            </tr>
          </thead>
          <tbody className='bg-white'>
            {loading ? (
              <Skeleton rows={3} columns={4} />
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <RightClickMenu
                  key={item.id}
                  menuItems={items.map(menu => ({ ...menu, id: item.id }))}
                  onItemClick={handleMenuClick}
                >
                  <tr
                    key={item.id}
                    className={`border-b border-gray-200 hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
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
                      {item.years}
                    </td>
                    <td className='px-2 py-1 border-r border-gray-300 text-sm text-gray-700'>
                      {item.coefficient}
                    </td>
                  </tr>
                </RightClickMenu>
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

      <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md p-4 flex justify-end'>
        <Button type='primary' onClick={() => setIsModalOpen(true)}>
          Create <PlusCircle size={18} />
        </Button>
      </div>
    </div>
  )
}

export default Diplome
