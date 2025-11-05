import React, { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { Button, Empty, message, Modal, Popconfirm, Select, Typography, } from 'antd'
import { PlusCircle, RefreshCcw, Undo2, Filter, Eye, ClipboardList, Settings2, MessageSquare, Edit, Trash, CircleAlert } from 'lucide-react'
import Skeleton from '../components/ui/Sketelon'
import NeedForm from '../components/NeedForm'
import { formatDate } from '../utils/config'
import { useNavigate } from 'react-router-dom'
import NeedOverView from '../components/NeedOverView'
import RightClickMenu from '../components/ui/RightClickMenu'


const Needs = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(0);
  const navigate = useNavigate();
  const {confirm} = Modal

  const [openResponsive, setOpenResponsive] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get(`needs?status=${statusFilter}`)
      setData(res.data)
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Erreur serveur');
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [statusFilter])

  const handleShow = async (need_id) => {
    try {

      const url = `needs/view/${need_id}`
      if (window.electron && typeof window.electron.openShow === 'function') {
        await window.electron.openShow({ path: url, width: 1300, height: 750 })
      } else {
        navigate(`/layout/${url}`)
      }
    } catch (error) {
      console.error('Error navigating to resume:', error)
    }
  }


  const updateStatus = async (need_id, value) => {
    try {
      const response = await api.post(`needs/${need_id}/update-status`, {
        status: value
      })
      message.success("Le besoin est édité avec succès")
    } catch (error) {
      message.error(error.response.data.message || "Erreur de modifier le besoin")
    }
  }

   const handleMenuClick = (key, id) => {
      switch (key) {
        case "startInterview":
          handleShowInterview(null, id);
          break;
        case "edit":
          handleShow(`/resume/create/${id}`);
          break;
        case 'delete':
          showDeleteConfirm(id);
          break;
        case 'NewInvetation':
          newInvetationConfirm(id)
          break;
        case 'view':
           handleShow(`view-resume/${id}`)
        default:
      }
    };
  
    const items = [
      { label: 'Voir le CV', key: 'view', icon: <Eye size={15} /> },
      { label: "Lancer l'entretien", key: "startInterview", icon: <ClipboardList size={15} /> },
      { label: "Changer l'état", key: "changeStatus", icon: <Settings2 size={15} /> },
      { label: "Nouvelle invitation", key: "NewInvetation", icon: <MessageSquare size={15} /> },
      { type: "divider" },
      { label: "Modifier", key: "edit", icon: <Edit size={15} /> },
      { label: "Supprimer", key: "delete", icon: <Trash size={15} />, danger: true, },
    ];

     const handleDelete = async (id) => {
    try {
      const response = await api.delete(`needs/${id}`)
      message.success(response.data.message);
    } catch (error) {
      console.error(error?.response?.data?.message || "Errur de supprimer le besoin");
    }
  }



  const showDeleteConfirm = (id) => {
    confirm({
      title: '  Etes-vous sûr de vouloir supprimer cet élément ?',
      icon: <CircleAlert size={25} className='text-red-600 mt-1 mr-2' color='red' />,
      content: 'Cette action ne peut pas être annulée.',
      okText: 'Oui, supprimez-le',
      okType: 'danger',
      cancelText: 'Annuler',
      onOk() {
        handleDelete(id);
      }
    });
  };
  


  return (
    <div className='h-full flex flex-col bg-gray-50'>
      <div className='bg-white border-b border-gray-200 shadow-sm'>
        <div className='p-4'>
          <NeedOverView />
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2">
            {/* Left side - Title */}
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              Besoins
            </h2>

            {/* Right side - Controls */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              {/* Reset button if status < 8 */}
              {Number(data?.docentete?.document?.status_id) < 8 && (
                <Popconfirm
                  title="Réinitialiser la commande"
                  description="Êtes-vous sûr de vouloir réinitialiser cette tâche ?"
                  okText="Réinitialiser"
                  cancelText="Annuler"
                >
                  <Button
                    danger
                    className="flex items-center gap-2 hover:shadow-md transition-all"
                  >
                    <Undo2 size={18} />
                    <span>Réinitialiser</span>
                  </Button>
                </Popconfirm>
              )}

              {/* Refresh button */}
              <Button
                onClick={fetchData}
                className="flex items-center gap-2 hover:shadow-md transition-all"
              >
                {loading ? (
                  <RefreshCcw className="animate-spin h-4 w-4 [animation-direction:reverse]" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
                <span>Rafraîchir</span>
              </Button>

              {/* Status filter */}
              <Select
                style={{ width: 180 }}
                placeholder="Filtre d'état"
                onChange={(value) => setStatusFilter(value)}
                options={[
                  { label: "Tous", value: 0 },
                  { label: "En attente", value: 1 },
                  { label: "En cours", value: 2 },
                  { label: "Annulé", value: 3 },
                  { label: "Exécuté", value: 4 },
                ]}
              />

              {/* Create new besoin */}
              <Button
                type="primary"
                onClick={() => setOpenResponsive(true)}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Créer</span>
              </Button>

              <Modal
                title="Créer un nouveau besoin"
                centered
                open={openResponsive}
                onOk={() => setOpenResponsive(false)}
                onCancel={() => setOpenResponsive(false)}
                width="60%"
                className="max-sm:w-[90%]"
              >
                <NeedForm fetchData={fetchData} />
              </Modal>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 overflow-hidden'>
        <div className='mx-auto pt-4 h-full'>
          {/* Desktop Table */}
          <div className='h-full'>
            <div className='bg-white border border-gray-200 h-full flex flex-col overflow-hidden'>
              <div className='flex-1 overflow-hidden'>
                <div className='w-full overflow-x-auto'>
                  <table className="min-w-full text-sm table-fixed">
                    <thead className="bg-gray-100 whitespace-nowrap">
                      <tr>

                        <th className="w-[160px] px-3 py-2 text-left">Service</th>
                        <th className="w-[160px] px-3 py-2 text-left">Responsable</th>
                        <th className="w-[120px] px-3 py-2 text-left">Diplôme</th>
                        <th className="w-[120px] px-3 py-2 text-left">Min Expérience</th>
                        <th className="w-[150px] px-3 py-2 text-left">État</th>
                        <th className="w-[150px] px-3 py-2 text-left">Créé le</th>
                      </tr>
                    </thead>

                    <tbody className="bg-white border-b border-gray-300 hover:bg-gray-50 whitespace-nowrap">
                      {loading ? (
                        <Skeleton rows={3} columns={6} />
                      ) : data?.length > 0 ? (
                        data.map((need, index) => (
                          <RightClickMenu
                            key={need.id}
                            menuItems={items.map(item => ({ ...item, id: need.id }))}
                            onItemClick={handleMenuClick}
                          >
                            <tr
                              key={index}
                              className={`border-t border-gray-300 hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                            >


                              <td
                                className="px-3 py-2 truncate cursor-pointer"
                                onClick={() => handleShow(need.id)}
                              >
                                {need?.service?.name}
                              </td>

                              <td className="px-3 py-2 truncate">
                                {need?.responsible?.full_name}
                              </td>

                              <td className="px-3 py-2 truncate">{need?.level?.name}</td>

                              <td className="px-3 py-2 truncate">
                                {need.experience_min ? `${need.experience_min} mois` : "Pas nécessaire"}
                              </td>

                              <td className="px-3 py-2">
                                <Select
                                  style={{ width: "100%" }}
                                  defaultValue={need.status}
                                  size="small"
                                  onChange={(value) => updateStatus(need.id, value)}
                                  options={[
                                    { label: "En attente", value: 1 },
                                    { label: "En cours", value: 2 },
                                    { label: "Annulé", value: 3 },
                                    { label: "Exécuté", value: 4 },
                                  ]}
                                />
                              </td>

                              <td className="px-3 py-2 text-gray-700">
                                {formatDate(need.created_at)}
                              </td>
                            </tr>
                          </RightClickMenu>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="p-8 text-center">
                          <div className="flex flex-col items-center justify-center w-full">
                            <Empty
                              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                              style={{ image: { height: 100 } }} // AntD uses "style" not "styles" for Empty
                              description={<Typography.Text>Aucun besoin trouvé.</Typography.Text>}
                            >
                              <Button type="primary" onClick={()=> setOpenResponsive(true)} className="flex items-center gap-1">
                                <PlusCircle className="h-4 w-4" />
                                Créer
                              </Button>
                            </Empty>
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
    </div>
  )
}

export default Needs
