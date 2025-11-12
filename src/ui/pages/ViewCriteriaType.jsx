import React, { useEffect, useState } from 'react'
import { ArrowLeft, CircleAlert, Edit, PlusCircle, Trash } from 'lucide-react'
import { Button, Checkbox, message, Modal } from 'antd'
import { api } from '../utils/api'
import Skeleton from '../components/ui/Sketelon'
import RightClickMenu from '../components/ui/RightClickMenu'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CriteriaForm from '../components/CriteriaForm'
import BackButton from '../components/ui/BackButton'


const ViewCriteriaType = () => {
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ criteria: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [criteria, setCriteria] = useState();
    const { confirm } = Modal;
    const { id } = useParams();
    const navigate = useNavigate()


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
            const res = await api.get(`criteria-types/${id}`)
            setData(res.data)
            // console.log(res.data);
            
        } catch (error) {
            message.error(error.response?.data?.message || 'Erreur serveur')
        }
        setLoading(false)
    }

    const handleDelete = async (criteria_id) => {
        try {
            await api.delete(`criteria/${criteria_id}`)
            message.success("Critère supprimé avec succès")
            fetchData();
        } catch (error) {
            console.error(error);
            message.error(error?.response?.data?.message || "Erreur de supprimer la critère");

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
                setCriteria(data.criteria.find((item) => Number(item.id) === Number(id)))
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
                <h2 className='text-md font-semibold text-gray-800 flex gap-3 items-center'>
                     <BackButton />
                    <sapn>Type : {data.name}</sapn>
                </h2>
                <div>{data.description}</div>
                <div className='flex gap-3'>
                    <Modal
                        title="Département"
                        closable={{ 'aria-label': 'Custom Close Button' }}
                        open={isModalOpen}
                        onOk={() => setIsModalOpen(false)}
                        footer={false}
                        onCancel={() => setIsModalOpen(false)}
                    >
                        <CriteriaForm
                            initialValues={criteria}
                            onSubmit={async (data) => {
                                if (criteria) {
                                    await api.put(`criteria/${criteria.id}`, data);
                                } else {
                                    await api.post("criteria", data);
                                }
                                setIsModalOpen(false);
                                fetchData();
                                setCriteria('')
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
                                Ref
                            </th>
                            <th className='px-2 py-2 text-left border-r border-gray-300 text-sm font-semibold text-gray-600'>
                                Critère
                            </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white'>
                        {loading ? (
                            <Skeleton rows={3} columns={3} />
                        ) : data.criteria.length > 0 ? (
                            data.criteria.map((item, index) => (
                                <RightClickMenu
                                    key={item.id}
                                    menuItems={items.map(menu => ({ ...menu, id: item.id }))}
                                    onItemClick={handleMenuClick}
                                >
                                    <tr
                                        key={item.id}
                                        className={`border-b cursor-context-menu border-gray-200 hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    >
                                        <td className='px-2 py-1 border-r border-gray-300'>
                                            <Checkbox
                                                checked={selected.includes(item.id)}
                                                onChange={() => handleSelect(item.id)}
                                            />
                                        </td>
                                        <td className='px-2 py-1 border-r border-gray-300 text-sm font-medium text-gray-800'>
                                            {item.code || '__'}
                                        </td>
                                        <td className='px-2 py-1 border-r border-gray-300 text-sm text-gray-700'>
                                            {item.description}
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
                    Créer <PlusCircle size={18} />
                </Button>
            </div>
        </div>
    )
}

export default ViewCriteriaType
