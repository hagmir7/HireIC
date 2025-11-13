import { Button, Modal, Checkbox, message } from 'antd';
import { CircleAlert, ClipboardList, Edit, Eye, Filter, Menu, MessageSquare, PlusCircle, Settings2, Trash, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { getResumeStatus, handleShow } from '../utils/config';
import Skeleton from '../components/ui/Sketelon';
import RightClickMenu from '../components/ui/RightClickMenu';
import TableEmpty from '../components/TableEmpty';
import FilterModal from '../components/FilterModal';
import ResumeSearch from '../components/ResumeSearch';
import AddToNeed from '../components/AddToNeed';


export const Resume = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [levels, setLevels] = useState([]);
  const [cities, setCities] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const { confirm } = Modal;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [openNeedModal, setOpenNeedModal] = useState(false);
  const [currentResume, setCurrentResume] = useState(null)

  const [filterDataLoaded, setFilterDataLoaded] = useState(false);

  const [filters, setFilters] = useState({
    status: null,
    marital_status: null,
    city_id: null,
    min_experience: null,
    language_id: null,
    levels: [],
    gender: null,
    skills: [],
    category_id: null,
  });

  const getResumes = async (pageNumber = 1, searchValue = search) => {
    setLoading(true);
    const params = new URLSearchParams();

    for (const key in filters) {
      const value = filters[key];
      if (Array.isArray(value)) {
        value.forEach(v => params.append(`${key}[]`, v));
      } else if (value !== null && value !== '') {
        params.append(key, value);
      }
    }

    if (searchValue && searchValue.trim() !== '') {
      params.append('q', searchValue);
    }

    try {
      const { data } = await api.get(`/resumes?page=${pageNumber}&per_page=20&${params.toString()}`);

      if (pageNumber === 1) {
        setResumes(data.data);
      } else {
        setResumes(prev => [...prev, ...data.data]);
      }

      setHasMore(data.data.length > 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      message.error(error.response?.data?.message || "Erreur lors du chargement des CVs");
    }
  };

  const handleSearch = async (data) => {
    setSearch(data);
    setPage(1);
    getResumes(1, data);
  };

  const getLevels = async () => {
    try {
      const { data } = await api.get('levels');
      setLevels(data.map(item => ({ label: item.name, value: item.id })));
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message || "Can't load diplomes");
    }
  };

  const getSkills = async () => {
    try {
      const { data } = await api.get('skills');
      setSkills(data.map(item => ({ label: item.name, value: item.id, desc: item.name })));
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message || "Can't load Skills");
    }
  };

  const getLanguages = async () => {
    try {
      const { data } = await api.get('languages');
      setLanguages(data.map(item => ({ label: item.name, value: item.id })));
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message || "Can't load Languages");
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await api.get('categories');
      setCategories(data.map(item => ({ label: item.name, value: item.id })));
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message || "Can't load categories");
    }
  };

  const getCities = async () => {
    try {
      const { data } = await api.get('cities');
      setCities(data.map(item => ({ label: item.name, value: item.id })));
    } catch (error) {
      console.error(error);
      message.error(error.response.data.message || "Can't load cities");
    }
  };

  useEffect(() => {
    getResumes();
  }, []);

  useEffect(() => {
    if (filterModalOpen && !filterDataLoaded) {
      Promise.all([
        getCategories(),
        getLevels(),
        getCities(),
        getLanguages(),
        getSkills(),
      ]).then(() => setFilterDataLoaded(true));
    }
  }, [filterModalOpen]);

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === resumes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(resumes.map((r) => r.id));
    }
  };

  const handleFilter = () => {
    setPage(1);
    getResumes(1);
    setFilterModalOpen(false);
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

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`resumes/${id}`);
      message.success(response.data.message);
      getResumes(1);
    } catch (error) {
      console.error(error?.response?.data?.message || "Errur de supprimer le cv");
    }
  };

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

  const CreateInvetation = async (resume_id) => {
    try {
      const response = await api.post('invitations', { resume_id });
      message.success("Invitation créée avec succès");
    } catch (error) {
      message.error(error?.response?.data?.message || "Erreur de création d'invitation");
      console.error(error);
    }
  };

  const newInvetationConfirm = (id) => {
    confirm({
      title: 'Voulez-vous créer un nouvel entretien ?',
      icon: <CircleAlert size={25} className='text-green-600 mt-1 mr-2' color='green' />,
      content: "Confirmez la création de l'entretien pour ce candidat.",
      okText: "Oui, créer",
      okType: 'primary',
      cancelText: 'Annuler',
      onOk() {
        CreateInvetation(id);
      }
    });
  };

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
        newInvetationConfirm(id);
        break;
      case 'view':
        handleShow(`view-resume/${id}`);
        break;
       case 'toNeed':
        setCurrentResume(resumes.find(resume => String(resume.id) === String(id)))
        setOpenNeedModal(true)
        break;
      default:
    }
  };

  const items = [
    { label: 'Voir le CV', key: 'view', icon: <Eye size={15} /> },
    { label: "Lancer l'entretien", key: "startInterview", icon: <ClipboardList size={15} /> },
    { label: "Changer l'état", key: "changeStatus", icon: <Settings2 size={15} /> },
    { label: "Ajouter aux besoins", key: "toNeed", icon: <PlusCircle size={15} /> },
    { label: "Nouvelle invitation", key: "NewInvetation", icon: <MessageSquare size={15} /> },
    { type: "divider" },
    { label: "Modifier", key: "edit", icon: <Edit size={15} /> },
    { label: "Supprimer", key: "delete", icon: <Trash size={15} />, danger: true },
  ];

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex justify-between items-center px-2 mt-2'>
        <h1 className='text-xl font-semibold'>Liste des CVs</h1>
        <div className='flex gap-3'>
          <ResumeSearch onSearch={handleSearch} />
          <Button type='primary' onClick={() => handleShow('/resume/create')}>
            <PlusCircle size={16} className='me-1' /> Créer
          </Button>

           <Button color="default" variant="dashed" onClick={() => handleShow('/categories', 800, 700)}>
                <Menu className='h-4 w-4' />
                Catégorie d’emploi
            </Button>
          <Button
            icon={<Filter size={16} />}
            onClick={() => setFilterModalOpen(true)}
          >
            Filtre
          </Button>
          <AddToNeed open={openNeedModal} setOpen={setOpenNeedModal} resume={currentResume} />
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full table-auto text-sm'>
          <thead className='sticky top-0 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-300 shadow-xs z-10'>
            <tr>
              <th className='p-1 align-middle'>
                <div className='flex items-center justify-center'>
                  <Checkbox
                    checked={
                      selectedIds.length === resumes.length &&
                      resumes.length > 0
                    }
                    onChange={toggleAllCheckboxes}
                  />
                </div>
              </th>
              <th className='p-1 text-left'>Candidat</th>
              <th className='p-1 text-left'>Contact</th>
              <th className='p-1 text-left'>Entretiens</th>
              <th className='p-1 text-left'>État</th>
              <th className='p-1 text-left'>Invitations</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume) => (
              <RightClickMenu
                key={resume.id}
                menuItems={items.map(item => ({ ...item, id: resume.id }))}
                onItemClick={handleMenuClick}
              >
                <tr
                  key={resume.id}
                  className='border-b border-gray-300 hover:bg-gray-50 transition'
                >
                  <td className='p-2 align-middle'>
                    <div className='flex items-center justify-center'>
                      <Checkbox
                        checked={selectedIds.includes(resume.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleCheckbox(resume.id);
                        }}
                      />
                    </div>
                  </td>
                  <td
                    className='p-2 cursor-pointer'
                    onClick={() => handleShow(`/resume/create/${resume.id}`)}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='bg-gray-100 p-2 rounded-full'>
                        <User className='w-6 h-6 text-gray-500' />
                      </div>
                      <div>
                        <div className='font-medium text-gray-900'>
                          {resume.full_name}
                        </div>
                        <div className='text-gray-500 text-sm'>
                          {resume.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='p-2'>
                    <div className='font-medium text-gray-800'>
                      {resume?.city?.name}
                    </div>
                    <div className='text-sm text-gray-500'>{resume.email}</div>
                  </td>

                  <td className='p-2 flex gap-1'>
                    <div className='mt-1 items-center border border-gray-300 gap-2 py-1 px-3 rounded bg-gray-100 text-gray-800 text-sm text-center'>
                      {resume?.interviews_count}
                    </div>
                  </td>

                  <td className='p-2'>
                    <div className=' items-center border border-gray-300 gap-2 py-1  px-2 rounded bg-gray-100 text-gray-800 text-sm text-center'>
                      {getResumeStatus(resume.status).label}
                    </div>
                  </td>
                  <td className='p-2 flex gap-1'>
                    <div className='mt-1.5 items-center border border-gray-300 gap-2 py-1 px-3 rounded bg-gray-100 text-gray-800 text-sm text-center'>
                      {resume?.invitations_count}
                    </div>
                  </td>
                </tr>
              </RightClickMenu>
            ))}

            {loading && <Skeleton rows={7} columns={6} />}

            {!loading && resumes.length === 0 && (
              <TableEmpty colSpan={6} description="Aucun CV trouvé" />
            )}
          </tbody>
        </table>

        {hasMore && !loading && (
          <div className="text-center my-4">
            <Button
              type="default"
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                getResumes(nextPage);
              }}
            >
              Charger plus
            </Button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onCancel={() => setFilterModalOpen(false)}
        onOk={handleFilter}
        filters={filters}
        setFilters={setFilters}
        levels={levels}
        cities={cities}
        languages={languages}
        categories={categories}
        skills={skills}
      />
    </div>
  );
};