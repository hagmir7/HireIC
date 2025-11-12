import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { Save } from "lucide-react";
import { api } from "../utils/api";

const CriteriaForm = ({ initialValues = null, onSubmit }) => {
    const [form] = Form.useForm();
    const [criterias, setCriterias] = useState([]);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
            });
        }
        getCriterias()
    }, [initialValues, form]);

    const handleFinish = (values) => {
        const payload = {
            ...values,
        };
        onSubmit(payload);
        message.success(`Critère ${initialValues ? "modifié" : "créé"} avec succès !`);
        form.resetFields()
    };

    const getCriterias = async () => {
        try {
            const response = await api.get("criteria-types");
            setCriterias(response.data.map(i => ({ label: i.name, value: String(i.id) })));
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
                label="Critère"
                name="description"
                rules={[{ required: true, message: "Veuillez entrer le nom" }]}
            >
                <Input placeholder="Entrez le nom" />
            </Form.Item>

            <Form.Item
                label="Type de compétence"
                name="criteria_type_id"
                rules={[{ required: true, message: "Veuillez entrer le type" }]}
            >
                <Select options={criterias} placeholder="Entrez le type" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" icon={<Save className="mt-1" size={18} />}>
                    {initialValues ? "Modifier" : "Créer"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CriteriaForm;
