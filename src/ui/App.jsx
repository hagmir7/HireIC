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
import CreateResume from './components/resume/CreateResume'
import Departements from './pages/Departements'
import Needs from './pages/Needs'
import Template from './pages/Template'
import CreateTemplate from './components/template/CreateTemplate'
import CreateInterview from './components/interview/CreateInterview'
import Evaluation from './components/interview/Evaluation'
import ViewNeed from './pages/ViewNeed'
import City from './pages/City'
import ViewResume from './pages/ViewResume'
import Onboarding from './pages/Onboarding'
import Diplome from './pages/Diplome'
import ViewDepartement from './pages/ViewDepartement'
import Skills from './pages/Skills'
import ViewSkills from './pages/ViewSkill'
import Criteria from './pages/Criteria'
import ViewCriteriaType from './pages/ViewCriteriaType'
import Category from './pages/Category'




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
        <Route path='template/create' element={<CreateTemplate />} />
        <Route path='template/create/:id' element={<CreateTemplate />} />
        <Route path='interview/evaluation/:id' element={<Evaluation />} />
        <Route path='needs/view/:id' element={<ViewNeed />} />
        <Route path='/departements' element={<Departements />} />
        <Route path='/diplome' element={<Diplome />} />
        <Route path='/skills' element={<Skills />} />
        <Route path='/view-skills/:id' element={<ViewSkills />} />
        <Route path='city' element={<City />} />
        <Route path='categories' element={<Category />} />
        <Route path='view-resume/:id' element={<ViewResume />} />
        <Route path='view-departement/:id' element={<ViewDepartement />} />

        <Route path='interview/create' element={<CreateInterview />} />
        <Route path='interview/create/:id' element={<CreateInterview />} />
        <Route path='criteria' element={<Criteria />} />
        <Route path='/view-criteria-type/:id' element={<ViewCriteriaType />} />
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/users' element={<Users />} />
          <Route path='/layout/resume/create' element={<CreateResume />} />
          <Route path='/layout/resume/create/:id' element={<CreateResume />} />
          <Route path='/layout/template/create' element={<CreateTemplate />} />
          <Route
            path='layout/template/create/:id'
            element={<CreateTemplate />}
          />

          <Route path='/roles' element={<Roles />} />
         
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
