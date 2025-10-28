import { Form, Input, Select, Table, Button, Typography, Space, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../utils/api';
import { CircleCheckBig, Trash } from 'lucide-react';

const { Title } = Typography;

export default function TemplateForm({ onSuccess }) {
  const { id } = useParams(); 
  const templateId = id || null;

  const [departments, setDepartments] = useState([]);
  const [criteriaTypes, setCriteriaTypes] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedCriteriaType, setSelectedCriteriaType] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getDepartments();
    getCriteriaTypes();

    if (templateId) {
      getTemplate(templateId);
    }
  }, [templateId]);

  const getDepartments = async () => {
    try {
      const response = await api.get('departements');
      setDepartments(response.data.map(item => ({
        label: item.name,
        value: item.id
      })))
    } catch (error) {
      console.error(error?.response?.data?.message);
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
      console.error(error?.response?.data?.message);
    }
  }

  const getCriteria = async (value) => {
    try {
      const response = await api.get(`criteria-types/${value}`);
      setCriteria(response.data.criteria.map(item => ({
        label: item.description,
        value: item.id
      })));

      const selectedType = criteriaTypes.find(type => type.value === value);
      setSelectedCriteriaType(selectedType?.label || '');
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  }

  const getTemplate = async (id) => {
    try {
      const response = await api.get(`templates/${id}`);
      const data = response.data;

      form.setFieldsValue({
        name: data.name,
        code: data.code,
        departement_id: data.departement_id,
        description: data.description
      });

      if (data.criteria && Array.isArray(data.criteria)) {
        setSelected(data.criteria.map(item => ({
          key: item.id,
          value: item.id,
          label: item.description,
          criteriaType: item.criteria_type?.name || ''
        })));
      }
    } catch (error) {
      console.error(error?.response?.data?.message);
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
    setLoading(true);

    try {
      const payload = { ...values, criteria: selected };

      let response;
      if (templateId) {
        response = await api.put(`templates/${templateId}`, payload);
        message.success("Template updated successfully");
        
        
      } else {
        response = await api.post('templates', payload);
        message.success("Modèle créé avec succès");
        navigate(`/template/create/${response.data.id}`)
        console.error(response.data);
      }

      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
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
      <Form onFinish={handleSubmit} form={form} layout="vertical">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-2'>
          <Form.Item
            name="name"
            label="Modèle"
            style={{marginBottom: 0}}
            rules={[{ required: true, message: "Le nom de modèle est requis" }]}
          >
            <Input placeholder="Entrez le nom de modèle" />
          </Form.Item>

          {/* <Form.Item
            name="code"
            label="Référence"
            rules={[{ required: true, message: "La référence est requise" }]}
          >
            <Input placeholder="Entrez la référence" />
          </Form.Item> */}


          <Form.Item
            name='departement_id'
            label='Département'
            style={{marginBottom: 0}}
            rules={[{ required: true, message: 'Département est requis' }]}
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
            style={{marginBottom: "4px"}}
          >
            <Select
              onChange={(value) => {
                setCriteria([]);
                getCriteria(value);
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
            style={{marginBottom: "4px"}}
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
                  onClick={clearAll}
                >
                  <Trash size={14} />
                  Tout effacer
                </Button>
                <Button 
                  htmlType="submit" 
                  type="primary" 
                  loading={loading} 
                  size="small"
                >
                  <CircleCheckBig size={14} />
                  {templateId ? "Mettre à jour" : "Enregistrer"}
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
              rowKey="value"
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
