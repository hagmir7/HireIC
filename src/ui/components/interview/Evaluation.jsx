import {
  Table,
  Card,
  Tag,
  message,
  Button
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useParams } from "react-router-dom";

export default function Evaluation() {
  const [selected, setSelected] = useState([]);
  const [interview, setInterview] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [type, setType] = useState(interview?.type ?? null);

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`interviews/${id}`);
      setInterview(data);

      const criteria =
        data?.template?.criteria?.map((item) => {
          const existing = data?.criteria?.find((c) => c.id === item.id);
          return {
            key: item.id,
            value: item.id,
            label: item.description,
            note: existing?.pivot?.note || null, // keep note if already exists
          };
        }) || [];

      setSelected(criteria);
      setLoading(false)
    } catch (error) {
        setLoading(false)
      console.error("Error fetching interview data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]); // Add id as dependency

  const evaluateCriteria = async (note, criteria) => {
    try {
      const payload = {
        criteria_id: criteria.value,
        note: note,
      };
      // Fix: Use the actual id from params instead of hardcoded 7
      const { data } = await api.post(
        `interviews/evaluate-criteria/${id}`,
        payload
      );

      // Update local state instantly
      setSelected((prev) =>
        prev.map((item) =>
          item.value === criteria.value ? { ...item, note } : item
        )
      );
      setInterview(data);

      message.success("Note enregistrée avec succès");
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Erreur lors de l'évaluation"
      );
    }
  };

  const renderCell = (record, noteValue, label) => {
    const isSelected = record.note === noteValue;
    return (
      <div
        onClick={() => evaluateCriteria(noteValue, record)}
        className={`flex justify-center items-center h-8 cursor-pointer rounded 
        ${
          isSelected
            ? "bg-green-100 text-green-600 font-bold"
            : "hover:bg-gray-100"
        }`}
      >
        {isSelected ? <CheckOutlined /> : label}
      </div>
    );
  };

  const columns = [
    {
      title: "Description du Critère",
      dataIndex: "label",
      key: "label",
      ellipsis: true,
    },
    {
      title: "Jamais",
      key: "jamais",
      width: 120,
      render: (_, record) => renderCell(record, 1, "1"),
    },
    {
      title: "Base",
      key: "base",
      width: 120,
      render: (_, record) => renderCell(record, 2, "2"),
    },
    {
      title: "Moyen",
      key: "moyen",
      width: 120,
      render: (_, record) => renderCell(record, 3, "3"),
    },
    {
      title: "Acquis",
      key: "acquis",
      width: 120,
      render: (_, record) => renderCell(record, 4, "4"),
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifiée";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Non spécifiée";
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
              <span>Code: {interview?.code || "N/A"}</span>
            </div>
          </div>
        </div>
      </Card>
      <div className="mb-2"></div>

      {/* Candidate Information */}
      <div className="flex gap-2">
        <Card title="Candidature" className="mb-4 shadow-sm" size="small">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <UserOutlined className="text-gray-500" />
            <span className="text-gray-600 whitespace-nowrap">Nom et Prénom:</span>
            <strong className="text-gray-800 whitespace-nowrap ">
              {interview?.resume?.full_name || "Non spécifié"}
            </strong>
          </div>
          {interview?.post && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Post souhaité:</span>
              <Tag color="blue" ><span className="whitespace-nowrap">{interview.post.name}</span></Tag>
            </div>
          )}
        </div>
      </Card>


      {/* Jury Information */}
      <Card title="Jury" className="mb-4 shadow-sm" size="small">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <UserOutlined className="text-gray-500" />
            <span className="text-gray-600 whitespace-nowrap">Nom et Prénom:</span>
            <strong className="text-gray-800 whitespace-nowrap">
              {interview?.responsible?.full_name || "Non spécifié"}
            </strong>
          </div>
          {interview?.responsible?.post && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Fonction:</span>
              <Tag color="green">{interview.responsible.post.name} </Tag>
            </div>
          )}
        </div>
      </Card>
      </div>
      <div className="mb-2"></div>

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
                <Button
                    type={type === 1 ? "primary" : "default"}
                    onClick={() => setType(1)}
                >
                    Présentielle
                </Button>
                <Button
                    type={type === 2 ? "primary" : "default"}
                    onClick={() => setType(2)}
                >
                    À Distance
                </Button>
            </div>
        </div>
      </Card>
      <div className="mb-2"></div>

      {/* Criteria Evaluation Table */}
      <Table
        columns={columns}
        dataSource={selected}
        pagination={false}
        size="small"
        bordered
        rowKey="value"
        loading={loading}
        className="shadow-sm rounded-2xl overflow-hidden"
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
  );
}