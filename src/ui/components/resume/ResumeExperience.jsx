import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Card, message } from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { locale } from '../../utils/config';
import { api } from '../../utils/api';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';

export default function ResumeExperience({ next }) {
  const { id } = useParams();

  const [formItems, setFormItems] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);

  const getExperiences = async () => {
    try {
      const { data } = await api.get(`resumes/${id}/experiences`);
      const prepared = data.map(d => ({
        ...d,
        start_date: d.start_date ? dayjs(d.start_date) : null, // Fixed: format start_date too
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
    setFormItems([...formItems, { 
      id: newId, 
      resume_id: id, 
      company: null, 
      start_date: null, // Fixed: changed from '' to null
      end_date: null, 
      work_post: '' 
    }]);
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
    setSaveLoading(true)
    
    const formattedExperience = formItems.map(experience => ({
      resume_id: parseInt(experience.resume_id),
      company: experience.company || null,
      work_post: experience.work_post,
      start_date: experience.start_date ? dayjs(experience.start_date).format('YYYY-MM-DD') : null, // Fixed: use start_date instead of end_date
      end_date: experience.end_date ? dayjs(experience.end_date).format('YYYY-MM-DD') : null,
    }));

    try {
      await api.post("experiences", { experiences: formattedExperience });
      message.success("Expériences enregistrés avec succès !");
      setSaveLoading(false);
      next();
    } catch (error) {
      setSaveLoading(false)
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
                  label="Entreprise"
                  required
                  tooltip="Ce champ est requis"
                >
                   <Input
                    placeholder="Entrez entreprise"
                    value={item.company}
                    onChange={(e) => updateFormItem(item.id, 'company', e.target.value)}
                  />
                </Form.Item>
              </Col>

              {/* Filière Field */}
              <Col xs={24} md={8}>
                <Form.Item
                  label="Post de travail"
                  required
                  tooltip="Ce champ est requis"
                >
                  <Input
                    placeholder="Entrez Post de travail"
                    value={item.work_post}
                    onChange={(e) => updateFormItem(item.id, 'work_post', e.target.value)}
                  />
                </Form.Item>
              </Col>

              {/* Date d'obtention */}
              <Col xs={24} md={8}>
                <Form.Item
                  label="Date d'Début"
                  required
                  tooltip="Ce champ est requis"
                >
                  <DatePicker
                    className="w-full"
                    placeholder="Sélectionnez une date début"
                    value={item.start_date}
                    locale={locale}
                    onChange={(date) => updateFormItem(item.id, 'start_date', date)}
                  />
                </Form.Item>
              </Col>

               <Col xs={24} md={8}>
                <Form.Item
                  label="Date Fin"
                >
                  <DatePicker
                    className="w-full"
                    placeholder="Sélectionnez une date Fin"
                    value={item.end_date}
                    locale={locale}
                    onChange={(date) => updateFormItem(item.id, 'end_date', date)}
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

        <div className="mt-6 fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-6 py-4 shadow-lg z-[1000]" >
          <div className="flex justify-between items-center">
            <Button
              style={{
                margin: '0 8px 0 0',
                minWidth: 100
              }}
              onClick={() => prev()}
              className='flex-shrink-0'
            >
              <ArrowLeftCircle size={20} />
              <span>Précédent</span>
            </Button>
            <Button
              onClick={handleSubmit}
              type="primary"
              loading={saveLoading}
              iconPosition="end"
              style={{ minWidth: 100 }}
              className='flex-shrink-0'
            >
              {!saveLoading ? <ArrowRightCircle size={20} /> : null}
              <span>Suivant</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}