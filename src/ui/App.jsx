import './App.css'
import MainLayout from './layouts/MainLayout'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Roles from './pages/Roles'
import ViewRole from './pages/ViewRole'
import Login from './pages/Login'
import Users from './pages/Users'
import Home from './pages/Home'
import Profile from './pages/profile'



const NotFound = () => {
  return <>Page not found 404</>
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/user/:id' element={<Profile />} />
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/users' element={<Users />} />
          <Route path='/roles' element={<Roles />} />
          <Route path='/roles/:id' element={<ViewRole />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/layout/user/:id' element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
