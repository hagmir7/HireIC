import React, { useEffect, useState } from 'react';
import { Form, Select, Button, Row, Col, Card, message, Skeleton } from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { api } from '../../utils/api';
import { useParams } from 'react-router-dom';
import { ArrowLeftCircle, CheckCircle } from 'lucide-react';

export default function ResumeLanguage({ next, prev }) {
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

    const [resumeLanguages, setResumeLanguages] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [saveLoading, setSaveLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch language options
    const getLanguages = async () => {
        try {
            const { data } = await api.get("languages");
            setLanguages(data.map(item => ({
                label: item.name,
                value: String(item.id)
            })));
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || "Erreur lors du chargement des langues.");
        }
    };


    const getResumeLanguages = async () => {
        setLoading(true)
        try {
            const { data } = await api.get(`resumes/${id}/languages`);

            if (!data || data.length === 0) {
                setResumeLanguages([{
                    id: 1,
                    resume_id: id,
                    language_id: null,
                    level: null
                }]);
            } else {
                const prepared = data.map(item => ({
                    ...item,
                    name: item.name,
                    level: item.level,
                }));
                setResumeLanguages(prepared);
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error);
            message.error(error.response?.data?.message || "Erreur lors du chargement des langues.");
        }
    };

    // Add new language card
    const addResumeLang = () => {
        const newId = Math.max(0, ...resumeLanguages.map(item => item.id)) + 1;
        setResumeLanguages([...resumeLanguages, {
            id: newId,
            resume_id: id,
            language_id: null,
            level: null
        }]);
    };

    // Remove a language card
    const removeResumeLang = (itemId) => {
        if (resumeLanguages.length > 1) {
            setResumeLanguages(resumeLanguages.filter(item => item.id !== itemId));
        }
    };

    // Update language or level
    const updateResumeLang = (itemId, field, value) => {
        setResumeLanguages(resumeLanguages.map(item =>
            item.id === itemId ? { ...item, [field]: value } : item
        ));
    };

    // Submit handler
    const handleSubmit = async () => {
        setSaveLoading(true)
        const formattedLanguages = resumeLanguages.map(lang => ({
            resume_id: parseInt(lang.resume_id),
            language_id: lang.language_id || null,
            level: lang.level || null,
        }));

        try {
            await api.post("languages/resume/store", { languages: formattedLanguages });
            message.success("Langues enregistrées avec succès !");
            setSaveLoading(false)
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || "Erreur lors de l'enregistrement.");
            setSaveLoading(false)
        }
    };

    useEffect(() => {
        getLanguages();
        getResumeLanguages();
    }, []);

  

    return (
        <div className="max-w-6xl mx-auto p-4">
            <Form layout="vertical">
                {/* Cards: 2 per row */}
                <Row gutter={[16, 16]}>
                    {loading ? (
                        // Skeleton loading state
                        Array.from({ length: 2 }).map((_, index) => (
                            <Col xs={24} md={12} key={`skeleton-${index}`}>
                                <Card
                                    className="relative border border-gray-100 shadow-sm"
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="Langue" required>
                                                <Skeleton.Input active style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item label="Niveau" required>
                                                <Skeleton.Input active style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        // Actual content
                        resumeLanguages.map((item) => (
                            <Col xs={24} md={12} key={item.id}>
                                <Card
                                    className="relative border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {resumeLanguages.length > 1 && (
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeResumeLang(item.id)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                        />
                                    )}

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="Langue" required>
                                                <Select
                                                    placeholder="Sélectionnez une langue"
                                                    value={item.language_id ?? undefined}
                                                    onChange={(value) => updateResumeLang(item.id, 'language_id', value)}
                                                    className="w-full"
                                                    options={languages}
                                                    showSearch
                                                    allowClear
                                                    filterOption={(input, option) =>
                                                        option?.label?.toLowerCase().includes(input.toLowerCase())
                                                    }
                                                />

                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item label="Niveau" required>
                                                <Select
                                                    placeholder="Sélectionnez le niveau"
                                                    value={item.level ?? undefined}
                                                    onChange={(value) => updateResumeLang(item.id, 'level', value)}
                                                    className="w-full"
                                                    options={[
                                                        { value: 1, label: "A1" },
                                                        { value: 2, label: "A2" },
                                                        { value: 3, label: "B1" },
                                                        { value: 4, label: "B2" },
                                                        { value: 5, label: "C1" },
                                                        { value: 6, label: "C2" },
                                                    ]}
                                                    allowClear
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>

                {/* Add Button */}
                <div className="flex justify-center mt-6">
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={addResumeLang}
                        className="flex items-center border-dashed overflow-hidden"
                    >
                        Ajouter une langue
                    </Button>
                </div>
            </Form>

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
                        iconPosition="end"
                        loading={saveLoading}
                        disabled={loading}
                        style={{ minWidth: 100 }}
                        className='flex-shrink-0'
                    >
                        {
                            !saveLoading ? <CheckCircle size={19} /> : null
                        }
                        <span>Enregistrer</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
