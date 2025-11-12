import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { Save } from "lucide-react";
import { api } from "../utils/api";

const SkillForm = ({ initialValues = null, onSubmit }) => {
  const [form] = Form.useForm();
  const [skillsType, setSkillsType] = useState([]);

  useEffect(() => {
    getSkillsType();
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

  const getSkillsType = async () => {
    try {
      const response = await api.get("skills/type");
      setSkillsType(response.data.map(i => ({ label: i.name, value: String(i.id) })));
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
        label="Compétence"
        name="name"
        rules={[{ required: true, message: "Veuillez entrer le nom" }]}
      >
        <Input placeholder="Entrez le nom" />
      </Form.Item>

      <Form.Item
        label="Type de compétence"
        name="skill_type_id"
        rules={[{ required: true, message: "Veuillez entrer le type" }]}
      >
        <Select options={skillsType} placeholder="Entrez le type" />
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

export default SkillForm;
