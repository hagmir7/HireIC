import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { api } from '../../utils/api';
import { locale } from '../../utils/config';

const { Option } = Select;

export default function ResumeInfoForm() {
  const [form] = Form.useForm();
  const [cities, setCities] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  // Load list of cities
  const getCities = async () => {
    try {
      const { data } = await api.get('cities');
      setCities(data.map(city => ({ label: city.name, value: city.id })));
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || 'Erreur chargement villes');
    }
  };

  // Load existing resume for edit
  const getResume = async () => {
    if (!id) return;
    try {
      const { data } = await api.get(`resumes/${id}`);
      if (data.birth_date) data.birth_date = dayjs(data.birth_date);
      form.setFieldsValue(data);
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || 'Erreur chargement CV');
    }
  };

  useEffect(() => {
    getCities();
    getResume();
  }, [id]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value && value.originFileObj) {
        formData.append(key, value.originFileObj);
      } else if (value && typeof value.format === 'function') {
        formData.append(key, value.format('YYYY-MM-DD'));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const token = localStorage.getItem('authToken') || '';
    try {
      if (id) {
        const { data } = await axios.post(
          `http://localhost:8000/api/resumes/${id}?_method=PUT`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        message.success('CV mis à jour avec succès !');
       
      } else {
        const { data } = await axios.post(
          `http://localhost:8000/api/resumes`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
        message.success('CV envoyé avec succès !');
        // form.resetFields();
        navigate(`/resume/create/${data.resume.id}`)
      }
    } catch (err) {
      console.error(err);
      message.error(err?.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-4 pb-16">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Form.Item name="first_name" label="Prénom" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
            <Input />
          </Form.Item>

          <Form.Item name="last_name" label="Nom" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ type: 'email' }]} style={{ marginBottom: 0 }}>
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Téléphone" style={{ marginBottom: 0 }}>
            <Input />
          </Form.Item>

          <Form.Item name="gender" label="Genre" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
            <Select placeholder="Sélectionner le genre">
              <Option value={1}>Homme</Option>
              <Option value={2}>Femme</Option>
            </Select>
          </Form.Item>

          <Form.Item name="birth_date" label="Date de naissance" style={{ marginBottom: 0 }}>
            <DatePicker className="w-full" locale={locale} />
          </Form.Item>

          <Form.Item name="cin" label="CIN" style={{ marginBottom: 0 }}>
            <Input />
          </Form.Item>

          <Form.Item name="marital_status" label="État civil" style={{ marginBottom: 0 }}>
            <Select placeholder="Sélectionner">
              <Option value={1}>Célibataire</Option>
              <Option value={2}>Marié(e)</Option>
              <Option value={3}>Divorcé(e)</Option>
            </Select>
          </Form.Item>

          <Form.Item name="nationality" label="Nationalité" initialValue="Marocaine" style={{ marginBottom: 0 }}>
            <Input />
          </Form.Item>

          <Form.Item name="city_id" label="Ville" style={{ marginBottom: 0 }}>
            <Select
              showSearch
              placeholder="Sélectionner la ville"
              options={cities}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item name="address" label="Adresse" className="md:col-span-2" style={{ marginBottom: 0 }}>
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="cv_file"
            label="CV"
            valuePropName="file"
            getValueFromEvent={e => e?.fileList?.[0]?.originFileObj}
            style={{ marginBottom: 0, width: '100%' }}
          >
            <Upload beforeUpload={() => false} maxCount={1} style={{ width: '100%' }}>
              <Button icon={<UploadOutlined />} className="w-full">Choisir le fichier</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="cover_letter_file"
            label="Lettre de motivation"
            valuePropName="file"
            getValueFromEvent={e => e?.fileList?.[0]?.originFileObj}
            style={{ marginBottom: 0, width: '100%' }}
          >
            <Upload beforeUpload={() => false} maxCount={1} style={{ width: '100%' }}>
              <Button icon={<UploadOutlined />} className="w-full">Choisir le fichier</Button>
            </Upload>
          </Form.Item>
        </div>

        <Form.Item className="mt-6">
          <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700 mt-5">
            {id ? 'Mettre à jour' : 'Soumettre'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
