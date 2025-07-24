import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Card, message } from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { locale } from '../../utils/config';
import { api } from '../../utils/api';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

export default function ResumeExperience() {
  const { id } = useParams();

  const [formItems, setFormItems] = useState([]);
  const [languages, setLanguages] = useState([]);

  const getExperiences = async () => {
    try {
      const { data } = await api.get(`resumes/${id}/experiences`);
      const prepared = data.map(d => ({
        ...d,
        end_date: d.end_date ? dayjs(d.end_date) : null
      }));
      if (data?.length === 0) {
        setFormItems([{ id: 2, resume_id: id, company: '', start_date: null, end_date: null, work_post: '' }])
      } else {
        setFormItems(prepared);
      }

    } catch (error) {
      message.error(error.response?.data?.message || "Erreur lors du chargement des expériences.");
    }
  };

  const addFormItem = () => {
    const newId = Math.max(0, ...formItems.map(item => item.id)) + 1;
    setFormItems([...formItems, { id: newId, resume_id: id, company: null, start_date: '', end_date: null, work_post: '' }]);
  };

  const removeFormItem = (id) => {
    if (formItems.length > 1) {
      setFormItems(formItems.filter(item => item.id !== id));
    }
  };

  const updateFormItem = (id, field, value) => {
    setFormItems(formItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };



  useEffect(() => {
    getExperiences();

  }, []);

  const handleSubmit = async () => {
    console.log(formItems);
    
    const formattedExperience = formItems.map(experience => ({
      resume_id: parseInt(experience.resume_id),
      company: experience.company || null,
      work_post: experience.work_post,
      start_date: experience.end_date ? dayjs(experience.end_date).format('YYYY-MM-DD') : null,
      end_date: experience.end_date ? dayjs(experience.end_date).format('YYYY-MM-DD') : null,

    }));

    try {
      await api.post("experiences", { experiences: formattedExperience });
      message.success("Expériences enregistrés avec succès !");
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Erreur lors de l'enregistrement.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        {formItems.map((item) => (
          <Card
            key={item.id}
            style={{ marginBottom: '12px' }}
            className="relative border border-gray-100 shadow-sm hover:shadow-md transition-shadow mb-2"
          >
            {formItems.length > 1 && (
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeFormItem(item.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              />
            )}

            <Row gutter={16}>
              {/* Expérience Field */}
             <Col xs={24} md={8}>
                <Form.Item
                    label="Langue"
                    required
                    tooltip="Ce champ est requis"
                >
                    <Select
                    placeholder="Sélectionnez un Langue"
                    value={item.language_id || undefined}
                    onChange={(value) => updateFormItem(item.id, 'language_id', value)}
                    className="w-full"
                    options={languages}
                    showSearch
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    />
                </Form.Item>
                </Col>

              {/* Filière Field */}
               <Col xs={24} md={8}>
                <Form.Item
                    label="Niveau"
                    required
                    tooltip="Ce champ est requis"
                >
                    <Select
                    placeholder="Sélectionnez un Niveau"
                    value={item.level || undefined}
                    onChange={(value) => updateFormItem(item.id, 'level', value)}
                    className="w-full"
                    options={languages}
                    showSearch
                    filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    />
                </Form.Item>
                </Col>

            </Row>
          </Card>
        ))}

        {/* Add Button */}
        <div className="flex justify-center mt-6">
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addFormItem}
            className="flex items-center border-dashed text-gray-600 hover:text-blue-500 overflow-hidden"
          >
            Ajouter un expérience
          </Button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            className="flex items-center bg-blue-600 hover:bg-blue-700"
            size="large"
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}
