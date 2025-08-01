import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Form, Input, DatePicker, Button, Row, Col, Card, message, Skeleton } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { locale } from '../../utils/config';
import { api } from '../../utils/api';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';

// Memoized experience item component
const ExperienceItem = React.memo(({ item, onUpdate, onRemove, canRemove }) => (
  <Card
    style={{ marginBottom: '12px' }}
    className="relative border border-gray-100 shadow-sm hover:shadow-md transition-shadow mb-2"
  >
    {canRemove && (
      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => onRemove(item.id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
      />
    )}

    <Row gutter={16}>
      <Col xs={24} md={8}>
        <Form.Item
          label="Entreprise"
          required
          tooltip="Ce champ est requis"
        >
          <Input
            placeholder="Entrez entreprise"
            value={item.company || ''}
            onChange={(e) => onUpdate(item.id, 'company', e.target.value)}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          label="Post de travail"
          required
          tooltip="Ce champ est requis"
        >
          <Input
            placeholder="Entrez Post de travail"
            value={item.work_post || ''}
            onChange={(e) => onUpdate(item.id, 'work_post', e.target.value)}
          />
        </Form.Item>
      </Col>

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
            onChange={(date) => onUpdate(item.id, 'start_date', date)}
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item label="Date Fin">
          <DatePicker
            className="w-full"
            placeholder="Sélectionnez une date Fin"
            value={item.end_date}
            locale={locale}
            onChange={(date) => onUpdate(item.id, 'end_date', date)}
          />
        </Form.Item>
      </Col>
    </Row>
  </Card>
));

// Skeleton loading component
const ExperienceSkeleton = React.memo(() => (
  <Card
    style={{ marginBottom: '12px' }}
    className="relative border border-gray-100 shadow-sm mb-2"
  >
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <Form.Item label="Entreprise" required>
          <Skeleton.Input active style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item label="Post de travail" required>
          <Skeleton.Input active style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item label="Date d'Début" required>
          <Skeleton.Input active style={{ width: '100%' }} />
        </Form.Item>
      </Col>
    </Row>
  </Card>
));

export default function ResumeExperience({ next, prev }) {
  const { id } = useParams();

  if (!id) {
    return (
      <div className='max-w-4xl mx-auto p-4'>
        <Card>
          <p>Entrez d'abord les informations personnelles.</p>
        </Card>
      </div>
    )
  }

  const [formItems, setFormItems] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateFormItem = useCallback((id, field, value) => {
    setFormItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  }, []);

  const removeFormItem = useCallback((id) => {
    setFormItems(prev => {
      if (prev.length > 1) {
        return prev.filter(item => item.id !== id);
      }
      return prev;
    });
  }, []);

  const addFormItem = useCallback(() => {
    setFormItems(prev => {
      const newId = Math.max(0, ...prev.map(item => item.id || 0)) + 1;
      return [...prev, {
        id: newId,
        resume_id: id,
        company: '',
        start_date: null,
        end_date: null,
        work_post: ''
      }];
    });
  }, [id]);

  // Optimized data fetching
  const getExperiences = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const { data } = await api.get(`resumes/${id}/experiences`);

      if (data?.length === 0) {
        setFormItems([{
          id: 1,
          resume_id: id,
          company: '',
          start_date: null,
          end_date: null,
          work_post: ''
        }]);
      } else {
        const prepared = data.map(d => ({
          ...d,
          start_date: d.start_date ? dayjs(d.start_date) : null,
          end_date: d.end_date ? dayjs(d.end_date) : null
        }));
        setFormItems(prepared);
      }
    } catch (error) {
      console.error('Error loading experiences:', error);
      message.error(error.response?.data?.message || "Erreur lors du chargement des expériences.");
      // Set default item on error
      setFormItems([{
        id: 1,
        resume_id: id,
        company: '',
        start_date: null,
        end_date: null,
        work_post: ''
      }]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getExperiences();
  }, [getExperiences]);

  // Memoized form validation
  const isFormValid = useMemo(() => {
    return formItems.some(item =>
      item.company?.trim() &&
      item.work_post?.trim() &&
      item.start_date
    );
  }, [formItems]);

  const handleSubmit = useCallback(async () => {
    if (!isFormValid) {
      message.warning("Veuillez remplir au moins une expérience complète.");
      return;
    }

    setSaveLoading(true);

    // Filter out empty experiences and format data
    const validExperiences = formItems.filter(item =>
      item.company?.trim() && item.work_post?.trim() && item.start_date
    );

    const formattedExperience = validExperiences.map(experience => ({
      resume_id: parseInt(experience.resume_id),
      company: experience.company.trim(),
      work_post: experience.work_post.trim(),
      start_date: dayjs(experience.start_date).format('YYYY-MM-DD'),
      end_date: experience.end_date ? dayjs(experience.end_date).format('YYYY-MM-DD') : null,
    }));

    try {
      await api.post("experiences", { experiences: formattedExperience });
      message.success("Expériences enregistrées avec succès !");
      next();
    } catch (error) {
      console.error('Error saving experiences:', error);
      message.error(error.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaveLoading(false);
    }
  }, [formItems, isFormValid, next]);

  // Memoize skeleton items
  const skeletonItems = useMemo(() => (
    Array.from({ length: 2 }, (_, index) => (
      <ExperienceSkeleton key={`skeleton-${index}`} />
    ))
  ), []);




  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        {loading ? (
          // Show skeleton loading
          <div className="space-y-4">
            {skeletonItems}
            <div className="flex justify-center mt-6">
              <Skeleton.Button active size="large" style={{ width: 200 }} />
            </div>
          </div>
        ) : (
          // Show actual content
          <>
            {formItems.map((item) => (
              <ExperienceItem
                key={item.id}
                item={item}
                onUpdate={updateFormItem}
                onRemove={removeFormItem}
                canRemove={formItems.length > 1}
              />
            ))}

            <div className="flex justify-center mt-6">
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addFormItem}
                className="flex items-center border-dashed text-gray-600 hover:text-blue-500 overflow-hidden"
              >
                Ajouter une expérience
              </Button>
            </div>
          </>
        )}

        <div className="mt-6 fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-6 py-4 shadow-lg z-[1000]">
          <div className="flex justify-between items-center">
            <Button
              style={{ margin: '0 8px 0 0', minWidth: 100 }}
              onClick={prev}
              className="flex-shrink-0"
            >
              <ArrowLeftCircle size={20} />
              <span>Précédent</span>
            </Button>
            <Button
              onClick={handleSubmit}
              type="primary"
              loading={saveLoading}
              disabled={loading || !isFormValid}
              iconPosition="end"
              style={{ minWidth: 100 }}
              className="flex-shrink-0"
            >
              {!saveLoading && <ArrowRightCircle size={20} />}
              <span>Suivant</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}