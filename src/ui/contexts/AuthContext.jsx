import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../utils/api";
import { message as antMessage} from 'antd'



const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(false)

  const [user, setUser] = useState(false);

  const navigate = useNavigate();

  useEffect(()=>{
    getUser()
    roles()
  }, []);



  const login = async (userData) => {
    setLoading(true)
    setMessage('')

    try {
      const response = await api.post('login', userData);

      const { access_token, user } = response.data;

      localStorage.setItem('authToken', access_token);

      localStorage.setItem('user', JSON.stringify(user));

      const rolesResponse = await api.get('user/permissions');

      localStorage.setItem('roles', JSON.stringify(rolesResponse.data));

      if (window.electron) {
        await window.electron.login(response.data);
      } else {
        return navigate('/');
      }

    } catch (error) {
      antMessage.error(error.response.data.message)
      console.error('Login failed:', error.response ? error.response.data : error.message)
      setMessage("Nom d'utilisateur/e-mail ou mot de passe invalide.")
    } finally {
      setLoading(false)
    }
  }

  const register = () => {
    console.log("Register");
  }

  const getUser = () =>{
    if(localStorage.getItem("user") && localStorage.getItem("user") !== "undefined" ){
      const currentUser = JSON.parse(localStorage.getItem("user"));
      setUser(currentUser);
      
    }
  }

  const roles = (role) => {
    try {
      const rolesData = JSON.parse(localStorage.getItem('roles'));
      const permissions = rolesData?.roles || [];
      return permissions.includes(role)
    } catch (error) {
      console.error("Error reading roles from localStorage:", error);
      return false;
    }
  };

  const permissions = (permission) => {
    try {
      const rolesData = JSON.parse(localStorage.getItem('roles'))
      const permissions = rolesData?.permissions || []
      return permissions.includes(permission)
    } catch (error) {
      console.error('Error reading roles from localStorage:', error)
      return false
    }
  }
  

  return (
    <AuthContext.Provider value={{ login, register, loading, message, user, roles, permissions }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);