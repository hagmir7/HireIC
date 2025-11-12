import { Form, message, Modal, Select, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

export default function AddToNeed({ open, setOpen, resume }) {
    const [needs, setNeeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const getNeeds = async () => {
      
        
        setLoading(true);
        try {
            const response = await api.get('needs/status/2');
            setNeeds(response.data || []);
        } catch (error) {
            message.error(error.response?.data?.message || 'Erreur de chargement des besoins');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        try {
            await api.post(`needs/${values.need_id}/add-resume`, { resume_id: resume?.id });
            message.success(`${resume?.full_name} a été ajouté avec succès au besoin.`);
            setOpen(false);
            form.resetFields();
        } catch (error) {
            message.error(error.response?.data?.message || "Erreur lors de l'ajout au besoin");
        }
    };

    useEffect(() => {
        if (open) getNeeds();
    }, [open]);

    return (
        <Modal
            title={`Ajouter ${resume?.full_name || ''} aux besoins`}
            open={open}
            footer={null}
            onCancel={() => {
                setOpen(false);
                form.resetFields();
            }}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Besoin"
                    name="need_id"
                    rules={[{ required: true, message: 'Veuillez sélectionner un besoin' }]}
                >
                    <Select
                        placeholder="Sélectionner un besoin"
                        loading={loading}
                        options={needs.map((need) => ({
                            label: `${need.code} - ${need?.service?.name || ''}`,
                            value: need.id,
                        }))}
                        showSearch
                        optionFilterProp="label"
                    />
                </Form.Item>
                <div className='mt-3'>
                    <Form.Item className="text-right mb-0">
                    <Button onClick={() => setOpen(false)} className="mr-2">
                        Annuler
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Ajouter
                    </Button>
                </Form.Item>
                </div>
            </Form>
        </Modal>
    );
}
