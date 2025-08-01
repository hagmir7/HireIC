import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Form, Select, Button, Row, Col, Card, message, Skeleton } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { api } from '../../utils/api';
import { useParams } from 'react-router-dom';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';


const SkillItem = React.memo(({ item, skills, loading, onUpdate, onRemove, canRemove }) => (
  <Col xs={24} md={8}>
    <Card className="relative border border-gray-100 shadow-sm hover:shadow-md mb-2">
      <Form.Item label="Compétence" required>
        <div className="flex gap-2 items-center">
          <Select
            placeholder="Sélectionnez"
            value={item.skill_id || undefined}
            onChange={(value) => onUpdate(item.id, 'skill_id', value)}
            className="w-full"
            options={skills}
            showSearch
            loading={loading}
            allowClear
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
          />
          {canRemove && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onRemove(item.id)}
              disabled={loading}
            />
          )}
        </div>
      </Form.Item>
    </Card>
  </Col>
));

export default function ResumeSkill({ next, prev }) {
  const { id: resumeId } = useParams();


  if (!resumeId) {
    return (
      <div className='max-w-4xl mx-auto p-4'>
        <Card>
          <p>Entrez d'abord les informations personnelles.</p>
        </Card>
      </div>
    )
  }

  const [skillType, setSkillType] = useState(null);
  const [skillTypes, setSkillTypes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeSkills, setResumeSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);


  const filteredSkills = useMemo(() => {
    if (!skillType || skills.length === 0) return skills;
    return skills.filter(skill => skill.skill_type_id === skillType.value);
  }, [skillType, skills]);


  const skillOptions = useMemo(() => {
    return skillType ? filteredSkills : skills;
  }, [skillType, filteredSkills, skills]);


  const formattedSkillTypes = useMemo(() => {
    return skillTypes.map(item => ({
      label: item.name,
      value: Number(item.id)
    }));
  }, [skillTypes]);


  const updateSkill = useCallback((skillId, field, value) => {
    setResumeSkills(prev => prev.map(item =>
      item.id === skillId ? { ...item, [field]: value } : item
    ));
  }, []);

  const removeSkill = useCallback((skillId) => {
    setResumeSkills(prev => {
      if (prev.length > 1) {
        return prev.filter(item => item.id !== skillId);
      }
      return prev;
    });
  }, []);

  const addFormItem = useCallback(() => {
    setResumeSkills(prev => {
      const newId = Math.max(0, ...prev.map(item => item.id || 0)) + 1;
      return [...prev, { id: newId, resume_id: Number(resumeId), skill_id: null }];
    });
  }, [resumeId]);


  const loadInitialData = useCallback(async () => {
    if (!resumeId) return;

    setLoading(true);
    try {
      const [skillTypesRes, skillsRes, resumeSkillsRes] = await Promise.all([
        api.get('skills/type'),
        api.get('skills'),
        api.get(`resumes/${resumeId}/skills`)
      ]);


      setSkillTypes(skillTypesRes.data);


      const formattedSkills = skillsRes.data.map(item => ({
        label: item.name,
        value: Number(item.id),
        skill_type_id: item.skill_type_id ? Number(item.skill_type_id) : null
      }));
      setSkills(formattedSkills);


      const prepared = resumeSkillsRes.data.map((item, index) => ({
        id: index + 1,
        resume_id: Number(resumeId),
        skill_id: item.id
      }));

      setResumeSkills(
        prepared.length === 0
          ? [{ id: 1, resume_id: Number(resumeId), skill_id: null }]
          : prepared
      );

    } catch (error) {
      console.error('Error loading data:', error);
      message.error("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleSubmit = useCallback(async () => {
    setSaveLoading(true);

    const validSkills = resumeSkills.filter(skill => skill.skill_id !== null);

    if (validSkills.length === 0) {
      message.warning("Veuillez sélectionner au moins une compétence.");
      setSaveLoading(false);
      return;
    }

    const formatted = validSkills.map(skill => ({
      resume_id: Number(skill.resume_id),
      skill_id: Number(skill.skill_id),
    }));

    try {
      await api.post('skills/resume/store', { skills: formatted });
      message.success("Compétences enregistrées avec succès !");
      next();
    } catch (error) {
      console.error('Error saving skills:', error);
      message.error(error.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaveLoading(false);
    }
  }, [resumeSkills, next]);

  const handleSkillTypeChange = useCallback((value) => {
    const selectedType = skillTypes.find(item => item.value === value);
    setSkillType(selectedType);
  }, [skillTypes]);




  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        <Form.Item label="Types de compétences">
          <Select
            placeholder="Sélectionnez un type"
            value={skillType?.value}
            onChange={handleSkillTypeChange}
            className="w-full"
            options={formattedSkillTypes}
            showSearch
            loading={loading}
            allowClear
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Row gutter={[16, 16]}>
          {loading ? (
            Array.from({ length: 3 }, (_, index) => (
              <Col key={`skeleton-${index}`} xs={24} md={8}>
                <Card className="relative border border-gray-100 shadow-sm mb-2">
                  <Form.Item label="Compétence" required>
                    <div className="flex gap-2 items-center w-full">
                      <Skeleton.Input active style={{ width: '100%' }} />
                      <Skeleton.Button active size="default" />
                    </div>
                  </Form.Item>
                </Card>
              </Col>
            ))
          ) : (
            resumeSkills.map((item) => (
              <SkillItem
                key={item.id}
                item={item}
                skills={skillOptions}
                loading={loading}
                onUpdate={updateSkill}
                onRemove={removeSkill}
                canRemove={resumeSkills.length > 1}
              />
            ))
          )}
        </Row>

        <div className="flex justify-center mt-6">
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addFormItem}
            disabled={loading}
            className="overflow-hidden"
          >
            Ajouter une compétence
          </Button>
        </div>

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
              iconPosition="end"
              style={{ minWidth: 100 }}
              loading={saveLoading}
              disabled={loading}
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