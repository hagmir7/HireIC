import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { Loader2, PlusCircle, RefreshCcw } from 'lucide-react';
import { api } from '../utils/api';
import RoleForm from '../components/RoleForm';

function strClean(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1);
  }).replace("_", " ");
}

const TableRow = ({ data }) => (
  <tr className='hover:bg-gray-100'>
    <td className='size-px whitespace-nowrap'>
      <Link to={`/roles/${data.name}`}>
        <div className='px-6 py-2 flex items-center gap-x-2'>
          <span className='text-sm text-gray-600 dark:text-neutral-400'>
            #{data.id || '__'}
          </span>
        </div>
      </Link>
    </td>
    <td className='size-px whitespace-nowrap'>
      <Link to={`/roles/${data.name}`}>
        <div className='px-6 py-2'>
          <span className='text-sm text-gray-600 dark:text-neutral-400'>
            {strClean(data.name) || '__'}
          </span>
        </div>
      </Link>
    </td>
    <td className='size-px whitespace-nowrap'>
      <div className='px-6 py-2'>
        <span className='text-sm text-gray-600 dark:text-neutral-400'>
          {data.guard_name}
        </span>
      </div>
    </td>
  </tr>
);

const Roles = () => {
  const labels = ['Code', 'Role', 'Guard'];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await api.get('roles');
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col'>
      <div className='-m-1.5 overflow-x-auto'>
        <div className='min-w-full inline-block align-middle'>
          <div className=' border border-gray-200 overflow-hidden dark:bg-neutral-900 dark:border-neutral-700'>
            {/* Header */}
            <div className='px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700'>
              <h2 className='text-xl font-semibold text-gray-800 dark:text-neutral-200'>
                Roles
              </h2>
              <div className='inline-flex gap-x-2'>
                <Button icon={<RefreshCcw size={17} />} onClick={getData}>
                  Rafraîchir
                </Button>

                <Button
                  type='primary'
                  icon={<PlusCircle size={17} />}
                  onClick={() => setModalOpen(true)}
                  className='bg-red-600 hover:bg-red-700'
                >
                  Créer
                </Button>
              </div>
            </div>

            {/* Table */}
            <table className='min-w-full divide-y divide-gray-200 dark:divide-neutral-700'>
              <thead className='bg-gray-50 dark:bg-neutral-900'>
                <tr>
                  {labels.map((label) => (
                    <th
                      scope='col'
                      key={label}
                      className='px-6 py-3 text-start'
                    >
                      <div className='flex items-center gap-x-2'>
                        <span className='text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200'>
                          {label}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-neutral-700'>
                {data.map((item, index) => (
                  <TableRow key={index} data={item} />
                ))}
              </tbody>
            </table>

            {loading && (
              <div className='flex flex-col items-center justify-center h-64'>
                <Loader2 className='animate-spin text-blue-500 mb-2' size={32} />
                <span className='text-gray-600'>Chargement...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="Créer un nouveau rôle"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <RoleForm
          onClose={() => setModalOpen(false)}
          onSuccess={getData}
        />
      </Modal>
    </div>
  );
};

export default Roles;
