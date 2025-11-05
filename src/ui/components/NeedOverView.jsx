import { CheckCircle, Clock, PlayCircle, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { api } from '../utils/api';
import { message } from 'antd';

export default function NeedOverView() {
    const [overview, setOverview] = useState({
        pending: "",
        in_progress: "",
        cancelled: "",
        executed: ""
    })



    const stats = [
        {
            label: "En attente",
            value: overview.pending,
            icon: <Clock className="w-6 h-6 text-yellow-500" />,
            color: "text-yellow-600",
        },
        {
            label: "En cours",
            value: overview.in_progress,
            icon: <PlayCircle className="w-6 h-6 text-blue-500" />,
            color: "text-blue-600",
        },
        {
            label: "Annulé",
            value: overview.cancelled,
            icon: <XCircle className="w-6 h-6 text-red-500" />,
            color: "text-red-600",
        },
        {
            label: "Exécuté",
            value: overview.executed,
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            color: "text-green-600",
        },
    ];


    useEffect(async () => {
        try {
            const response = await api.get('needs/overview');
            setOverview(response.data)
        } catch (error) {
            message.error(error.response.data.message || "Errur de chargement la data")
        }
    }, [])

    return (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {stats.map(({ label, value, icon, color }, idx) => (
                <div
                    key={idx}
                    className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-3 flex items-center justify-between"
                >
                    <div className="flex flex-col">
                        <span className={`text-2xl font-bold ${color}`}>{value}</span>
                        <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                            {label}
                        </span>
                    </div>
                    <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg">{icon}</div>
                </div>
            ))}
        </div>

    )
}
