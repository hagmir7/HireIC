import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { api } from '../../utils/api';
import { locale } from '../../utils/config';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';

const { Option } = Select;

export default function ResumeInfoForm({ next, prev }) {
  const [form] = Form.useForm();
  const [cities, setCities] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const { id } = useParams();

  const getCities = async () => {
    try {
      const { data } = await api.get('cities');
      setCities(data.map(city => ({ label: city.name, value: String(city.id) })));
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || 'Erreur chargement villes');
    }
  };

  const getResume = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await api.get(`resumes/${id}`);

      if (data.birth_date) data.birth_date = dayjs(data.birth_date);

      const cvFileList = data.cv_file ? [{
        uid: '-1',
        name: data.cv_file.split('/').pop(),
        status: 'done',
        url: data.cv_file,
      }] : [];

      const coverLetterFileList = data.cover_letter_file ? [{
        uid: '-2',
        name: data.cover_letter_file.split('/').pop(),
        status: 'done',
        url: data.cover_letter_file,
      }] : [];

      form.setFieldsValue({
        ...data,
        cv_file: cvFileList,
        cover_letter_file: coverLetterFileList,
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      message.error(error?.response?.data?.message || 'Erreur chargement CV');
    }
  };

  useEffect(() => {
    getCities();
    getResume();
  }, [id]);

  const handleSubmit = async (values) => {
    setSaveLoading(true);
    const formData = new FormData();
    
    Object.entries(values).forEach(([key, value]) => {
      // Handle file uploads (they come as arrays from Ant Design Upload)
      if (Array.isArray(value) && value.length > 0) {
        const file = value[0];
        // Only append if it's a new file (has originFileObj)
        if (file.originFileObj) {
          formData.append(key, file.originFileObj);
        }
        // If it's an existing file (has url but no originFileObj), skip it
        // The backend will keep the existing file
      } 
      // Handle date fields
      else if (value && typeof value.format === 'function') {
        formData.append(key, value.format('YYYY-MM-DD'));
      } 
      // Handle other fields
      else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const token = localStorage.getItem('authToken') || '';
    let url;
    if (import.meta.env.MODE === 'development') {
      url = "http://localhost:8000/api/resumes";
    } else {
      url = "http://recruit365.intercocina.space/api/resumes";
    }
    
    const headers = { 
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'multipart/form-data' 
      } 
    };

    try {
      if (id) {
        await axios.post(`${url}/${id}?_method=PUT`, formData, headers);
        message.success('CV mis à jour avec succès !');
        setSaveLoading(false);
        next();
      } else {
        const { data } = await axios.post(url, formData, headers);
        message.success('CV envoyé avec succès !');
        navigate(`/resume/create/${data.resume.id}`);
        next();
      }
    } catch (err) {
      setSaveLoading(false);
      console.error(err);
      message.error(err?.response?.data?.message || 'Une erreur est survenue');
    }
  };

  const handleFilePreview = async (file) => {
    let baseUrl;
    if (import.meta.env.MODE === 'development') {
      baseUrl = "http://localhost:8000/storage/";
    } else {
      baseUrl = "http://recruit365.intercocina.space/storage/";
    }

    // If file has a URL (existing file), use it directly
    if (file.url) {
      // Check if URL is already absolute
      const fullUrl = file.url.startsWith('http') ? file.url : `${baseUrl}${file.url}`;
      console.log(fullUrl);
      
      window.open(fullUrl, "_blank");
    } 
    // If it's a new file being uploaded
    else if (file.originFileObj) {
      const blobUrl = URL.createObjectURL(file.originFileObj);
      window.open(blobUrl, "_blank");
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
          <Form.Item
            name="first_name"
            label="Prénom"
            rules={[{ required: true, message: "Le prénom est requis" }]}
            style={{ marginBottom: 0 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Nom"
            rules={[{ required: true, message: "Le nom est requis" }]}
            style={{ marginBottom: 0 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "L'adresse email est requise" },
              { type: 'email', message: "L'adresse email est invalide" }
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Téléphone"
            style={{ marginBottom: 0 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Genre"
            rules={[{ required: true, message: "Le genre est requis" }]}
            style={{ marginBottom: 0 }}
          >
            <Select placeholder="Sélectionner le genre">
              <Option value="1">Homme</Option>
              <Option value="2">Femme</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="birth_date"
            label="Date de naissance"
            style={{ marginBottom: 0 }}
          >
            <DatePicker className="w-full" locale={locale} />
          </Form.Item>

          <Form.Item
            name="cin"
            label="CIN"
            style={{ marginBottom: 0 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="marital_status"
            label="État civil"
            style={{ marginBottom: 0 }}
          >
            <Select placeholder="Sélectionner">
              <Option value={1}>Célibataire</Option>
              <Option value={2}>Marié(e)</Option>
              <Option value={3}>Divorcé(e)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="nationality"
            label="Nationalité"
            initialValue="Marocaine"
            style={{ marginBottom: 0 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="city_id"
            label="Ville"
            style={{ marginBottom: 0 }}
          >
            <Select
              showSearch
              placeholder="Sélectionner la ville"
              options={cities}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Adresse"
            className="md:col-span-2"
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="cv_file"
            label="CV"
            valuePropName="fileList"
            getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
            style={{ marginBottom: 0, width: '100%' }}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              style={{ width: '100%' }}
              onPreview={handleFilePreview}
            >
              <Button icon={<UploadOutlined />} className="w-full">Choisir le fichier</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="cover_letter_file"
            label="Lettre de motivation"
            valuePropName="fileList"
            getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
            style={{ marginBottom: 0, width: '100%' }}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              style={{ width: '100%' }}
              onPreview={handleFilePreview}
            >
              <Button icon={<UploadOutlined />} className="w-full">Choisir le fichier</Button>
            </Upload>
          </Form.Item>
        </div>

        <div className="mt-6 fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-6 py-4 shadow-lg z-[1000]">
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
              htmlType="submit"
              type="primary"
              loading={saveLoading}
              iconPosition="end"
              disabled={loading}
              style={{ minWidth: 100 }}
              className='flex-shrink-0'
            >
              {!saveLoading ? <ArrowRightCircle size={20} /> : null}
              <span>Suivant</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}