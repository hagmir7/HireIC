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
import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function Evaluation() {
  const [selected, setSelected] = useState([]);
  const [interview, setInterview] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [type, setType] = useState(interview?.type ?? null);
  const [decision, setDecision] = useState();

  const fetchData = async () => {
    setLoading(true);
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
            note: existing?.pivot?.note || null,
            type: existing?.criteria_type?.name || "Sans type",
          };
        }) || [];

      setSelected(criteria);

      console.log(criteria);

      setLoading(false);
      setType(data?.type);
      setDecision(data?.decision);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching interview data:", error);
    }
  };

  const handleChangeType = (type) => {
    try {
      setType(type);
      api.post(`interviews/update-type/${id}`, { type });
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Erreur de modification de l’entretien");
    }
  };

  const handleDecisionChange = (decision_) => {
    try {
      setDecision(decision_);
      api.post(`interviews/update-decision/${id}`, { decision: decision_ });
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "Erreur de modification de l’entretien");
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
      const { data } = await api.post(`interviews/evaluate-criteria/${id}`, payload);

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
    // normal criteria row
    const isSelected = record.note === noteValue;
    return (
      <div
        onClick={() => evaluateCriteria(noteValue, record)}
        className={`flex justify-center items-center h-8 cursor-pointer rounded 
          ${isSelected ? "bg-green-100 text-green-600 font-bold" : "hover:bg-gray-100"}`}
      >
        {isSelected ? <CheckOutlined /> : label}
      </div>
    );
  };

  // number of table columns (Description + 4 score columns)
  const TOTAL_COLS = 5;

  // columns definition with group-row-aware renderers
  const columns = [
    {
      title: "Description du Critère",
      dataIndex: "label",
      key: "label",
      ellipsis: true,
      render: (text, record) => {
        // If this is a group header row, return object to span all columns
        if (record.isGroup) {
          return {
            children: (
              <div className="font-semibold text-md text-left pl-2">
                {record.label}
              </div>
            ),
            props: {
              colSpan: TOTAL_COLS,
            },
          };
        }
        // Normal criteria row
        return text;
      },
    },
    {
      title: "Jamais",
      key: "jamais",
      width: 120,
      render: (_, record) => {
        if (record.isGroup) {
          // hide this cell because the group header spanned across
          return { children: null, props: { colSpan: 0 } };
        }
        return renderCell(record, 1, "1");
      },
    },
    {
      title: "Base",
      key: "base",
      width: 120,
      render: (_, record) => {
        if (record.isGroup) return { children: null, props: { colSpan: 0 } };
        return renderCell(record, 2, "2");
      },
    },
    {
      title: "Moyen",
      key: "moyen",
      width: 120,
      render: (_, record) => {
        if (record.isGroup) return { children: null, props: { colSpan: 0 } };
        return renderCell(record, 3, "3");
      },
    },
    {
      title: "Acquis",
      key: "acquis",
      width: 120,
      render: (_, record) => {
        if (record.isGroup) return { children: null, props: { colSpan: 0 } };
        return renderCell(record, 4, "4");
      },
    },
  ];

  // build grouped data for the table: group rows + criteria rows
  const buildGroupedData = (flat) => {
    const groups = {};
    flat.forEach((c) => {
      const g = c.type || "Sans type";
      if (!groups[g]) groups[g] = [];
      groups[g].push(c);
    });

    // produce an array where each group header is a row followed by its criteria
    const rows = [];
    Object.keys(groups).forEach((groupName) => {
      rows.push({
        key: `group-${groupName}`,
        label: groupName,
        isGroup: true,
      });
      groups[groupName].forEach((item) => {
        rows.push({
          ...item,
          isGroup: false,
        });
      });
    });
    return rows;
  };

  const groupedData = buildGroupedData(selected);

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

      {/* Candidate & Jury Info */}
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
              onClick={() => handleChangeType(1)}
            >
              Présentielle
            </Button>
            <Button
              type={type === 2 ? "primary" : "default"}
              onClick={() => handleChangeType(2)}
            >
              À Distance
            </Button>
          </div>
        </div>
      </Card>
      <div className="mb-2"></div>

      {/* Criteria Evaluation Table (grouped) */}
      <Table
        columns={columns}
        dataSource={groupedData}
        pagination={false}
        size="small"
        bordered
        rowKey={(r) => r.key}
        loading={loading}
        className="shadow-sm rounded-2xl overflow-hidden"
        // scroll={{ x: 800 }}
      />

      {/* Decision table */}
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

          <tr className="border-b border-gray-200 transition text-center">
            <td
              className={`p-3 border border-gray-300 h-10 hover:bg-blue-50 cursor-pointer transition ${decision === 1 ? "bg-green-100 border-green-500" : ""
                }`}
              onClick={() => handleDecisionChange(1)}
            >
              <CheckCircle
                size={22}
                className={`mx-auto ${decision === 1 ? "text-green-600" : "text-gray-400"}`}
              />
            </td>

            <td
              className={`p-3 border border-gray-300 h-10 hover:bg-blue-50 cursor-pointer transition ${decision === 2 ? "bg-yellow-100 border-yellow-500" : ""}`}
              onClick={() => handleDecisionChange(2)}
            >
              <Clock
                size={22}
                className={`mx-auto ${decision === 2 ? "text-yellow-600" : "text-gray-400"}`}
              />
            </td>

            <td
              className={`p-3 border border-gray-300 h-10 hover:bg-blue-50 cursor-pointer transition ${decision === 3 ? "bg-red-100 border-red-500" : ""}`}
              onClick={() => handleDecisionChange(3)}
            >
              <XCircle
                size={22}
                className={`mx-auto ${decision === 3 ? "text-red-600" : "text-gray-400"}`}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
