import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  message,
  Modal,
  Popconfirm,
  Select,
  Tag,
  Input,
  DatePicker
} from 'antd';
import {
  RefreshCcw,
  PlusCircle,
  Trash,
  Edit,
  Clock,
  ClipboardList,
  MessageSquare,
  Funnel,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Skeleton from '../components/ui/Sketelon';
import InvitationForm from '../components/ui/InvitationForm';
import { formatDate, InvitationStatus } from '../utils/config';
import RightClickMenu from '../components/ui/RightClickMenu';
const { Search } = Input;
import dayjs from 'dayjs'

export default function Invitation() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false)


  const [filters, setFilters] = useState({
    search: '',
    status: null,
    type: null,
    interview_date: null,
  });

  // ------------------ SELECT ALL ------------------
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(data.map((item) => item.id));
    } else {
      setSelected([]);
    }
  };

  // ------------------ FETCH DATA ------------------
  const fetchData = async () => {
    setLoading(true);
    setOpen(false);
    try {
      const res = await api.get('invitations');
      setData(res.data);
    } catch (error) {
      message.error(error.response?.data?.message || 'Erreur serveur');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ------------------ DELETE ------------------
  const deleteInvitation = async (invitation_id) => {
    try {
      await api.delete(`invitations/${invitation_id}`);
      message.success('Invitation supprimée avec succès.');
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  // ------------------ OPEN INTERVIEW ------------------
  const handleShowInterview = async (id, resume_id) => {
    try {
      const isValidId = typeof id === 'string' || typeof id === 'number';
      const url = `interview/create${isValidId ? `/${id}` : ''}?resume_id=${resume_id}`;
      if (window.electron && typeof window.electron.openShow === 'function') {
        await window.electron.openShow({ path: url, width: 1000, height: 550 });
      } else {
        navigate(`/layout/${url}`);
      }
    } catch (error) {
      console.error('Error navigating to resume:', error);
    }
  };

  // ------------------ UPDATE STATUS ------------------
  const handleStatusChange = async (invitation_id, status) => {
    try {
      await api.put(`invitations/update-status/${invitation_id}`, { status });
      message.success('Invitation modifiée avec succès.');
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Erreur de mise à jour.');
    }
  };

  // ------------------ MENU CLICK HANDLER ------------------
  const handleMenuClick = (key, id) => {
    
    switch (key) {
      
      case 'startInterview':
        handleShowInterview(null, data.find((item) => Number(item.id) === Number(id))?.resume_id);
        break;
      case 'edit':
        setEditId(id);
        setOpen(true);
        break;
      case 'delete':
        deleteInvitation(id);
        break;
      case 'NewInvetation':
        setEditId(null);
        setOpen(true);
        break;
      default:
        break;
    }
  };

  // ------------------ CONTEXT MENU ITEMS ------------------
  const menuItems = [
    { label: "Lancer l'entretien", key: 'startInterview', icon: <ClipboardList size={15} /> },
    { label: 'Nouvelle invitation', key: 'NewInvetation', icon: <MessageSquare size={15} /> },
    { type: 'divider' },
    { label: 'Modifier', key: 'edit', icon: <Edit size={15} /> },
    { label: 'Supprimer', key: 'delete', icon: <Trash size={15} />, danger: true },
  ];

  const statuses = [
    { value: 1, label: "En attente" },
    { value: 2, label: "Planifié" },
    { value: 3, label: "En cours" },
    { value: 4, label: "Achevé" },
    { value: 5, label: "Expiré" },
    { value: 6, label: "Annulé" }
  ];

  const types = [
    {
      label: "En présentiel",
      value: 1
    },
    {
      label: "À distance",
      value: 2
    }
  ]

 // ------------------ FILTER HANDLERS ------------------
  const onSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
    fetchData({ search: value });
  };

  const onChangeStatus = (value) => {
    setFilters((prev) => ({ ...prev, status: value }));
    fetchData({ status: value });
  };

  const onChangeType = (value) => {
    setFilters((prev) => ({ ...prev, type: value }));
    fetchData({ type: value });
  };

  const onChangeDate = (date) => {
    const formatted = date ? dayjs(date).format('YYYY-MM-DD') : null;
    setFilters((prev) => ({ ...prev, interview_date: formatted }));
    fetchData({ interview_date: formatted });
  };

  const resetFilters = () => {
    setFilters({ search: '', status: null, type: null, interview_date: null });
    fetchData({});
  };


  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* ------------------ HEADER ------------------ */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Invitations</h2>
            <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setOpenFilter(!openFilter)}
              className={`flex items-center gap-1 transition-colors duration-200 ${
                openFilter
                  ? "bg-blue-100 text-blue-600 border-blue-400"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              } border rounded-md px-2 py-1`}
            >
              <Funnel className="h-4 w-4" />
              {openFilter && <span>Filtre actif</span>}
            </Button>


              <Button type="primary" onClick={() => {
                setEditId(null)
                setOpen(true)
              }}>
                <PlusCircle className="h-4 w-4" />
                Créer
              </Button>

               <Modal
                title="Créer une invitation"
                centered
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width="60%"
              >
                <InvitationForm id={editId} fetchItems={fetchData} />
              </Modal>

              <Button onClick={fetchData} className="flex items-center gap-2 hover:shadow-md">
                {loading ? <RefreshCcw className="animate-spin h-4 w-4" /> : <RefreshCcw className="h-4 w-4" />}
                Rafraîchir
              </Button>

              
            
             
            </div>
           
          </div>

         {openFilter && (
            <div className="flex flex-wrap gap-2 justify-end mt-3">
              <Search
                placeholder="Rechercher par nom complet, email..."
                onSearch={onSearch}
                style={{ width: 200 }}
                allowClear
              />
              <Select
                options={statuses}
                style={{ width: 150 }}
                placeholder="Statut"
                value={filters.status}
                onChange={onChangeStatus}
                allowClear
              />
              <Select
                options={types}
                style={{ width: 150 }}
                placeholder="Type"
                value={filters.type}
                onChange={onChangeType}
                allowClear
              />
              <DatePicker
                onChange={onChangeDate}
                value={filters.interview_date ? dayjs(filters.interview_date) : null}
                placeholder="Date d'entretien"
              />
            </div>
          )}


        </div>
        
      </div>

      {/* ------------------ TABLE ------------------ */}
      <div className="flex-1 overflow-hidden">
        <div className="mx-auto pt-4 h-full">
          <div className="h-full bg-white border border-gray-200 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <div className="w-full overflow-x-auto">
                <table className="min-w-[900px] w-full">
                  <thead className="sticky top-0 bg-gradient-to-b from-gray-50 to-gray-100 shadow-sm z-10">
                    <tr>
                      <th className="px-2 py-2 border-r border-gray-200">
                        <Checkbox
                          onChange={handleSelectAll}
                          checked={selected.length === data.length && data.length > 0}
                        />
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-semibold text-gray-600 border-r border-gray-200">
                        Nom CV
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-semibold text-gray-600 border-r border-gray-200">
                        Date d’envoi
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-semibold text-gray-600 border-r border-gray-200">
                        Date d'entretien
                      </th>
                     
                      <th className="px-2 py-2 text-left text-sm font-semibold text-gray-600 border-r border-gray-200">
                        Type
                      </th>
                      <th className="px-2 py-2 text-left text-sm font-semibold text-gray-600">
                        Statut
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {loading ? (
                      <Skeleton rows={3} columns={7} />
                    ) : data.length > 0 ? (
                      data.map((item, index) => (
                        <RightClickMenu
                          key={item?.id}
                          menuItems={menuItems.map((menuItem) => ({
                            ...menuItem,
                            id: item.id,
                          }))}
                          onItemClick={handleMenuClick}
                        >
                          <tr
                            key={item.id}
                            className={`border-b border-gray-200 hover:bg-blue-50 whitespace-nowrap ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="px-2 py-1  border-gray-200 whitespace-nowrap pl-3">
                              <Checkbox
                                checked={selected.includes(item.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelected([...selected, item.id]);
                                  } else {
                                    setSelected(selected.filter((id) => id !== item.id));
                                  }
                                }}
                              />
                            </td>

                            <td className="px-2 py-1 text-sm border-r border-gray-200 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{item?.resume?.full_name}</div>
                              <div className="text-xs text-gray-500">{item?.resume?.email}</div>
                            </td>

                            <td className="px-2 py-1 text-sm border-r border-gray-200 whitespace-nowrap">
                              {formatDate(item.date)}
                            </td>

                            <td className="px-2 py-1 text-sm border-r border-gray-200 whitespace-nowrap">
                              {formatDate(item.interview_date)}
                            </td>

                            <td className="px-2 py-1 text-sm border-r border-gray-200 whitespace-nowrap">
                              {item ? (
                                item.type === 1 ? (
                                  'En présentiel'
                                ) : item.type === 2 ? (
                                  'À distance'
                                ) : (
                                  <Clock size={20} className="text-gray-500" />
                                )
                              ) : (
                                <Clock size={20} className="text-gray-500" />
                              )}
                            </td>

                            <td className="px-2 py-1 text-sm whitespace-nowrap">
                              <Select
                                size="small"
                                value={item.status}
                                style={{ width: 150 }}
                                onChange={(value) => handleStatusChange(item.id, value)}
                                options={Object.entries(InvitationStatus()).map(([key, { label }]) => ({
                                  value: Number(key),
                                  label,
                                }))}
                              />
                            </td>
                          </tr>
                        </RightClickMenu>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-8 text-center">
                          <div className="text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                              />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                              Aucune invitation trouvée
                            </h3>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
