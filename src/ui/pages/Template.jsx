import { Button, Checkbox, Select, Skeleton } from 'antd'
import { PlusCircle, RefreshCcw } from 'lucide-react'
import React, { useState } from 'react'

export default function Template() {

    const [loading, setLoading] = useState([]);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    const fetchData = () => {

    }


    const handleSelectAll = () => {

    }

    const handleShow = async (id) => {
        
        try {
            const isValidId = typeof id === 'string' || typeof id === 'number';
            const url = `template/create${isValidId ? `/${id}` : ''}`;
            if (window.electron && typeof window.electron.openShow === 'function') {
                await window.electron.openShow({ path: url, width: 1000, height: 800 });
            } else {
                navigate(`/layout${url}`);
            }
        } catch (error) {
            console.error('Error navigating to resume:', error);
        }
    };

    return (
        <div className='h-full flex flex-col bg-gray-50'>
            <div className='flex-shrink-0 bg-white border-b border-gray-200 shadow-sm'>
                <div className='p-4'>


                    {/* Table Header Controls */}
                    <div className='flex justify-between items-center'>
                        <h2 className='text-lg font-semibold text-gray-800'>Besoins</h2>
                        <div className='flex gap-3'>
                            {/* Fixed: Added proper JSX syntax with curly braces */}


                            {/* <Select placeholder='Transférer vers' style={{ width: 200 }} /> */}

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

                            <Select
                                style={{ width: 200 }}
                                placeholder="Filtre d'état"
                                options={[
                                    { label: 'Toute', value: null },
                                    { label: 'En attente', value: 1 },
                                    { label: 'En cours', value: 2 },
                                    { label: 'Annulé', value: 3 },
                                    { label: 'Exécuté', value: 4 },
                                ]}
                            />
                            {/* Responsive */}
                            <Button type='primary' onClick={handleShow} >
                                <PlusCircle className='h-4 w-4'  />
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
                        <div className='bg-white border border-gray-200 h-full flex flex-col overflow-hidden'>
                            <div className='flex-1 overflow-hidden'>
                                <div className='w-full overflow-x-auto'>
                                    <table className='min-w-[800px] w-full border-collapse'>
                                        <thead className='sticky top-0 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-300 shadow-sm z-10'>
                                            <tr>
                                                <th className='px-2 py-1 text-left border-r border-gray-200'>
                                                    <Checkbox
                                                        onChange={handleSelectAll}
                                                        checked={
                                                            selected.length === data?.doclignes?.length &&
                                                            data?.doclignes?.length > 0
                                                        }
                                                    />
                                                </th>
                                                <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                                                    Référence
                                                </th>
                                                <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                                                    Département
                                                </th>
                                                <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                                                    Créé le
                                                </th>
                                                <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200'>
                                                    Actions
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
                                                            {item.experience_min + " mois" || 'Pas nécessaire'}
                                                        </td>

                                                        <td className='px-2 tex2-sm border-r border-gray-100'>
                                                            {renderStatus(item.status)}
                                                        </td>

                                                        <td className='px-2 tex2-sm border-r border-gray-100'>
                                                            {formatDate(item.created_at)}
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
                                                                Aucun besoin trouvé
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
