import { Button, Modal, Checkbox, Col, Form, Input, DatePicker, Row, Select, message, Space, Empty, Typography } from 'antd';
import { ClipboardList, Edit, Filter, ListPlus, PlusCircle, Settings2, Trash, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { getResumeStatus } from '../utils/config';
import Skeleton from '../components/ui/Sketelon';
import RightClickMenu from '../components/ui/RightClickMenu';


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

    const [filterDataLoaded, setFilterDataLoaded] = useState(false)

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
    })

    const getResumes = async () => {
        setLoading(true)
        const params = new URLSearchParams();

        for (const key in filters) {
            const value = filters[key];
            if (Array.isArray(value)) {
                value.forEach(v => params.append(`${key}[]`, v));
            } else if (value !== null && value !== '') {
                params.append(key, value);
            }
        }
        try {
            const { data } = await api.get(`/resumes?page=1&per_page=10&${params.toString()}`);
            setResumes(data.data);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error(error);
            message.error(error.response.data.message)

        }

    };


    const getLevels = async () => {
        try {
            const { data } = await api.get('levels');
            setLevels(data.map(item => ({ label: item.name, value: item.id })));
        } catch (error) {
            console.error(error);
            message.error(error.response.data.message || "Can't load diplomes");
        }
    }

    const getSkills = async () => {
        try {
            const { data } = await api.get('skills');
            setSkills(data.map(item => ({ label: item.name, value: item.id, desc: item.name })));
        } catch (error) {
            console.error(error);
            message.error(error.response.data.message || "Can't load Skills");
        }
    }

    const getLanguages = async () => {
        try {
            const { data } = await api.get('languages');
            setLanguages(data.map(item => ({ label: item.name, value: item.id })));
        } catch (error) {
            console.error(error);
            message.error(error.response.data.message || "Can't load Languages");
        }
    }

    const getCategories = async () => {
        try {
            const { data } = await api.get('categories');
            setCategories(data.map(item => ({ label: item.name, value: item.id })));
        } catch (error) {
            console.error(error);
            message.error(error.response.data.message || "Can't load categories");
        }
    }

    const getCities = async () => {
        try {
            const { data } = await api.get('cities');
            setCities(data.map(item => ({ label: item.name, value: item.id })));
        } catch (error) {
            console.error(error);
            message.error(error.response.data.message || "Can't load cities");
        }
    }

 useEffect(() => {
   getResumes()
   if (filterModalOpen && !filterDataLoaded) {
     Promise.all([
       getCategories(),
       getLevels(),
       getCities(),
       getLanguages(),
       getSkills(),
     ]).then(() => setFilterDataLoaded(true))
   }
 }, [filterModalOpen])

    const handleShow = async (id) => {
        try {
            const isValidId = typeof id === 'string' || typeof id === 'number';
            const url = `/resume/create${isValidId ? `/${id}` : ''}`;
            if (window.electron && typeof window.electron.openShow === 'function') {
                await window.electron.openShow({ path: url, width: 1000, height: 800 });
            } else {
                navigate(`/layout${url}`);
            }
        } catch (error) {
            console.error('Error navigating to resume:', error);
        }
    };

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
        console.log(filters);
        getResumes();
        setFilterModalOpen(false)

    }

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
    message.info(`You clicked ${key} with the ID ${id}`);

    switch (key) {
      case "startInterview":
        handleShowInterview(null, id)
        break;
      case "edit":
        handleShow(id);
        break;
      // ... more cases
      default:
      // Code to execute if no case matches
    }
  };

  const items = [
    { label: "Lancer l'entretien", key: "startInterview", icon: <ClipboardList size={15} /> },
    { label: "Changer l'état", key: "changeStatus", icon: <Settings2 size={15} /> },
    { label: "Ajouter à la liste", key: "addToList", icon: <ListPlus size={15} /> },
    { type: "divider" },
    { label: "Modifier", key: "edit", icon: <Edit size={15} /> },
    { label: "Supprimer", key: "delete", icon: <Trash size={15} />, danger: true, },
  ];


    return (
      <div className='space-y-4'>
        {/* Header */}
        <div className='flex justify-between items-center px-2 mt-2'>
          <h1 className='text-xl font-semibold'>Liste des CVs</h1>
          <div className='flex gap-3'>
            <Button type='primary' onClick={() => handleShow()}>
              <PlusCircle size={16} className='me-1' /> Créer
            </Button>
            <Button
              icon={<Filter size={16} />}
              onClick={() => setFilterModalOpen(true)}
            >
              Filtre
            </Button>
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
                <th className='p-1 text-left'>Statut</th>
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
                          e.stopPropagation()
                          toggleCheckbox(resume.id)
                        }}
                      />
                    </div>
                  </td>
                  <td
                    className='p-2 cursor-pointer'
                    onClick={() => handleShow(resume.id)}
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
                  <td className='p-3'>
                    <div className='font-medium text-gray-800'>
                      {resume?.city?.name}
                    </div>
                    <div className='text-sm text-gray-500'>{resume.email}</div>
                  </td>
                  <td className='p-3'>
                    <div className=' items-center border border-gray-300 gap-2  py-1 rounded bg-gray-100 text-gray-800 text-sm text-center'>
                      {getResumeStatus(resume.status).label}
                    </div>
                  </td>
                </tr>
                 </RightClickMenu>
              ))}

              {loading ? <Skeleton rows={5} columns={5} /> : ''}
            </tbody>
          </table>
          {
            !loading && resumes.length == 0 ?
            <div className='text-center flex items-center justify-center py-9'>
              <Empty
                image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
                styles={{ image: { height: 100 } }}
                description={
                  <Typography.Text>Aucun CV trouvé.</Typography.Text>
                }
              >
                <Button type='primary' onClick={handleShow}>
                  <PlusCircle className='h-4 w-4' />
                  Créer
                </Button>
              </Empty>
            </div>: ""
          }
        </div>

        {/* Filter Modal */}
        <Modal
          title='Filtrer les CVs'
          open={filterModalOpen}
          onCancel={() => setFilterModalOpen(false)}
          onOk={() => handleFilter()}
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label='Diplôme'>
                <Select
                  placeholder='Diplôme'
                  mode='multiple'
                  value={filters.levels || undefined}
                  onChange={(value) =>
                    setFilters({ ...filters, levels: value })
                  }
                  // onChange={(value) => setFilters({ ...filters, levels: value })}
                  className='w-full'
                  options={levels}
                  showSearch
                  optionRender={(option) => (
                    <Space>
                      <span role='img' aria-label={option.data.label}>
                        {option.data.label}
                      </span>
                    </Space>
                  )}
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label='Ville'>
                <Select
                  placeholder='Ville'
                  value={filters.city_id || undefined}
                  onChange={(value) =>
                    setFilters({ ...filters, city_id: value })
                  }
                  className='w-full'
                  options={cities}
                  showSearch
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label='État'>
                <Select
                  placeholder='État'
                  value={filters.status || undefined}
                  onChange={(value) =>
                    setFilters({ ...filters, status: value })
                  }
                  className='w-full'
                  options={[
                    {
                      value: 1,
                      label: 'Nouveau',
                    },
                    { value: 2, label: 'Invitation' },
                    { value: 3, label: 'Évaluation' },
                    { value: 4, label: 'Accepté' },
                    { value: 5, label: 'Engagé' },
                  ]}
                  showSearch
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label='État civil'>
                <Select
                  placeholder='État civil'
                  value={filters.marital_status || undefined}
                  onChange={(value) =>
                    setFilters({ ...filters, marital_status: value })
                  }
                  className='w-full'
                  options={[
                    { value: 1, label: 'Célibataire' },
                    { value: 2, label: 'Marié(e)' },
                    { value: 3, label: 'Veuf/Veuve' },
                  ]}
                  showSearch
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label='Langues'>
                <Select
                  placeholder='Langues'
                  value={filters.language_id || undefined}
                  onChange={(value) =>
                    setFilters({ ...filters, language_id: value })
                  }
                  className='w-full'
                  options={languages}
                  showSearch
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label='Genre'>
                <Select
                  placeholder='Genre'
                  value={filters.gender || undefined}
                  onChange={(value) =>
                    setFilters({ ...filters, gender: value })
                  }
                  className='w-full'
                  options={[
                    { value: 1, label: 'Femelle' },
                    { value: 2, label: 'Mâle' },
                  ]}
                  showSearch
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label='Catégorie'>
                <Select
                  placeholder='Catégorie'
                  value={filters.category_id || undefined}
                  onChange={(value) =>
                    setFilters({ ...filters, category_id: value })
                  }
                  className='w-full'
                  options={categories}
                  showSearch
                  filterOption={(input, option) =>
                    option?.label?.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label='Expérience (Mois)'>
                <Input
                  placeholder='Expérience'
                  type='number'
                  max={1000}
                  min={0}
                  value={filters.min_experience || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, min_experience: e.target.value })
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label='Compétences'>
            <Select
              mode='multiple'
              style={{ width: '100%' }}
              placeholder='Compétences'
              onChange={(value) => setFilters({ ...filters, skills: value })}
              options={skills}
              optionRender={(option) => (
                <Space>
                  <span role='img' aria-label={option.data.label}>
                    {option.data.emoji}
                  </span>
                  {option.data.desc}
                </Space>
              )}
            />
          </Form.Item>
        </Modal>
      </div>
    )
};
