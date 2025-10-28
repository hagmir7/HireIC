import React, { useEffect, useState } from "react";
import {
    Form,
    InputNumber,
    DatePicker,
    Select,
    Button,
    Row,
    Col,
    message,
    Tabs,
    Card,
} from "antd";
import dayjs from "dayjs";
import { api } from "../../utils/api";
import { CircleAlert, Printer, Save } from "lucide-react";
import { handlePrint } from "../../utils/config";

const { Option } = Select;
const { TabPane } = Tabs;

export default function OnboardingForm({ record = null, onClose }) {
    const [form] = Form.useForm();
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [resumeId, setResumeId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState([]);
    const [activityDates, setActivityDates] = useState({}); 

    

    
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

    const getActivities = async () => {
        try {
            const response = await api.get("activities");
            setActivities(response.data);
        } catch {
            message.error("Erreur lors du chargement des activités");
        }
    };

    // --- Hooks ---
    useEffect(() => {
        getResumes();
        getPosts();
        getUsers();
        getActivities();
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

    // --- Handle Activity Date Change ---
    const handleActivityDateChange = (id, date) => {
        setActivityDates((prev) => ({
            ...prev,
            [id]: date ? date.format("YYYY-MM-DD") : null,
        }));
    };

    useEffect(() => {
        if (record && record.activities?.length > 0) {
            // When editing an existing record, set dates from pivot
            const existingDates = {};
            record.activities.forEach((a) => {
                if (a.pivot?.date) {
                    existingDates[a.id] = dayjs(a.pivot.date).format("YYYY-MM-DD");
                }
            });
            setActivityDates(existingDates);
        } else if (!record) {
            // When creating a new record, no default activity dates
            setActivityDates({});
        }
    }, [record, activities]);

    // --- Submit ---
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                hire_date: values.hire_date ? values.hire_date.format("YYYY-MM-DD") : null,
                evaluation_date: values.evaluation_date ? values.evaluation_date.format("YYYY-MM-DD") : null,
                activities: Object.entries(activityDates).map(([id, date]) => ({
                    activity_id: parseInt(id),
                    date,
                })),
            };

            

            if (record) {
                await api.put(`integrations/${record.id}`, payload);
                message.success("Embarquement mis à jour avec succès");
            } else {
                await api.post("integrations", payload);
                message.success("Embarquement créé avec succès");
                form.resetFields();
                setActivityDates({});
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
        <Card className="bg-white rounded-lg shadow-sm">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ period: 0, status: 0 }}
            >
                <Tabs defaultActiveKey="1">
                    {/* TAB 1: ONBOARDING FORM */}
                    <TabPane tab="Onboarding" key="1">
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
                    </TabPane>

                    {/* TAB 2: ONBOARDING ACTIVITIES */}
                    <TabPane tab="Activités d’onboarding" key="2">
                        <div
                            className="p-4 text-gray-600"
                            style={{
                                height: "50vh",
                                overflowY: "auto",
                                overflowX: "hidden",
                                borderRadius: "8px",
                                background: "#fafafa",
                            }}
                        >
                            <p className="font-semibold mb-2">Liste des activités d’onboarding :</p>
                            {activities.length === 0 ? (
                                <p className="text-gray-400 italic">Aucune activité trouvée.</p>
                            ) : (
                                activities.map((activity, i) => (
                                    <Row
                                        key={activity.id}
                                        align="middle"
                                        gutter={[8, 8]}
                                        className="border-b border-gray-200 pb-2 mb-2"
                                    >
                                        <Col xs={24} md={12}>
                                            <span className="font-medium text-gray-700">
                                                {i + 1}. {activity.name}
                                            </span>
                                            {activity.description && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {activity.description}
                                                </p>
                                            )}
                                        </Col>

                                        <Col xs={24} md={12}>
                                            <DatePicker
                                                className="w-full"
                                                format="YYYY-MM-DD"
                                                placeholder="Sélectionnez une date"
                                                value={activityDates[activity.id] ? dayjs(activityDates[activity.id]) : null}
                                                onChange={(date) => handleActivityDateChange(activity.id, date)}
                                            />
                                        </Col>
                                    </Row>
                                ))
                            )}
                        </div>
                    </TabPane>
                </Tabs>

                {/* ONE SINGLE SUBMIT BUTTON */}
                <div className="flex gap-3">
                    <Button type="primary" style={{width: 200}} icon={<Save size={18} className="mt-1" />} htmlType="submit" loading={loading} className="mt-4">
                    {record ? "Modifier l’onboarding" : "Enregistrer l’onboarding"}
                </Button>
                    {record ?
                        <Button classNames="flex items-center" style={{width: 200}} onClick={()=> handlePrint(`integrations/${record.id}/download`)}  className="mt-4" icon={<Printer size={18} className="mt-1"  />}>
                            Imprimer
                        </Button> : ""}
                </div>
            </Form>
        </Card>
    );
}
