import React, { useEffect, useState } from 'react';
import { Form, Select, Button, Row, Col, Card, message } from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { api } from '../../utils/api';
import { useParams } from 'react-router-dom';

export default function ResumeSkill() {
  const { id: resumeId } = useParams();

  const [skillType, setSkillType] = useState(null);
  const [skillTypes, setSkillTypes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeSkills, setResumeSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resumeId) {
      getSkills();
      getSkillTypes();
      getResumeSkills();
    }
  }, [resumeId]);


  useEffect(() => {
    if (skillType && skills.length > 0) {
    
      const filtered = skills.filter(skill => skill.skill_type_id === skillType.value);
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills(skills);
    }
  }, [skillType, skills]);

  const getSkillTypes = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('skills/type');
      setSkillTypes(data.map(item => ({
        label: item.name,
        value: Number(item.id)
      })));
    } catch (error) {
      console.error('Error loading skill types:', error);
      message.error("Erreur lors du chargement des types de compétences.");
    } finally {
      setLoading(false);
    }
  };

  const getSkills = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('skills');
      const formattedSkills = data.map(item => ({
        label: item.name,
        value: Number(item.id),
        skill_type_id: item.skill_type_id ? Number(item.skill_type_id) : null
      }));
      setSkills(formattedSkills);

    } catch (error) {
      console.error('Error loading skills:', error);
      message.error("Erreur lors du chargement des compétences.");
    } finally {
      setLoading(false);
    }
  };

  const getResumeSkills = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`resumes/${resumeId}/skills`);

      const prepared = data.map((item, index) => ({
        id: index + 1,
        resume_id: Number(resumeId),
        skill_id: item.id
      }));  
      if (prepared.length === 0) {
        setResumeSkills([{ id: 1, resume_id: Number(resumeId), skill_id: null }]);
      } else {
        setResumeSkills(prepared);
      }
    } catch (error) {
      console.error('Error loading resume skills:', error);
      message.error("Erreur lors du chargement des compétences du CV.");
    } finally {
      setLoading(false);
    }
  };

  const addFormItem = () => {
    const newId = Math.max(0, ...resumeSkills.map(item => item.id || 0)) + 1;
    setResumeSkills([...resumeSkills, { id: newId, resume_id: Number(resumeId), skill_id: null }]);
  };

  const removeSkill = (skillId) => {
    if (resumeSkills.length > 1) {
      setResumeSkills(resumeSkills.filter(item => item.id !== skillId));
    }
  };

  const updateSkill = (skillId, field, value) => {
    setResumeSkills(resumeSkills.map(item =>
      item.id === skillId ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async () => {
    const hasValidSkills = resumeSkills.some(skill => skill.skill_id !== null);
    
    if (!hasValidSkills) {
      message.warning("Veuillez sélectionner au moins une compétence.");
      return;
    }

    const formatted = resumeSkills
      .filter(skill => skill.skill_id !== null)
      .map(skill => ({
        resume_id: Number(skill.resume_id),
        skill_id: Number(skill.skill_id),
      }));

    try {
      setLoading(true);
      await api.post('skills/resume/store', { skills: formatted });
      message.success("Compétences enregistrées avec succès !");
      getResumeSkills(); 
    } catch (error) {
      console.error('Error saving skills:', error);
      message.error(error.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  if (!resumeId) {
    return <div>ID de CV manquant</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-6">
        <Form.Item label="Types de compétences">
          <Select
            placeholder="Sélectionnez un type"
            value={skillType?.value}
            onChange={(value) => {
              const selectedType = skillTypes.find(item => item.value === value);
              setSkillType(selectedType);
            }}
            className="w-full"
            options={skillTypes}
            showSearch
            loading={loading}
            allowClear
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Row gutter={[16, 16]}>
          {resumeSkills.map((item) => (
            <Col key={item.id} xs={24} md={8}>
              <Card className="relative border border-gray-100 shadow-sm hover:shadow-md mb-2">
                <Form.Item 
                  label="Compétence" 
                  required
                >
                  <div className="flex gap-2 items-center">
                    <Select
                      placeholder="Sélectionnez"
                      value={item.skill_id !== null && item.skill_id !== undefined ? item.skill_id : undefined}
                      onChange={(value) => updateSkill(item.id, 'skill_id', value)}
                      className="w-full"
                      options={skillType ? filteredSkills : skills}
                      showSearch
                      loading={loading}
                      allowClear
                      filterOption={(input, option) =>
                        option?.label?.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                    {resumeSkills.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeSkill(item.id)}
                        disabled={loading}
                      />
                    )}
                  </div>
                </Form.Item>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="flex justify-center mt-6">
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addFormItem}
            disabled={loading}
            className='overflow-hidden'
          >
            Ajouter une compétence
          </Button>
        </div>

        <div className="flex justify-end mt-8">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            size="large"
            className='overflow-hidden'
            loading={loading}
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}