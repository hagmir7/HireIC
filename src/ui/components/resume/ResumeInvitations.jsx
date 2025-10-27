import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../../utils/api";
import { Clock } from "lucide-react";

export default function ResumeInvitations({ resume_id }) {

    const [data, setData] = useState({});

    const fetchData = async () => {
        try {
            const response = await api.get(`resumes/${resume_id}/invitations`);
            setData(response.data);
        } catch (error) {
            console.error(error);
            alert("Erreur de chargement des données");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    function getInvitationStatusLabel(value) {
        switch (value) {
            case 1:
                return (
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 border-yellow-700 rounded-full text-xs font-semibold border ">
                        En attente
                    </span>
                );
            case 2:
                return (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 border-blue-700 rounded-full text-xs font-semibold border ">
                        Entretien planifié
                    </span>
                );
            case 3:
                return (
                    <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 border-orange-700 rounded-full text-xs font-semibold border ">
                        Appel manqué
                    </span>
                );
            case 4:
                return (
                    <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 border-red-700 rounded-full text-xs font-semibold border ">
                        Refusé
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 border-gray-700 rounded-full text-xs font-semibold border ">
                        Inconnu
                    </span>
                );
        }
    }



    return (
        <div className="mx-auto bg-white overflow-hidden border border-gray-200">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-4">
                <h1 className="text-xl font-bold">{data.full_name}</h1>
                <p className="text-sm mt-1">{data.email} • {data.phone}</p>
                <p className="text-sm">{data.address} — {data.city?.name}</p>
            </div>

            <div className="p-4 space-y-8">
                {/* Personal Info */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-800 pb-1 mb-2">Invitations {data?.invitations ? (<>({data?.invitations?.length})</>) : ''}</h2>
                    <div className="overflow-x-auto border rounded-lg border-gray-300 overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Code</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date d'invetation</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Etat</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date d'entretien</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.invitations?.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150 whitespace-nowrap">
                                        <td className="px-3 py-2 text-sm font-medium text-gray-900">{item.id}</td>
                                      
                                       <td className="px-3 py-2 text-sm text-gray-700">
                                            {item.type == null ? (
                                                <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                                __
                                                </span>
                                            ) : item.type === 1 ? (
                                                <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                Présentiel
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                En ligne
                                                </span>
                                            )}
                                            </td>

                                          <td className="px-3 py-2 text-sm font-medium text-gray-900"> {item.date ? dayjs(item.date).format("DD/MM/YYYY HH:mm") : <Clock className="text-gray-600" size={15} />}</td>
                                          
                                                                                    
                                            <td className="px-3 py-2 text-sm">
                                            {getInvitationStatusLabel(Number(item.status))}
                                            </td>

                                        <td className="px-3 py-2 text-sm font-medium text-gray-900">
                                             {item.interview_date ? dayjs(item.interview_date).format("DD/MM/YYYY HH:mm") : <Clock className="text-gray-600" size={15} />}
                                        </td>

                                        <td className="px-3 py-2 text-sm text-gray-700">
                                            {dayjs(item.created_at).format("DD/MM/YYYY HH:mm")}
                                        </td>
                                     
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Footer */}
                <div className="pt-4">
                    <p className="text-xs text-gray-500 text-right">
                        Créé le : {new Date(data.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
