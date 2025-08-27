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
import Invitation from './pages/Invitation'
import Interview from './pages/Interview'
import { Onboarding } from './pages/Onboarding'
import CreateResume from './components/resume/CreateResume'
import Departements from './pages/Departements'
import Needs from './pages/Needs'
import Template from './pages/Template'
import CreateTemplate from './components/template/CreateTemplate'
import CreateInterview from './components/interview/CreateInterview'
import Evaluation from './components/interview/Evaluation'




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
        <Route path='template/create' element={<CreateTemplate /> } />
        <Route path='template/create/:id' element={<CreateTemplate /> } />
        <Route path='interview/evaluation' element={<Evaluation /> } />

        <Route path='interview/create' element={<CreateInterview /> } />
        <Route path='interview/create/:id' element={<CreateInterview /> } />
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/users' element={<Users />} />
          <Route path='/layout/resume/create' element={<CreateResume />} />
          <Route path='/layout/resume/create/:id' element={<CreateResume />} />
          <Route path='/layout/template/create' element={<CreateTemplate /> } />
          <Route path='layout/template/create/:id' element={<CreateTemplate /> } />

          <Route path='/roles' element={<Roles />} />
          <Route path='/departements' element={<Departements />} />
          <Route path='/roles/:id' element={<ViewRole />} />
          <Route path='/resume' element={<Resume />} />
          <Route path='/needs' element={<Needs />} />
          <Route path='/invitation' element={<Invitation />} />
          <Route path='/template' element={<Template />} />
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
