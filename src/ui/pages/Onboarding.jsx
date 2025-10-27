import React, { useEffect, useState } from "react";
import { Button, message, Modal, Select } from "antd";
import { RefreshCcw, PlusCircle } from "lucide-react";

import Skeleton from "../components/ui/Sketelon";
import { api } from "../utils/api";
import { formatDate } from "../utils/config";
import OnboardingForm from "../components/onboarding/OnboardingFrom";

export default function Onboarding() {
  const [onboardings, setOnboardings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedOnboarding, setSelectedOnboarding] = useState(null);

  useEffect(() => {
    fetchOnboardings(true);
  }, [filter]);

  const fetchOnboardings = async (reset = false, url = null) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);

    try {
      const endpoint = url
        ? url
        : filter
        ? `integrations?status=${filter}`
        : `integrations`;

      const response = await api.get(endpoint);
      const resData = response.data?.data;

      const items = resData?.data || [];
      const paginationInfo = {
        current_page: resData?.current_page,
        next_page_url: resData?.next_page_url,
        total: resData?.total,
      };

      if (reset) setOnboardings(items);
      else setOnboardings((prev) => [...prev, ...items]);

      setPagination(paginationInfo);
    } catch (error) {
      message.warning(error?.response?.data?.message || "Erreur lors du chargement.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  function getStatusLabel(status) {
    const statuses = {
      0: { label: "En attente", color: "bg-gray-100 text-gray-800 border-gray-300" },
      1: { label: "En cours", color: "bg-blue-100 text-blue-800 border-blue-300" },
      2: { label: "Terminé", color: "bg-green-100 text-green-800 border-green-300" },
      3: { label: "Expiré", color: "bg-red-100 text-red-800 border-red-300" },
      4: { label: "Annulé", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    };
    const s = statuses[status];
    if (!s) return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">__</span>;
    return <span className={`${s.color} border px-2 py-1 rounded`}>{s.label}</span>;
  }

  return (
    <div>
      <div className="flex justify-between items-center pt-2 px-2">
        <h2 className="text-lg font-semibold text-gray-800">Embarquements</h2>
        <div className="flex gap-3">
          <Button onClick={() => fetchOnboardings(true)} className="flex items-center gap-2">
            {loading ? <RefreshCcw className="animate-spin h-4 w-4" /> : <RefreshCcw className="h-4 w-4" />}
            Rafraîchir
          </Button>

          <Select
            style={{ width: 200 }}
            placeholder="Filtrer par statut"
            onChange={(value) => setFilter(value)}
            allowClear
            options={[
              { label: "En attente", value: 0 },
              { label: "En cours", value: 1 },
              { label: "Terminé", value: 2 },
              { label: "Expiré", value: 3 },
              { label: "Annulé", value: 4 },
            ]}
          />

          <Button
            type="primary"
            onClick={() => {
              setSelectedOnboarding(null);
              setOpen(true);
            }}
          >
            <PlusCircle className="h-4 w-4" />
            Créer
          </Button>

          <Modal
            title={selectedOnboarding ? "Modifier un embarquement" : "Créer un embarquement"}
            centered
            open={open}
            onCancel={() => setOpen(false)}
            width="70%"
            footer={null}
          >
            <OnboardingForm
              record={selectedOnboarding}
              onClose={() => {
                setOpen(false);
                fetchOnboardings(true);
              }}
            />
          </Modal>
        </div>
      </div>

      <div className="mt-4 overflow-auto bg-white rounded shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Candidat</th>
              <th className="px-3 py-2 text-left">Code</th>
              <th className="px-3 py-2 text-left">Responsable</th>
              <th className="px-3 py-2 text-left">Date d’évaluation</th>
              <th className="px-3 py-2 text-left">Date d’embauche</th>
              <th className="px-3 py-2 text-left">Statut</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <Skeleton rows={3} columns={7} />
            ) : onboardings.length > 0 ? (
              onboardings.map((item, index) => (
                <tr key={index} className="border-t border-gray-300 hover:bg-gray-50 whitespace-normal">
                  <td className="px-3 py-2 whitespace-nowrap">{item?.resume?.full_name}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{item?.code}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{item?.responsible?.full_name || "__"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{item?.evaluation_date ? formatDate(item.evaluation_date) : "__"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{item?.hire_date ? formatDate(item.hire_date) : "__"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{getStatusLabel(item?.status)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedOnboarding(item);
                        setOpen(true);
                      }}
                    >
                      Modifier
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Aucun embarquement trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {pagination?.next_page_url && (
          <div className="flex justify-center p-4">
            <Button onClick={() => fetchOnboardings(false, pagination.next_page_url)} loading={loadingMore}>
              Charger plus
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
