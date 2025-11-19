import { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Dropdown, Space, Avatar } from 'antd';
import { ArrowRightCircle, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

const UserAvatar = () => (
  <Space direction='vertical'>
    <Avatar icon={<UserOutlined />} size={40} />
  </Space>
);

const DropMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    // Fetch Electron version if available
    const fetchVersion = async () => {
      if (window.electron?.version) {
        const version = await window.electron.version();
        setAppVersion(version);
      }
    };
    fetchVersion();
  }, []);

  const handelLogout = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    if (window.electron) {
      await window.electron.logout();
    } else {
      navigate('/login');
    }
  };

  const items = [
    {
      key: '1',
      label: user ? user.full_name : 'INTERCOCINA',
      disabled: true,
    },
     {
      key: '3',
      label: `v${appVersion || '...'}`,
      disabled: true,
    },
    {
      key: '4',
      label: 'Déconnexion',
      icon: <ArrowRightCircle size={18} />,
      onClick: handelLogout,
    },
   
  ];

  return (
    <Dropdown menu={{ items }}>
      <a onClick={(e) => e.preventDefault()}>
        <UserAvatar />
      </a>
    </Dropdown>
  );
};

export default DropMenu;
