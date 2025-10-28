import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { Save } from "lucide-react";

const LevelForm = ({ initialValues = null, onSubmit }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            const logoFileList = initialValues.logo
                ? [
                    {
                        uid: "-1",
                        name: "Logo",
                        status: "done",
                        url: initialValues.logo,
                    },
                ]
                : [];

            form.setFieldsValue({
                ...initialValues,
                logo: logoFileList,
            });
        }
    }, [initialValues, form]);

    const handleFinish = (values) => {
        const logoFile = values.logo?.[0]?.originFileObj || values.logo?.[0]?.url || null;
        const payload = {
            ...values,
            logo: logoFile,
        };

        onSubmit(payload)
        form.resetFields()

        
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            style={{ maxWidth: 600, margin: "0 auto" }}
        >

            <div className="flex gap-2">
                <Form.Item
                    label="Diplôme"
                    name="name"
                    rules={[{ required: true, message: "Veuillez entrer le nom" }]}
                >
                    <Input placeholder="Entrez le nom" />
                </Form.Item>

                <Form.Item
                    label="Années (Bac+)"
                    name="years"
                    rules={[{ required: true, message: "Veuillez entrer années (Bac+)" }]}
                >
                    <Input placeholder="Entrez années (Bac+)" />
                </Form.Item>

                <Form.Item
                    label="Coefficient"
                    name="coefficient"
                    rules={[{ required: true, message: "Veuillez entrer le coefficient" }]}
                >
                    <Input placeholder="Entrez le coefficient" />
                </Form.Item>
            </div>

            <Form.Item label="Intitulé" name="description">
                <Input.TextArea rows={4} placeholder="Entrez l'ntitulé" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" icon={<Save className="mt-1" size={18} />}>
                    {initialValues ? "Modifier" : "Créer"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LevelForm;
