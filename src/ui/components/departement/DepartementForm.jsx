import React, { useEffect } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Save } from "lucide-react";

const DepartementForm = ({ initialValues = null, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      // Si mise à jour, remplir le formulaire
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
    // Convertir le fichier Upload en objet unique ou conserver l'URL pour l'existant
    const logoFile = values.logo?.[0]?.originFileObj || values.logo?.[0]?.url || null;
    const payload = {
      ...values,
      logo: logoFile,
    };
    

    // Appeler le handler parent pour création ou mise à jour
    onSubmit(payload);

    message.success(`Département ${initialValues ? "mis à jour" : "créé"} avec succès !`);
    form.resetFields()
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
        <Form.Item label="" name="logo" valuePropName="fileList">
        <Upload
          name="logo"
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Sélectionner le logo</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Département"
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

export default DepartementForm;
