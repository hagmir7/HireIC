import { Button, Table, Card, Tag, Divider } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { api } from '../../utils/api';

export default function Evaluation() {
    const [selected, setSelected] = useState();
    const [interview, setInterview] = useState({});

    const fetchData = async () => {
        try {
            const { data } = await api.get('interviews/7');
            setInterview(data);

            setSelected(data?.template?.criteria?.map(item => ({
                key: item.id,
                value: item.id,
                label: item.description,
            })) || []);
        } catch (error) {
            console.error('Error fetching interview data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Description du Critère',
            dataIndex: 'label',
            key: 'label',
            ellipsis: true,
        },
        {
            title: 'Jamais',
            key: 'jamais',
            width: 100,
            onCell: () => ({
                className: 'hover-box',
            }),
        },
        {
            title: 'Base',
            key: 'base',
            width: 100,
            onCell: () => ({
                className: 'hover-box',
            }),
        },
        {
            title: 'Moyen',
            key: 'moyen',
            width: 100,
            onCell: () => ({
                className: 'hover-box',
            }),
        },
        {
            title: 'Acquis',
            key: 'acquis',
            width: 100,
            onCell: () => ({
                className: 'hover-box',
            }),
        },
    ];

    const foooterColumns = [
        {
            title: 'Description du Critère',
            dataIndex: 'label',
            key: 'label',
            ellipsis: true,
        },
        {
            title: 'Jamais',
            key: 'jamais',
            width: 100,
            onCell: () => ({
                className: 'hover-box',
            }),
        },
        {
            title: 'Base',
            key: 'base',
            width: 100,
            onCell: () => ({
                className: 'hover-box',
            }),
        },
        {
            title: 'Moyen',
            key: 'moyen',
            width: 100,
            onCell: () => ({
                className: 'hover-box',
            }),
        },
        {
            title: 'Acquis',
            key: 'acquis',
            width: 100,
            onCell: () => ({
                className: 'hover-box',
            }),
        },
    ];

    const formatDate = (dateString) => {
        if (!dateString) return 'Non spécifiée';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'Non spécifiée';
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
            {/* Header Card */}
            <Card className="mb-6 shadow-sm">
                <div className="text-center mb-2">
                    <h1 className="text-lg font-bold text-gray-800 mb-2">
                        Grille d'évaluation des entretiens d'embauche
                    </h1>
                    <div className="flex justify-center items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <CalendarOutlined />
                            <span>Date: {formatDate(interview?.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FileTextOutlined />
                            <span>Code: {interview?.code || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </Card>
             <div className='py-2'></div>
            {/* Candidate Information */}
            <Card title="Candidature" className="mb-4 shadow-sm" size="small">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <UserOutlined className="text-gray-500" />
                        <span className="text-gray-600">Nom et Prénom:</span>
                        <strong className="text-gray-800">
                            {interview?.resume?.full_name || 'Non spécifié'}
                        </strong>
                    </div>
                    {interview?.post && (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">Post souhaité:</span>
                            <Tag color="blue">{interview.post.name}</Tag>
                        </div>
                    )}
                </div>
            </Card>
             <div className='py-2'></div>
            {/* Jury Information */}
            <Card title="Jury" className="mb-4 shadow-sm" size="small">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <UserOutlined className="text-gray-500" />
                        <span className="text-gray-600">Nom et Prénom:</span>
                        <strong className="text-gray-800">
                            {interview?.responsible?.full_name || 'Non spécifié'}
                        </strong>
                    </div>
                    {interview?.responsible?.post && (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">Fonction:</span>
                            <Tag color="green">{interview.responsible.post.name}</Tag>
                        </div>
                    )}
                </div>
            </Card>
            <div className='py-2'></div>

            {/* Interview Details */}
            <Card title="Détails de l'Entretien" className="mb-6 shadow-sm" size="small">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <CalendarOutlined className="text-gray-500" />
                            <span className="text-gray-600">Date:</span>
                            <strong>{formatDate(interview?.date)}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                            <ClockCircleOutlined className="text-gray-500" />
                            <span className="text-gray-600">Heure:</span>
                            <strong>{formatTime(interview?.date)}</strong>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Tag 
                            color={interview?.type === 1 ? "success" : "default"}
                            className={interview?.type === 1 ? "border-green-400" : ""}
                        >
                            Présentielle
                        </Tag>
                        <Tag 
                            color={interview?.type === 2 ? "processing" : "default"}
                            className={interview?.type === 2 ? "border-blue-400" : ""}
                        >
                            À Distance
                        </Tag>
                    </div>
                </div>
            </Card>
            <div className='py-2'></div>

            <Table
                columns={columns}
                dataSource={selected}
                pagination={false}
                size="small"
                bordered
                rowKey="value"
                className='shadow-sm rounded-2xl overflow-hidden'
                scroll={{ x: 600 }}
            />


            <table className="table-auto border-collapse border mt-3 border-gray-200 w-full text-sm text-left rounded-xl shadow-sm overflow-hidden bg-white">
            <tbody>
                <tr className="border-b border-gray-200">
                <td colSpan="3" className="p-3 border border-gray-200 font-semibold text-center">
                    <strong>Decision finale</strong>
                </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="p-3 border border-gray-200 font-semibold">A retenir</td>
                <td className="p-3 border border-gray-200 font-semibold">List d'attente</td>
                <td className="p-3 border border-gray-200 font-semibold">A elimine</td>
                </tr>

                <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="p-3 border border-gray-200 h-10 hover-box"></td>
                <td className="p-3 border border-gray-200 h-10 hover-box"></td>
                <td className="p-3 border border-gray-200 h-10 hover-box"></td>
                </tr>
            </tbody>
            </table>


        </div>
    )
}