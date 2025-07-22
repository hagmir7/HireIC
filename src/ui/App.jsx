import './App.css'
import MainLayout from './layouts/MainLayout'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Roles from './pages/Roles'
import ViewRole from './pages/ViewRole'
import Login from './pages/Login'
import Users from './pages/Users'
import Home from './pages/Home'
import Profile from './pages/profile';
import { Resume } from './pages/Resume'
import { Needs } from './pages/Needs'
import { Invetation } from './pages/Invetation'
import Interview from './pages/Interview'
import { Onboarding } from './pages/Onboarding'
import CreateResume from './components/resume/CreateResume'




const NotFound = () => {
  return (
    <div className="py-10 flex flex-col items-center justify-center px-4">
      <h1 className="text-lg font-bold text-gray-800">Page not ready</h1>
      <p className="text-xl text-gray-600 mt-4">⛔</p>
    </div>
  );
};


function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/user/:id' element={<Profile />} />
        <Route path='/resume/create' element={<CreateResume />} />
         <Route path='/resume/create/:id' element={<CreateResume />} />
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/users' element={<Users />} />
          <Route path='/layout/resume/create' element={<CreateResume />} />
          <Route path='/layout/resume/create/:id' element={<CreateResume />} />

          <Route path='/roles' element={<Roles />} />
          <Route path='/roles/:id' element={<ViewRole />} />
          <Route path='/resume' element={<Resume />} />
          <Route path='/needs' element={<Needs />} />
          <Route path='/invetation' element={<Invetation />} />
          <Route path='/onboarding' element={<Onboarding />} />
          <Route path='/interview' element={<Interview />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/layout/user/:id' element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
