import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { Save } from "lucide-react";

const CategoryForm = ({ initialValues = null, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    const payload = {
      ...values,
    };
    onSubmit(payload);

    message.success(`Category ${initialValues ? "modifié" : "créé"} avec succès!`);
    form.resetFields()
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >

      <Form.Item
        label="Category"
        name="name"
        rules={[{ required: true, message: "Veuillez entrer le nom" }]}
      >
        <Input placeholder="Entrez le nom" />
      </Form.Item>


      <Form.Item label="Description" name="description">
        <Input.TextArea rows={4} placeholder="Entrez la description" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<Save className="mt-1" size={18} />}>
          {initialValues ? "Modifier" : "Créer"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;
