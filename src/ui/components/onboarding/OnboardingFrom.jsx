import React, { useEffect, useState } from "react";
import { Form, InputNumber, DatePicker, Select, Button, Row, Col, message } from "antd";
import dayjs from "dayjs";
import { api } from "../../utils/api";

const { Option } = Select;

export default function OnboardingForm({ record = null, onClose }) {
    const [form] = Form.useForm();
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [resumeId, setResumeId] = useState(null);
    const [loading, setLoading] = useState(false);

    const IntegrationStatusArray = [
        { value: 0, label: "En attente" },
        { value: 1, label: "En cours" },
        { value: 2, label: "Terminé" },
        { value: 3, label: "Expiré" },
        { value: 4, label: "Annulé" },
    ];

    // --- API Fetches ---
    const getPosts = async () => {
        try {
            const response = await api.get("posts");
            setPosts(response.data);
        } catch {
            message.error("Erreur lors du chargement des postes");
        }
    };

    const getUsers = async () => {
        try {
            const response = await api.get("users");
            setUsers(response.data);
        } catch {
            message.error("Erreur lors du chargement des utilisateurs");
        }
    };

    const getResumes = async () => {
        try {
            const response = await api.get("resumes");
            setResumes(response.data.data);
        } catch {
            message.error("Erreur lors du chargement des CVs");
        }
    };

    const getInterviews = async (id) => {
        if (!id) return;
        try {
            const response = await api.get(`resumes/${id}/interviews`);
            setInterviews(response.data.interviews);
        } catch {
            message.error("Erreur lors du chargement des entretiens");
        }
    };

    // --- Hooks ---
    useEffect(() => {
        getResumes();
        getPosts();
        getUsers();
    }, []);

    useEffect(() => {
        if (resumeId) getInterviews(resumeId);
    }, [resumeId]);

    useEffect(() => {
        if (record) {
            form.setFieldsValue({
                ...record,
                hire_date: record.hire_date ? dayjs(record.hire_date) : null,
                evaluation_date: record.evaluation_date ? dayjs(record.evaluation_date) : null,
            });
            if (record.resume_id) {
                setResumeId(record.resume_id);
                getInterviews(record.resume_id);
            }
        } else {
            form.resetFields();
        }
    }, [record]);

    // --- Submit ---
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                hire_date: values.hire_date ? values.hire_date.format("YYYY-MM-DD") : null,
                evaluation_date: values.evaluation_date ? values.evaluation_date.format("YYYY-MM-DD") : null,
            };

            if (record) {
                await api.put(`integrations/${record.id}`, payload);
                message.success("Embarquement mis à jour avec succès");
            } else {
                await api.post("integrations", payload);
                message.success("Embarquement créé avec succès");
                form.resetFields();
            }

            if (onClose) onClose();
        } catch (error) {
            message.error(error?.response?.data?.message || "Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    // --- Render ---
    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ period: 0, status: 0 }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Candidat (CV)"
                            name="resume_id"
                            rules={[{ required: true, message: "Sélectionnez un CV" }]}
                        >
                            <Select
                                placeholder="Choisissez un candidat"
                                onChange={(value) => setResumeId(value)}
                                showSearch
                                allowClear
                            >
                                {resumes.map((r) => (
                                    <Option key={r.id} value={r.id}>
                                        {r.full_name || `${r.first_name} ${r.last_name}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Entretien" name="interview_id">
                            <Select placeholder="Sélectionnez un entretien" allowClear>
                                {interviews.map((i) => (
                                    <Option key={i.id} value={i.id}>
                                        {`Entretien ${i.code || i.id}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Poste" name="post_id">
                            <Select placeholder="Choisissez un poste" allowClear>
                                {posts.map((p) => (
                                    <Option key={p.id} value={p.id}>
                                        {p.title}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Responsable" name="responsible_id">
                            <Select placeholder="Sélectionnez un responsable" allowClear>
                                {users.map((u) => (
                                    <Option key={u.id} value={u.id}>
                                        {u.full_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Date d’embauche" name="hire_date">
                            <DatePicker format="YYYY-MM-DD" className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Date d’évaluation" name="evaluation_date">
                            <DatePicker format="YYYY-MM-DD" className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Période (mois)" name="period">
                            <InputNumber min={0} style={{ width: "100%" }} placeholder="Durée de la période" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Statut" name="status">
                            <Select options={IntegrationStatusArray} />
                        </Form.Item>
                    </Col>
                </Row>

                <Button type="primary" htmlType="submit" loading={loading} block>
                    {record ? "Mettre à jour" : "Enregistrer"}
                </Button>
            </Form>
        </div>
    );
}
