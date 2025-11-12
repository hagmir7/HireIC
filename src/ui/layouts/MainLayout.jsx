import React, { useState, useEffect } from 'react'
import { Layout, Menu, theme, Drawer, Badge } from 'antd'
import {
  Package,
  Shield,
  UserCheck,
  Users,
  Menu as MenuIcon,
  X,
  BriefcaseBusiness,
  ContactRound,
  LayoutGrid,
  ClipboardList,
  MessagesSquare,
  MessageCircleWarning,
  UserRoundPlus,
  Component,
  Building,
  GraduationCap,
  Building2,
  FolderDot,
  CheckCircle,
  BookOpenText,
  LandPlot,
  UserPlus,
  Pin,
} from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import DropMenu from '../components/DropMenu'
import { useAuth } from '../contexts/AuthContext'
import { handleShow } from '../utils/config'
import DocumentTemplates from '../components/DocumentTemplates'
import { api } from '../utils/api'
const { Header, Content, Sider } = Layout

const sideMenu = () => {
  const { roles, permissions } = useAuth()

  const [needs, setNeeds] = useState(0);

  const getNeeds = async ()=> {
    try {
      const response = await api.get("needs/overview");
      setNeeds(response?.data?.pending)
    } catch (error) {
      
    }
  }


  useEffect(()=>{
    getNeeds();
  }, [])

  return [
    {
      key: 'menu-01',
      icon: <LayoutGrid size={20} />,
      label: <Link to='/' className='text-base'>Accueil</Link>,

    },
    {
      key: 'menu-1',
      icon: <BriefcaseBusiness size={20} />,
      label: <span className='text-base'>Recrutement</span>,
      children: [
        {
          key: 'submenu-1',
          icon: <ContactRound size={19} />,
          label: <Link to='resume'>Resume</Link>,
        },

        {
          key: 'submenu-15',
          icon: <MessageCircleWarning size={19} />,
          label: (
            <div className="flex items-center justify-between w-full">
              <Link to="/needs" className="flex-1">
                Besoins
              </Link>
              {needs && roles('admin') ? <Badge count={needs} className="ml-2" /> : ''}
            </div>
          ),
        },
        {
          key: 'submenu-21',
          icon: <MessagesSquare size={19} />,
          label: <Link to='/invitation'>Invitations</Link>,
        },

        {
          key: 'submenu-10',
          icon: <ClipboardList size={19} />,
          label: <Link to='/interview'>Entretiens</Link>,
        },



        {
          key: 'submenu-16',
          icon: <UserRoundPlus size={19} />,
          label: <Link to='/onboarding'>Embarquement</Link>,
        },

      ],
    },
    {
      key: 'menu-2',
      icon: <Package size={20} />,
      label: <span className='text-base'>Outils</span>,

      children: [
        {
          key: 'submenu-13',
          icon: <Component size={19} />,
          onClick: ()=> handleShow('departements'),
          label: "Départements",
        },
        {

          key: 'submenu-2',
          icon: <Building size={19} />,
          disabled: true,
          label: <Link to='/company'>Sociétés</Link>,
        },
        {
          key: 'submenu-121',
          icon: <GraduationCap size={19} />,
          onClick: () => handleShow('diplome'),
          label: 'Diplômes',
        },
        {
          key: 'submenu-131',
          icon: <Building2 size={19} />,
          label: 'Villes',
          onClick: ()=> handleShow('city')

        },
        {
          key: 'submenu-141',
          icon: <FolderDot size={19} />,
          label: <Link to='/template'>Modèles d'entretien</Link>,
        },
        {
          key: 'submenu-151',
          icon: <CheckCircle size={19} />,
          label: "Compétences",
          onClick: ()=> handleShow('skills')
        },
           
        {
          key: 'submenu-160',
          icon: <Pin size={19} />,
          label: "Postes de travail",
          onClick: ()=> handleShow('work-posts')
        },

        
      ],
    },

    {
      key: 'menu-6',
      icon: <BookOpenText size={20} />,
      disabled: true,
      label: <span className='text-base'>Formations</span>,
      children: [
        {
          key: 'submenu-6',
          label: 'Préparation',
        },
      ],
    },
    {
      key: 'menu-7',
      icon: <LandPlot size={20} />,
      disabled: true,
      label: <span className='text-base'>Congé</span>,
      children: [
        {
          key: 'submenu-7',
          label: 'Group',
        },
      ],
    },
    {
      key: 'menu-8',
      icon: <Users size={20} />,
      label: <span className='text-base'>Personnel</span>,
      children: [
        {
          key: 'submenu-8-1',
          icon: <UserCheck size={20} />,
          label: <Link to='/users'>Utilisateurs</Link>,
        },
        {
          key: 'submenu-8-2',
          icon: <Shield size={20} />,
          label: <Link to='/roles'>Roles</Link>,
        },
      ],
    },
  ]
}

const MainLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(true)

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile) {
        setCollapsed(true)
        setSidebarVisible(false)
      } else {
        setSidebarVisible(true)
      }
    }

    // Initialize on first render
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
      document.body.style.overflow = 'auto'
    }
  }, [])


  const toggleSidebar = () => {
    setSidebarVisible((prevState) => !prevState)
    // Reset any potential lag on mobile
    if (isMobile) {
      document.body.style.overflow = sidebarVisible ? 'auto' : 'hidden'
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        className='flex items-center justify-between shadow-sm top-0 left-0'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 64,
          background: '#fff',
          paddingInline: 16,
          display: 'flex',
          alignItems: 'center',
        }}
        theme='light'
      >
        <div className='flex justify-between w-full items-center'>
          <div className='flex md:hidden h-full items-center'>
            <button
              style={{ background: 'transparent', border: 'none' }}
              type='button'
              onClick={toggleSidebar}
            >
              {sidebarVisible ? (
                <X size={40} color='black' />
              ) : (
                <MenuIcon size={40} color='black' />
              )}
            </button>
          </div>
          <div>
            <Link to={'/'}>
              <img
                src={`https://intercocina.com/public/logo.png`}
                alt='Intercocina logo'
                className='max-h-full w-60'
              />
            </Link>
          </div>
          <div className='flex gap-3 items-center'>
             <DocumentTemplates />
            <DropMenu />
          </div>
        </div>
      </Header>
      <Layout>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sider
            width={300}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            breakpoint='lg'
            collapsedWidth={80}
            style={{
              background: colorBgContainer,
              paddingTop: '12px',
              position: 'fixed', // Fixed position
              top: 64, // Assuming Header is 64px tall
              left: 0,
              height: 'calc(100vh - 64px)', // Full height minus header
              overflowY: 'auto', // Enable vertical scroll
              zIndex: 100,
            }}
          >
            <Menu
              mode='inline'
              className='space-y-2'
              defaultSelectedKeys={['menu-1']}
              defaultOpenKeys={['menu-1']}
              style={{ borderRight: 0 }}
              items={sideMenu()}
            />
          </Sider>
        )}

        {/* Mobile Drawer Sidebar */}
        {isMobile && (
          <Drawer
            placement='left'
            closable={false}
            onClose={toggleSidebar}
            open={sidebarVisible}
            width={240}
            bodyStyle={{
              padding: 0,
              paddingTop: '12px',
              background: colorBgContainer,
            }}
            maskClosable={true}
            mask={true}
          >
            <Menu
              mode='inline'
              className='space-y-2'
              defaultSelectedKeys={['menu-1']}
              style={{ height: '100%', borderRight: 0 }}
              items={sideMenu()}
            />
          </Drawer>
        )}

        <Layout
          className='pt-0 px-0 md:px-4'
          style={{
            marginLeft: !isMobile ? (collapsed ? 80 : 300) : 0,
            marginTop: 74,
            transition: 'margin 0.2s ease-in-out',
          }}
        >
          <Content
            className='bg-gray-50 shadow mb-4'
            style={{
              minHeight: 'calc(100vh - 64px)',
              borderRadius: borderRadiusLG,
              overflow: 'auto',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default MainLayout
