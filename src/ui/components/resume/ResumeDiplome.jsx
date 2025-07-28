import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Card, message, Skeleton } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { locale } from '../../utils/config';
import { api } from '../../utils/api';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';

// Memoized diploma item component
const DiplomaItem = React.memo(({ item, levels, onUpdate, onRemove, canRemove }) => (
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
          label="Diplôme"
          required
          tooltip="Ce champ est requis"
        >
          <Select
            placeholder="Sélectionnez un diplôme"
            value={item.level_id || undefined}
            onChange={(value) => onUpdate(item.id, 'level_id', value)}
            className="w-full"
            options={levels}
            showSearch
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      </Col>

      <Col xs={24} md={8}>
        <Form.Item
          label="Filière"
          required
          tooltip="Ce champ est requis"
        >
          <Input
            placeholder="Entrez votre filière"
            value={item.name || ''}
            onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
          />
        </Form.Item>
      </Col>

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
            onChange={(date) => onUpdate(item.id, 'end_date', date)}
          />
        </Form.Item>
      </Col>
    </Row>
  </Card>
));

// Skeleton loading component
const DiplomaSkeleton = React.memo(() => (
  <Card
    style={{ marginBottom: '12px' }}
    className="relative border border-gray-100 shadow-sm mb-2"
  >
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <Form.Item label="Diplôme" required>
          <Skeleton.Input active style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item label="Filière" required>
          <Skeleton.Input active style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item label="Date d'obtention" required>
          <Skeleton.Input active style={{ width: '100%' }} />
        </Form.Item>
      </Col>
    </Row>
  </Card>
));

export default function ResumeDiplome({ next, prev }) {
  const { id } = useParams();

  const [formItems, setFormItems] = useState([]);
  const [levels, setLevels] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Memoized handlers to prevent unnecessary re-renders
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
        level_id: '', 
        name: '', 
        end_date: null, 
        resume_id: id 
      }];
    });
  }, [id]);

  // Memoized levels options to prevent recreation
  const levelOptions = useMemo(() => {
    return levels.map(level => ({ 
      label: level.name, 
      value: level.id 
    }));
  }, [levels]);

  // Optimized data fetching with parallel requests
  const loadInitialData = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [levelsRes, diplomasRes] = await Promise.all([
        api.get('levels'),
        api.get(`resumes/${id}/diplomes`)
      ]);

      setLevels(levelsRes.data);


      if (diplomasRes.data?.length === 0) {
        setFormItems([{
          id: 1, 
          level_id: '', 
          name: '', 
          end_date: null, 
          resume_id: id 
        }]);
      } else {
        const prepared = diplomasRes.data.map(d => ({
          ...d,
          end_date: d.end_date ? dayjs(d.end_date) : null
        }));
        setFormItems(prepared);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      message.error(error.response?.data?.message || "Erreur lors du chargement des données.");
      // Set default item on error
      setFormItems([{
        id: 1, 
        level_id: '', 
        name: '', 
        end_date: null, 
        resume_id: id 
      }]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const isFormValid = useMemo(() => {
    return formItems.some(item => 
      item.level_id && 
      item.name?.trim() && 
      item.end_date
    );
  }, [formItems]);

  const handleSubmit = useCallback(async () => {
    if (!isFormValid) {
      message.warning("Veuillez remplir au moins un diplôme complet.");
      return;
    }

    setSaveLoading(true);
    
    const validDiplomas = formItems.filter(item => 
      item.level_id && item.name?.trim() && item.end_date
    );

    const formattedDiplomas = validDiplomas.map(diploma => ({
      level_id: diploma.level_id,
      name: diploma.name.trim(),
      end_date: dayjs(diploma.end_date).format('YYYY-MM-DD'),
      resume_id: parseInt(diploma.resume_id),
    }));

    try {
      await api.post("diplomas", { diplomas: formattedDiplomas });
      message.success("Diplômes enregistrés avec succès !");
      next();
    } catch (error) {
      console.error('Error saving diplomas:', error);
      message.error(error.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaveLoading(false);
    }
  }, [formItems, isFormValid, next]);


  const skeletonItems = useMemo(() => (
    Array.from({ length: 2 }, (_, index) => (
      <DiplomaSkeleton key={`skeleton-${index}`} />
    ))
  ), []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {skeletonItems}
            <div className="flex justify-center mt-6">
              <Skeleton.Button active size="large" style={{ width: 200 }} />
            </div>
          </div>
        ) : (
          <>
            {formItems.map((item) => (
              <DiplomaItem
                key={item.id}
                item={item}
                levels={levelOptions}
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
                Ajouter un diplôme
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