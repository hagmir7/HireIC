import { Button } from 'antd'
import { Filter, Plus, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api';
import { getResumeStatus } from '../utils/config';


export const Resume = () => {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);


    const getResumes = async ()=>{
        const { data } = await api.get('resumes');
        setResumes(data.data);
    }


    useEffect(() =>{
        getResumes()
    }, []);

    const handleShow = async (id) => {
        try {
            const url = `/resume/create${id ? `/${id}` : ''}`
            if (window.electron && typeof window.electron.openShow === 'function') {
                await window.electron.openShow(url)
            } else {
                navigate(`/layout/resume/create${id ? `/${id}` : ''}`)
            }
        } catch (error) {
            console.error('Error navigating to article:', error)
        }
    }


    return (
        <div className=''>
            {/* Header */}
            <div className='flex justify-between items-center p-2'>
                <h1 className='text-xl font-semibold'>List des cvs</h1>
                <div className='flex gap-3'>
                    <Button color="green" variant="solid" onClick={handleShow}>
                        <PlusCircle size={17} />
                        Créer
                    </Button>
                    <Button color="primary" variant="solid">
                        <Filter size={17} />
                        Filtre
                    </Button>
                </div>
            </div>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Position</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resumes.map((resume) => (
                            <tr onClick={()=> handleShow(resume.id)} key={resume.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input id={`checkbox-table-search-${resume.id}`} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor={`checkbox-table-search-${resume.id}`} className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <th scope="row" className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <img className="w-10 h-10 rounded-full" src={resume.full_name} alt={`${resume.full_name} image`} />
                                    <div className="ps-3">
                                        <div className="text-base font-semibold">{resume.full_name}</div>
                                        <div className="font-normal text-gray-500">{resume.phone}</div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">{resume.position}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className={`h-2.5 w-2.5 rounded-full ${getResumeStatus(resume.status).color} me-2`}></div>
                                        {getResumeStatus(resume.status).label}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit resume</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
