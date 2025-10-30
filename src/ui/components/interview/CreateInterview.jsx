import { Form, Input, Select, DatePicker, Button, Typography, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../utils/api";
import { ArrowRight, CircleCheckBig, ListCheck } from "lucide-react";
import dayjs from "dayjs";
import { useAuth } from "../../contexts/AuthContext";
import { handleShow } from "../../utils/config";

const { Title } = Typography;

export default function CreateInterview({ onSuccess }) {
  const { id } = useParams();
  const interviewId = id || null;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [posts, setPosts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();



  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    getUsers();
    getCompanies();
    getPosts();
    getTemplates();

    if (interviewId) {
      getInterview(interviewId);
    }
  }, [interviewId]);

  // --- fetch data from API ---
  const getUsers = async () => {
    try {
      const response = await api.get("users");
      setUsers(response.data.map((u) => ({ label: u.full_name, value: u.id })));
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };

  const getCompanies = async () => {
    try {
      const response = await api.get("companies");
      setCompanies(response.data.map((c) => ({ label: c.name, value: c.id })));
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };

  const getPosts = async () => {
    try {
      const response = await api.get("posts");
      setPosts(response.data.map((p) => ({ label: p.title, value: p.id })));
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };

  const getTemplates = async () => {
    try {
      const response = await api.get("templates");
      setTemplates(response.data.map((t) => ({ label: t.name + " - " + t.code, value: t.id })));
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };

  const getInterview = async (id) => {
    try {
      const response = await api.get(`interviews/${id}`);
      const data = response.data;

      form.setFieldsValue({
        code: data.code,
        responsible_id: data.responsible_id,
        user_id: data.user_id,
        resume_id: data.resume_id,
        post_id: data.post_id,
        template_id: data.template_id,
        company_id: data.company_id,
        decision: data.decision,
        type: data.type,
        date: data.date ? dayjs(data.date) : null,
      });
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };

  // --- handle submit ---
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        date: values.date ? values.date.format("YYYY-MM-DD HH:mm:ss") : null,
      };

      let response;
      if (interviewId) {
        response = await api.put(`interviews/${interviewId}`, payload);
        message.success("Interview updated successfully");
      } else {
        response = await api.post("interviews", payload);
        message.success("Interview créée avec succès");
        navigate(`/interview/create/${response.data.id}`);

      }

      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

    const handleSearch = async (value) => {

      if (!value && !queryParams.get('resume_id')) {
        setOptions([]);
        return;
      }
      setFetching(true);

      try {
        const response = await api.get('resumes/list', {
          params: { q: value, per_page: 30, resume_id: queryParams.get('resume_id') }
        });

        setOptions(
          response.data.data.map((resume) => ({
            label: `${resume.full_name} (${resume.phone})`,
            value: resume.id,
          }))
        );
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }

      setFetching(false);
    };



  useEffect(() => {
    handleSearch()
    if (users.length > 0 && !interviewId && user?.id) {
      form.setFieldValue('responsible_id', user.id);
    }

    if (options.length > 0 && !id) {
      form.setFieldValue('resume_id', Number(queryParams.get('resume_id')));
    }
  }, [users, user, interviewId, form, ]);

  



  return (
    <div className="p-4">
      <Form onFinish={handleSubmit} form={form} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Form.Item
            name="responsible_id"
            label="Responsable"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Responsable est requis" }]}
          >
            <Select
              placeholder="Sélectionnez le responsable"
              options={users}
              showSearch
              defaultValue={user.name ? { label: user.name, value: user.id } : ""}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="user_id"
            label="Candidat (Utilisateur)"
            style={{ marginBottom: 0 }}
            rules={[
              {
                validator: (_, value) => {
                  const resumeId = form.getFieldValue('resume_id');
                  if (!value && !resumeId) {
                    return Promise.reject(new Error('Veuillez sélectionner soit un candidat soit un CV'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Select
              placeholder="Sélectionnez le candidat"
              options={users}
              allowClear
              showSearch
            />
          </Form.Item>

          <Form.Item
            name="resume_id"
            label="CV"
            style={{ marginBottom: 0 }}
            rules={[
              {
                validator: (_, value) => {
                  const userId = form.getFieldValue('user_id');
                  if (!value && !userId) {
                    return Promise.reject(new Error('Veuillez sélectionner soit un candidat soit un CV'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            initialValue={queryParams.get('resume_id') ? Number(queryParams.get('resume_id')) : undefined}
          >
            <Select
              showSearch
              placeholder="Sélectionnez un CV"
              allowClear
              onSearch={handleSearch}
              filterOption={false}
              notFoundContent={fetching ? 'Chargement...' : null}
              options={options}
            />
          </Form.Item>

 

          <Form.Item name="post_id" label="Poste" style={{ marginBottom: 0 }}>
            <Select
              placeholder="Sélectionnez le poste"
              options={posts}
              allowClear
              showSearch
            />
          </Form.Item>

          <Form.Item name="template_id" label="Modèle" style={{ marginBottom: 0 }} rules={[{ required: true, message: "Modèle d'entretien est requis" }]}>
            <Select
              placeholder="Sélectionnez un modèle"
              options={templates}
              allowClear
              showSearch
            />
          </Form.Item>

          <Form.Item name="company_id" label="Entreprise" style={{ marginBottom: 0 }}>
            <Select
              placeholder="Sélectionnez l’entreprise"
              options={companies}
              allowClear
              showSearch
            />
          </Form.Item>

          <Form.Item name="type" label="Type" rules={[{ required: true, message: "Le type d’entretien est requis" }]} style={{ marginBottom: 0 }}>
            <Select placeholder="Sélectionnez le type">
              <Select.Option value={1}>En présentiel</Select.Option>
              <Select.Option value={2}>À distance</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Date d'entretien"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Date d'entretien est requis" }]}
            initialValue={dayjs()}
          >
            <DatePicker
              className="w-full"
              showTime
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>



        </div>

        <div className="flex justify-end">
          <Space>
            <Button
              htmlType="submit"
              type="primary"
              loading={loading}
              icon={<CircleCheckBig size={14} />}
            >
              {interviewId ? "Modifier" : "Enregistrer"}
            </Button>

            {
              interviewId ? <Button
                color="cyan" variant="solid"
                loading={loading}
                iconPosition="end"
                onClick={()=> handleShow(`interview/evaluation/${interviewId}`, 1000, 550)}
                icon={<ArrowRight size={14} />}
              >
                Lancer l'entretien
              </Button> : ""
            }
          </Space>
        </div>
      </Form>
    </div>
  );
}
