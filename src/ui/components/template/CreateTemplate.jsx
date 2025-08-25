import { Form, Input, Select, Table, Button, Typography, Space, Tag, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { api } from '../../utils/api';
import { CircleCheckBig, Trash } from 'lucide-react';

const { Title } = Typography;

export default function CreateTemplate() {
    const [departments, setDepartments] = useState([]);
    const [criteriaTypes, setCriteriaTypes] = useState([]);
    const [criteria, setCriteria] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectedCriteriaType, setSelectedCriteriaType] = useState(null);
    const [form] = Form.useForm();

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

    const getCriteria = async (value) => {
        try {
            const response = await api.get(`criteria-types/${value}`);
            setCriteria(response.data.criteria.map(item => ({
                label: item.description,
                value: item.id
            })))

            const selectedType = criteriaTypes.find(type => type.value === value);
            setSelectedCriteriaType(selectedType?.label || '');
        } catch (error) {
            console.log(error?.response?.data?.message);
        }
    }

    const changeSelected = (value) => {
        const item = criteria.find(item => item.value === value);
        if (!item) return;

        if (!selected.some(sel => sel.value === value)) {
            setSelected([...selected, {
                key: value,
                value: value,
                label: item.label,
                criteriaType: selectedCriteriaType
            }]);
        }
    };

    const removeSelected = (valueToRemove) => {
        setSelected(selected.filter(item => item.value !== valueToRemove));
    };

    const handleSubmit = async (values) => {
        try {
            const response = await api.post('', {
                ...values,
                criteria: selected
            })
        } catch (error) {
            message.error(error?.response?.data?.message || "Error");

        }
    }

    const clearAll = () => {
        setSelected([]);
    };

    const columns = [

        {
            title: 'Description du Critère',
            dataIndex: 'label',
            key: 'label',
            ellipsis: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeSelected(record.value)}
                    title="Supprimer"
                />
            ),
        },
    ];

    return (
        <div className='p-4'>
            <Form onFinish={handleSubmit} form={form}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-2'>
                    <Form.Item
                        name="code"
                        label="Référence"
                        rules={[{ required: true, message: "La référence est requise" }]}
                        style={{ marginTop: 0, marginBottom: 0 }}
                    >
                        <Input placeholder="Entrez la référence" />
                    </Form.Item>

                    <Form.Item
                        name='departement_id'
                        label='Département'
                        rules={[{ required: true, message: 'Département est requis' }]}
                        style={{ marginTop: 0, marginBottom: 0 }}
                    >
                        <Select
                            placeholder="Sélectionnez le département"
                            options={departments}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name='criteria_type_id'
                        label='Type de Critères'
                        rules={[{ required: true, message: 'Type de critères est requis' }]}
                        style={{ marginTop: 0, marginBottom: 0 }}
                    >
                        <Select
                            onChange={(value) => {
                                getCriteria(value);
                                setCriteria([]);
                            }}
                            placeholder="Sélectionnez le type de critère"
                            options={criteriaTypes}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name='criteria_id'
                        label='Critères'
                        rules={[{ required: true, message: 'Critères est requis' }]}
                        style={{ marginTop: 0, marginBottom: 0 }}
                    >
                        <Select
                            placeholder="Sélectionnez le critère"
                            options={criteria}
                            onChange={changeSelected}
                            disabled={criteria.length === 0}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={null}
                        />
                    </Form.Item>
                </div>
                {/* Selected Criteria Section */}
                <div className='mt-0'>
                    <div className='flex justify-between items-center mb-2'>
                        <h2 className='text-md font-semibold' style={{ margin: 0 }}>
                            Critères Sélectionnés ({selected.length})
                        </h2>
                        {selected.length > 0 && (
                            <Space>
                                <Button
                                    type="default"
                                    size="small"
                                    color="danger" variant="solid"
                                    onClick={clearAll}
                                >
                                    <Trash size={14} />
                                    Tout effacer
                                </Button>
                                <Button htmlType="submit" color="cyan" variant="solid" size="small">
                                    <CircleCheckBig size={14} />
                                    Enregistrer
                                </Button>
                            </Space>
                        )}
                    </div>

                    {selected.length > 0 ? (
                        <Table
                            columns={columns}
                            dataSource={selected}
                            pagination={false}
                            size="small"
                            bordered
                            className=""
                            scroll={{ x: 600 }}
                        />
                    ) : (
                        <div className='text-center py-8 text-gray-500 bg-gray-50 rounded border-2 border-dashed border-gray-300'>
                            <p>Aucun critère sélectionné</p>
                            <p className='text-sm'>Sélectionnez un type de critère puis ajoutez des critères</p>
                        </div>
                    )}
                </div>
            </Form>


        </div>
    )
}