import { Button } from 'antd'
import { Filter, Plus, PlusCircle } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Resume = () => {
    const navigate = useNavigate()

    const handleShow = async (id) => {
        try {
            const url = `/resume/create`
            if (window.electron && typeof window.electron.openShow === 'function') {
                await window.electron.openShow(url)
            } else {
                navigate(`/layout/resume/create`)
            }
        } catch (error) {
            console.error('Error navigating to article:', error)
        }
    }

  return (
    <div className='p-2'>
        {/* Header */}
        <div className='flex justify-between items-center'>
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
    </div>
  )
}
