import React from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { Lock } from 'lucide-react';
import { api } from '../utils/api';

const { Title } = Typography;

export default function PasswordUpdate({ UserId }) {
    const [form] = Form.useForm();

    const handleFinish = async (values) => {
        try {
            const response = await api.post(`user/${UserId}/password`, values);
            message.success(response.data.message || 'Mot de passe mis à jour');
            form.resetFields();
        } catch (error) {
            const msg = error?.response?.data?.message || 'Une erreur est survenue';
            const errors = error?.response?.data?.errors;
            if (errors) {
                Object.values(errors).forEach(err => message.error(err[0]));
            } else {
                message.error(msg);
            }
        }
    };

    return (
        <div className="w-full">
            <div className="w-full max-w-full">
                <h2 className='text-md font-semibold mb-2'>Changer le mot de passe</h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    className="w-full"
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        name="password"
                        label="Nouveau mot de passe"
                        rules={[{ required: true, message: 'Veuillez entrer le nouveau mot de passe' }]}
                        style={{ width: '100%' }}
                    >
                        <Input.Password
                            size='large'
                            prefix={<Lock className="text-gray-400" size={15} />}
                            placeholder="Nouveau mot de passe"
                            className="w-full"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password_confirmation"
                        label="Confirmation du nouveau mot de passe"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Veuillez confirmer le mot de passe' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                                },
                            }),
                        ]}
                        style={{ width: '100%' }}
                    >
                        <Input.Password
                            size='large'
                            prefix={<Lock className="text-gray-400" size={15} />}
                            placeholder="Confirmation du mot de passe"
                            className="w-full"
                        />
                    </Form.Item>

                    <Form.Item style={{ width: '100%' }}>
                        <Button type="primary" htmlType="submit" className="w-full py-2 rounded-full">
                            Mettre à jour
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
