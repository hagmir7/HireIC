import { Button, Checkbox, message, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import Skeleton from '../components/ui/Sketelon';
import { api } from '../utils/api';
import { CircleAlert, ClipboardList, Edit, Eye, MessageSquare, PlusCircle, RefreshCcw, Settings2, Trash, UserPlus } from 'lucide-react';
import { formatDate } from '../utils/config';
import RightClickMenu from '../components/ui/RightClickMenu';
import OnboardingForm from '../components/onboarding/OnboardingFrom';

const Interview = () => {
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(0);
  const [open, setOpen] = useState(false)
  const [onboardingData, setOnboardingData] = useState(null);
  const { confirm } = Modal;


  useEffect(() => {
    fetchData();
  }, [filter])


  const fetchData = async () => {
    setLoading(true);
    try {
      const url = filter ? `interviews?status=${filter}` : "interviews";
      const response = await api.get(url);
      setData(response.data);
    } catch (error) {
      message.warning(error?.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };


  const handleSelectAll = () => {

  }

  function getMode(key) {
    const modes = {
      1: "En présentiel",
      2: "À distance"
    };
    return modes[key] || "__";
  }


  function getDecision(key) {
    const decisions = {
      1: { label: "En attente", bg: "bg-yellow-100 border border-yellow-300 text-yellow-800" },
      2: { label: "À retenir", bg: "bg-green-100 border-green-300 text-green-800" },
      3: { label: "Liste d'attente", bg: "bg-blue-100 blue-green-300 text-blue-800" },
      4: { label: "À éliminer", bg: "bg-red-100 blue-red-300 text-red-800" }
    };

    const decision = decisions[key];

    if (!decision) {
      return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">__</span>;
    }

    return (
      <span className={`${decision.bg} px-2 py-1 rounded`}>
        {decision.label}
      </span>
    );
  }

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`interview/${id}`)
      message.success(response.data.message);
    } catch (error) {
      message.error(error?.response?.data?.message || "Errur de supprimer l'entretien")
      console.error(error);
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



  const handleMenuClick = (key, id) => {
    const selected = data.find(r => Number(r.id) === Number(id));

    switch (key) {
      case "view":
        handleShowEvaluation(id);
        break;

      case "startInterview":
        handleShowInterview(null, selected?.resume?.id);
        break;

      case "delete":
        showDeleteConfirm(id);
        break;

      case "onboarding":
        setOnboardingData({
          resume_id: selected?.resume?.id,
          interview_id: selected?.id
        });
        setOpen(true);
        break;

      case "viewResume":
        handleShow(`view-resume/${id}`);
        break;

      default:
        console.warn(`Unhandled menu action: ${key}`);
    }
  };


  const items = [
    { label: "Voir", key: 'view', icon: <Eye size={15} /> },
    { label: "Nouvelle entretien", key: "startInterview", icon: <ClipboardList size={15} /> },
    // { label: "Changer l'état", key: "changeStatus", icon: <Settings2 size={15} /> },
    { label: "Nouvelle intégration", key: "onboarding", icon: <UserPlus size={15} /> },
    { type: "divider" },
    // { label: "Modifier", key: "edit", icon: <Edit size={15} /> },
    { label: "Supprimer", key: "delete", icon: <Trash size={15} />, danger: true, },
  ];



  const handleShow = async (id) => {
    try {
      const isValidId = typeof id === 'string' || typeof id === 'number';

      const url = `interview/create${isValidId ? `/${id}` : ''}`;
      if (window.electron && typeof window.electron.openShow === 'function') {
        await window.electron.openShow({ path: url, width: 1000, height: 550 });
      } else {
        navigate(`/layout/${url}`);
      }
    } catch (error) {
      console.error('Error navigating to resume:', error);
    }
  };

  const handleShowEvaluation = async (id) => {
    try {
      const url = `interview/evaluation/${id}`;
      if (window.electron && typeof window.electron.openShow === 'function') {
        await window.electron.openShow({ path: url, width: 1000, height: 1500 });
      } else {
        navigate(`/layout/${url}`);
      }
    } catch (error) {
      console.error('Error navigating to resume:', error);
    }
  };


  return (
    <div>
      <div className='flex justify-between items-center pt-2 px-2'>
        <h2 className='text-lg font-semibold text-gray-800'>Entretiens</h2>
        <div className='flex gap-3'>
          <Button
            onClick={fetchData}
            className='flex items-center gap-2 hover:shadow-md transition-shadow'

          >
            {loading ? (
              <RefreshCcw className='animate-spin h-4 w-4' />
            ) : (
              <RefreshCcw className='h-4 w-4' />
            )}
            Rafraîchir
          </Button>
          <Select
            style={{ width: 200 }}
            placeholder="Filtre d'état"
            onChange={(value) => setFilter(value)}
            options={[
              { label: 'Toute', value: null },
              { label: 'En attente', value: 1 },
              { label: 'À retenir', value: 2 },
              { label: "Liste d'attente", value: 3 },
              { label: 'À éliminer', value: 4 },
            ]}
          />
          {/* Responsive */}
          <Button type='primary' onClick={handleShow} >
            <PlusCircle className='h-4 w-4' />
            Créer
          </Button>


          <Modal
            title="Créer un embarquement"
            centered
            open={open}
            onCancel={() => setOpen(false)}
            width="70%"
            footer={null}
          >
            <OnboardingForm
              onboardingData={onboardingData}
              onClose={() => {
                setOpen(false);
              }}
            />
          </Modal>
        </div>
      </div>
      <div className='flex-1 overflow-hidden'>
        <div className='mx-auto pt-4 h-full'>
          {/* Desktop Table */}
          <div className='h-full'>
            <div className='bg-white  h-full flex flex-col overflow-hidden'>
              <div className='flex-1 overflow-hidden'>
                <div className='w-full overflow-x-auto'>
                  <table className='min-w-[800px] w-full'>
                    <thead className='sticky top-0 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-300 shadow-sm z-10'>
                      <tr>
                        <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'>
                          Candidat
                        </th>
                        <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'>
                          Référence
                        </th>
                        <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'>
                          Jury
                        </th>
                        <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'>
                          Type
                        </th>
                        <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap'>
                          Décision
                        </th>
                        <th className='px-2 py-1 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap '>
                          Date d'entretien
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white'>
                      {loading ? (
                        <Skeleton rows={3} columns={6} />
                      ) : data?.length > 0 ? (
                        data.map((interview, index) => (
                          <RightClickMenu
                            key={interview.id}
                            menuItems={items.map(item => ({ ...item, id: interview.id }))}
                            onItemClick={handleMenuClick}
                          >
                            <tr
                              onClick={() => handleShowEvaluation(interview.id)}
                              key={index}
                              className={`
                              border-b border-gray-200 
                              hover:bg-blue-50 
                              transition-colors 
                              duration-150 
                              ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            `}
                            >
                              <td className='px-2 tex2-sm border-r border-gray-100 whitespace-nowrap'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {interview.resume ? interview?.resume?.full_name : interview?.user?.full_name}
                                </div>
                                <span className='mt-2 text-gray-600 text-xs'>{interview?.resume?.phone || interview?.resume?.email}</span>
                              </td>

                              <td className='px-2 py-1 whitespace-nowrap border-r border-gray-100'>
                                <span className='text-sm font-semibold text-gray-900'>
                                  {interview?.code}
                                </span>
                                <br />
                                <span className='mt-2 text-gray-600 text-xs'>{interview?.template?.name} - {interview?.template?.code}</span>
                              </td>

                              <td className='px-2 tex2-sm border-r border-gray-100 whitespace-nowrap'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {interview?.responsible?.full_name}
                                </div>
                                <span className='mt-2 text-gray-600 text-xs'>{interview?.responsible?.post?.name}</span>
                              </td>


                              <td className='px-2 tex2-sm border-r border-gray-100 whitespace-nowrap'>
                                {getMode(interview?.type)}
                              </td>

                              <td className='px-2 tex2-sm border-r border-gray-100 whitespace-nowrap'>
                                {getDecision(interview?.decision)}
                              </td>

                              <td className='px-2 tex2-sm border-r border-gray-100 whitespace-nowrap'>
                                {formatDate(interview.date)}
                              </td>
                            </tr>
                          </RightClickMenu>
                        ))
                      ) : (
                        <tr>
                          <td colSpan='11' className='p-8'>
                            {' '}
                            {/* Fixed: proper colspan */}
                            <div className='text-center'>
                              <svg
                                className='mx-auto h-12 w-12 text-gray-400'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={1}
                                  d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                                />
                              </svg>
                              <h3 className='mt-2 text-sm font-medium text-gray-900'>
                                Aucun besoin trouvé
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
    </div>

  )
}

export default Interview