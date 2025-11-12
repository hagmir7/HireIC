import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { Save } from "lucide-react";
import { api } from "../utils/api";

const WorkPostForm = ({ initialValues = null, onSubmit }) => {
    const [form] = Form.useForm();
    const [services, setServices] = useState([]);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
            });
        }
        getServices()
    }, [initialValues, form]);

    const handleFinish = (values) => {
        const payload = {
            ...values,
        };
        onSubmit(payload);
        message.success(`Poste de travail ${initialValues ? "modifié" : "créé"} avec succès !`);
        form.resetFields()
    };

    const getServices = async () => {
        try {
            const response = await api.get("services");
            setServices(response.data.map(i => ({ label: i.name, value: String(i.id) })));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            style={{ maxWidth: 600, margin: "0 auto" }}
        >
            <Form.Item
                label="Poste de travail"
                name="name"
                rules={[{ required: true, message: "Veuillez entrer le nom" }]}
            >
                <Input placeholder="Entrez le nom" />
            </Form.Item>

            <Form.Item
                label="Service"
                name="service_id"
                rules={[{ required: true, message: "Veuillez entrer le type" }]}
            >
                <Select options={services} placeholder="Entrez le type" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" icon={<Save className="mt-1" size={18} />}>
                    {initialValues ? "Modifier" : "Créer"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default WorkPostForm;
