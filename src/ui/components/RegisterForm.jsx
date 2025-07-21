import React, { useState } from 'react';
import {
    Alert,
    Button,
    Form,
    Input,
    Space,
    Typography,
    message as antMessage
} from 'antd';
import {
    Loader2,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    User,
    Mail,
    Phone,
    Lock
} from 'lucide-react';
import { api } from '../utils/api';

const RegisterForm = () => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        full_name: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [errorsMessage, setErrorsMessage] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (values) => {
        setErrorsMessage([]);
        setIsLoading(true);

        try {
            const response = await api.post('register', values); // use values instead of formData
            setIsError(false);
            if (response.data.status === "error") {
                setErrorsMessage(response.data.errors);
                antMessage.error('Please fix the errors in the form');
            } else {
                setMessage('User registered successfully!');
                antMessage.success('Registration successful!');
                form.resetFields();
            }
        } catch (err) {
            console.error(err);
            setIsError(true);
            setMessage("Registration failed");
            antMessage.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }

        setTimeout(() => {
            setErrorsMessage([]);
            if (!isError) setMessage('');
        }, 5000);
    };


    return (
        <div className="w-full mx-auto mt-3">
            <Space direction="vertical" size="middle" className="w-full">


                {message && (
                    <Alert
                        message={message}
                        type={isError ? "error" : "success"}
                        showIcon
                        icon={isError ? <AlertCircle /> : <CheckCircle />}
                        closable
                        className="mb-4"
                    />
                )}

                {errorsMessage.length > 0 && (
                    <Alert
                        message="Validation Errors"
                        description={
                            <ul className="list-disc pl-4">
                                {errorsMessage.map((msg, index) => (
                                    <li key={index}>{msg}</li>
                                ))}
                            </ul>
                        }
                        type="error"
                        showIcon
                        closable
                        className="mb-4"
                    />
                )}

                <Form
                    form={form}
                    layout="vertical"
                    className="space-y-4"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="full_name"
                        rules={[{ required: true, message: 'Veuillez saisir votre nom complet !' }]}
                    >
                        <Input
                            prefix={<User className="text-gray-400" size={18} />}
                            placeholder="Nom complet"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Veuillez saisir votre nom d\'utilisateur !' }]}
                    >
                        <Input
                            prefix={<User className="text-gray-400" size={18} />}
                            placeholder="Nom d'utilisateur"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Veuillez saisir votre adresse e-mail !'
                            },
                            {
                                type: 'email',
                                message: 'Veuillez entrer une adresse e-mail valide !'
                            }
                        ]}
                    >
                        <Input
                            prefix={<Mail className="text-gray-400" size={18} />}
                            placeholder="Adresse e-mail"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                    >
                        <Input
                            prefix={<Phone className="text-gray-400" size={18} />}
                            placeholder="Numéro de téléphone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Veuillez saisir votre mot de passe !' },
                            { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères !' }
                        ]}
                    >
                        <Input.Password
                            prefix={<Lock className="text-gray-400" size={18} />}
                            placeholder="Mot de passe"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            size="large"
                            iconRender={(visible) =>
                                visible ?
                                    <EyeOff className="text-gray-400" size={18} /> :
                                    <Eye className="text-gray-400" size={18} />
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="password_confirmation"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Veuillez confirmer votre mot de passe !' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Les deux mots de passe ne correspondent pas !'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<Lock className="text-gray-400" size={18} />}
                            placeholder="Confirmer le mot de passe"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            size="large"
                            iconRender={(visible) =>
                                visible ?
                                    <EyeOff className="text-gray-400" size={18} /> :
                                    <Eye className="text-gray-400" size={18} />
                            }
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={isLoading}
                            className=" mt-4"
                            icon={isLoading ? <Loader2 className="animate-spin" /> : null}
                        >
                            {isLoading ? 'Traitement en cours...' : 'S\'inscrire'}
                        </Button>
                    </Form.Item>
                </Form>

            </Space>
        </div>
    );
};

export default RegisterForm;