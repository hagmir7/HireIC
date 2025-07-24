import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Card, message } from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { locale } from '../../utils/config';
import { api } from '../../utils/api';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

export default function ResumeLanguage() {
    const { id } = useParams();

    const [resumeLanguages, setResumeLanguages] = useState([]);
    const [languages, setLanguages] = useState([]);

    const getResumeLanguages = async () => {
        try {
            const { data } = await api.get(`resumes/${id}/languages`);


            const prepared = data.map(item => ({
                ...item,
                name: item.name,
                level: item.level,
            }))


            if (data?.length === 0) {
                setResumeLanguages([{
                    id: 1,
                    resume_id: id,
                    language_id: '',
                    level: null
                }])
            } else {
                setResumeLanguages(prepared);
            }
        } catch (error) {
            console.log(error);

            message.error(error.response?.data?.message || "Erreur lors du chargement des langues.");
        }
    };

    const addResumeLang = () => {
        const newId = Math.max(0, ...resumeLanguages.map(item => item.id)) + 1;
        setResumeLanguages([...resumeLanguages, {
            id: newId,
            resume_id: id,
            language_id: null,
            level: null
        }]);
    };

    const removeResumeLang = (id) => {
        if (resumeLanguages.length > 1) {
            setResumeLanguages(resumeLanguages.filter(item => item.id !== id));
        }
    };

    const updateResumeLang = (id, field, value) => {
        setResumeLanguages(resumeLanguages.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const getLanguages = async () => {
        try {
            const { data } = await api.get("languages");
            setLanguages(data.map(item => ({
                label: item.name,
                value: item.id
            })));
        } catch (error) {
            console.error(error);

            message.error(error.response?.data?.message || "Erreur lors du chargement des langues.");
        }
    }

    useEffect(() => {
        getLanguages();
        getResumeLanguages();
    }, []);

    const handleSubmit = async () => {

        const formattedLanguages = resumeLanguages.map(lang => ({
            resume_id: parseInt(lang.resume_id),
            language_id: lang.language_id || null,
            level: lang.level || null,
        }));

        try {
            await api.post("languages/resume/store", { languages: formattedLanguages });
            message.success("Langues enregistrées avec succès !");
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || "Erreur lors de l'enregistrement.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="space-y-6">
                {resumeLanguages.map((item) => (
                    <Card
                        key={item.id}
                        style={{ marginBottom: '12px' }}
                        className="relative border border-gray-100 shadow-sm hover:shadow-md transition-shadow mb-2"
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

                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Langue"
                                    required
                                >
                                    <Select
                                        placeholder="Sélectionnez une langue"
                                        value={item.language_id !== null && item.language_id !== undefined ? item.language_id : undefined}
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
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Niveau"
                                    required
                                >
                                    <Select
                                        placeholder="Sélectionnez le niveau"
                                        value={item.level !== null && item.level !== undefined ? item.level : undefined}
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
                ))}

                {/* Add Button */}
                <div className="flex justify-center mt-6">
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={addResumeLang}
                        className="flex items-center border-dashed text-gray-600 hover:text-blue-500"
                    >
                        Ajouter une langue
                    </Button>
                </div>
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