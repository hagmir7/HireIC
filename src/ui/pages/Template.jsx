import { Button, Checkbox, message, Select } from 'antd'
import { PlusCircle, RefreshCcw } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Skeleton from '../components/ui/Sketelon';
import TableEmpty from '../components/TableEmpty';

export default function Template() {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('templates');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            message.error(error.response?.data?.message || "Loading templates failed");
            setLoading(false);
        }
    }

    const handleSelectAll = () => {
        if (selected.length === data.length && data.length > 0) {
            setSelected([]);
        } else {
            setSelected(data.map((_, index) => index));
        }
    }

    const handleShow = async (id) => {
        try {
            const isValidId = typeof id === 'string' || typeof id === 'number';

            const url = `template/create${isValidId ? `/${id}` : ''}`;
            if (window.electron && typeof window.electron.openShow === 'function') {
                await window.electron.openShow({ path: url, width: 1000, height: 800 });
            } else {
                navigate(`/layout/${url}`);
            }
        } catch (error) {
            console.error('Error navigating to resume:', error);
        }
    };



    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    return (
        <div className='h-full flex flex-col bg-gray-50'>
            <div className='flex-shrink-0 bg-white border-b border-gray-200 shadow-sm'>
                <div className='p-4'>
                    {/* Table Header Controls */}
                    <div className='flex justify-between items-center'>
                        <h2 className='text-lg font-semibold text-gray-800'>Modèles d'entretien</h2>
                        <div className='flex gap-3'>
                            <Button
                                onClick={fetchData}
                                className='flex items-center gap-2 hover:shadow-md transition-shadow'
                            >
                                {loading ? (
                                    <RefreshCcw className='animate-spin h-4 w-4' />
                                ) : (
                                    <RefreshCcw className='h-4 w-4' />
                                )}
                                Rafraîchir
                            </Button>
                            
                            <Button type='primary' onClick={() => handleShow()}>
                                <PlusCircle className='h-4 w-4' />
                                Créer
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className='flex-1 overflow-hidden'>
                <div className='mx-auto pt-4 h-full'>
                    {/* Desktop Table */}
                    <div className='h-full'>
                        <div className='bg-white border-t border-gray-200 h-full flex flex-col overflow-hidden'>
                            <div className='flex-1 overflow-hidden'>
                                <div className='w-full overflow-x-auto'>
                                    <table className='min-w-[800px] w-full border-collapse'>
                                        <thead className='sticky top-0 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-300 shadow-sm z-10'>
                                            <tr>
                                                <th className='px-2 py-1 text-left border-r border-gray-200'>
                                                    <Checkbox
                                                        onChange={handleSelectAll}
                                                        checked={
                                                            selected.length === data?.length &&
                                                            data?.length > 0
                                                        }
                                                    />
                                                </th>
                                                <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                                                    Référence
                                                </th>
                                                <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                                                    Modèle
                                                </th>
                                                <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                                                    Département
                                                </th>
                                                <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                                                    Critères
                                                </th>
                                                <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                                                    Créé le
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className='bg-white'>
                                            {loading ? (<Skeleton rows={3} columns={6} />
                                            ) : data?.length > 0 ? (
                                                data.map((item, index) => (
                                                    <tr
                                                        key={item.id || index}
                                                        className={`
                                                            border-b border-gray-200 
                                                            hover:bg-blue-50 
                                                            transition-colors 
                                                            duration-150 
                                                            ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                                        `}
                                                    >
                                                        <td className='px-2 py-2 whitespace-nowrap border-r border-gray-100'>
                                                            <Checkbox
                                                                checked={selected.includes(index)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelected([...selected, index]);
                                                                    } else {
                                                                        setSelected(selected.filter(i => i !== index));
                                                                    }
                                                                }}
                                                            />
                                                        </td>

                                                        <td className='px-2 py-2 text-sm border-r border-gray-100'>
                                                            <span onClick={()=> handleShow(item.id)} className='font-semibold text-blue-900 w-full cursor-pointer'>
                                                                {item.code || 'N/A'}
                                                            </span>
                                                        </td>

                                                        <td className='px-2 py-2 text-sm border-r border-gray-100'>
                                                            <div className='text-sm font-medium text-gray-900'>
                                                                {item?.name || 'N/A'}
                                                            </div>
                                                        </td>

                                                        <td className='px-2 py-2 text-sm border-r border-gray-100'>
                                                            {item?.departement?.name || 'N/A'}
                                                        </td>

                                                        <td className='px-2 py-2 text-sm border-r border-gray-100'>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                                                                {item?.criteria_count}
                                                            </span>
                                                        </td>

                                                        <td className='px-2 py-2 text-sm border-r border-gray-100'>
                                                            {formatDate(item.created_at)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (<TableEmpty description="Aucun modèle trouvé" colSpan={7} Create={handleShow} />)}
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