import { Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { api } from '../../utils/api';

export default function CreateTemplate() {
    const [departments, setDepartments] = useState([]);
    const [criteriaTypes, setCriteriaTypes] = useState([])

    useEffect(() => {
        getDepartments();
        getCriteriaTypes()
    }, [])


    const getDepartments = async () => {
        try {
            const response = await api.get('departements')
            setDepartments(response.data.map(item => ({
                label: item.name,
                value: item.id
            })))
        } catch (error) {
            console.log(error?.response?.data?.message);
        }
    }

    const getCriteriaTypes = async () => {
        try {
            const response = await api.get('criteria-types');
            setCriteriaTypes(response.data.map(item => ({
                label: item.name,
                value: item.id
            })))
        } catch (error) {
            console.log(error?.response?.data?.message);
        }
    }


    return (
        <div className='p-3 grid grid-cols-1 md:grid-cols-2 gap-2'>
            <Form.Item
                name="code"
                label="Référence"
                rules={[{ required: true, message: "Le référence ets requis" }]}
                style={{ marginTop: 0 }}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name='departement_id'
                label='Département'
                rules={[{ required: true, message: 'Département est requis' }]}
                style={{ marginTop: 0 }}

            >
                <Select placeholder="Sélectionnez le département" options={departments}>
                </Select>
            </Form.Item>

            <Form.Item
                name='departement_id'
                label='Département'
                rules={[{ required: true, message: 'Département est requis' }]}
                style={{ marginTop: 0 }}
            >
                <Select placeholder="Sélectionnez le département" options={criteriaTypes}>
                </Select>
            </Form.Item>
        </div>
    )
}
