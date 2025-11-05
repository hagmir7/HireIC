import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { Save } from "lucide-react";

const SkillTypeForm = ({ initialValues = null, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <Form.Item
          label="Type de compétence"
          name="name"
          rules={[{ required: true, message: "Veuillez entrer le nom" }]}
        >
          <Input placeholder="Entrez le nom" />
        </Form.Item>

      <Form.Item label="Intitulé" name="description">
        <Input.TextArea rows={4} placeholder="Entrez l'intitulé" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          icon={<Save className="mt-1" size={18} />}
        >
          {initialValues ? "Modifier" : "Créer"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SkillTypeForm;
