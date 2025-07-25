import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Card, message } from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { locale } from '../../utils/config';
import { api } from '../../utils/api';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';

export default function ResumeDiplome( { next }) {
  const { id } = useParams();

  const [formItems, setFormItems] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);

  const getDeplomes = async () => {
    try {
      const { data } = await api.get(`resumes/${id}/diplomes`);
      const prepared = data.map(d => ({
        ...d,
        end_date: d.end_date ? dayjs(d.end_date) : null
      }));
      if(data?.length === 0){
        setFormItems([{id: 2, level_id: '', name: '', end_date: null, resume_id: id }])
      }else{
        setFormItems(prepared);
      }
      
    } catch (error) {
      message.error(error.response?.data?.message || "Erreur lors du chargement des diplômes.");
    }
  };

  const addFormItem = () => {
    const newId = Math.max(0, ...formItems.map(item => item.id)) + 1;
    setFormItems([...formItems, { id: newId, level_id: '', name: '', end_date: null, resume_id: id }]);
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

  const [levels, setLevels] = useState([]);

  const getLevels = async () => {
    try {
      const { data } = await api.get('levels');
      setLevels(data.map(level => ({ label: level.name, value: level.id })));
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Erreur lors du chargement des niveaux.");
    }
  };

  useEffect(() => {
     getLevels();
    getDeplomes();
   
  }, []);

  const handleSubmit = async () => {
    setSaveLoading(true)
    const formattedDiplomas = formItems.map(diploma => ({
      level_id: diploma.level_id || null,
      name: diploma.name,
      end_date: diploma.end_date ? dayjs(diploma.end_date).format('YYYY-MM-DD') : null,
      resume_id: parseInt(diploma.resume_id),
    }));

    try {
      await api.post("diplomas", { diplomas: formattedDiplomas });
      message.success("Diplômes enregistrés avec succès !");
      setSaveLoading(false)
      next();
    } catch (error) {
      setSaveLoading(false);
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
            style={{marginBottom: '12px'}}
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
              {/* Diplôme Field */}
              <Col xs={24} md={8}>
                <Form.Item
                  label="Diplôme"
                  required
                  tooltip="Ce champ est requis"
                >
                  <Select
                    placeholder="Sélectionnez un diplôme"
                    value={item.level_id || undefined}
                    onChange={(value) => updateFormItem(item.id, 'level_id', value)}
                    className="w-full"
                    options={levels}
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
                  label="Filière"
                  required
                  tooltip="Ce champ est requis"
                >
                  <Input
                    placeholder="Entrez votre filière"
                    value={item.name}
                    onChange={(e) => updateFormItem(item.id, 'name', e.target.value)}
                  />
                </Form.Item>
              </Col>

              {/* Date d'obtention */}
              <Col xs={24} md={8}>
                <Form.Item
                  label="Date d'obtention"
                  required
                  tooltip="Ce champ est requis"
                >
                  <DatePicker
                    className="w-full"
                    placeholder="Sélectionnez une date"
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
            Ajouter un diplôme
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
             {!saveLoading ?  <ArrowRightCircle size={20} /> : null}
              <span>Suivant</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
