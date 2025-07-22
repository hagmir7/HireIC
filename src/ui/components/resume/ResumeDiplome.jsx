import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Card, message } from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { locale } from '../../utils/config';
import { api } from '../../utils/api';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

export default function ResumeDiplome() {
  const { id } = useParams();

  const [formItems, setFormItems] = useState([
    { id: 1, level_id: '', name: '', end_date: null, resume_id: id },
    { id: 2, level_id: '', name: '', end_date: null, resume_id: id }
  ]);

  const getDeplomes = async () => {
    try {
      const { data } = await api.get(`resumes/${id}/diplomes`);
      const prepared = data.map(d => ({
        ...d,
        end_date: d.end_date ? dayjs(d.end_date) : null
      }));
      setFormItems(prepared);
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
    const formattedDiplomas = formItems.map(diploma => ({
      level_id: diploma.level_id || null,
      name: diploma.name,
      end_date: diploma.end_date ? dayjs(diploma.end_date).format('YYYY-MM-DD') : null,
      resume_id: parseInt(diploma.resume_id),
    }));

    try {
      await api.post("diplomas", { diplomas: formattedDiplomas });
      message.success("Diplômes enregistrés avec succès !");
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Erreur lors de l'enregistrement.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white">
      <div className="space-y-6">
        {formItems.map((item) => (
          <Card
            key={item.id}
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
