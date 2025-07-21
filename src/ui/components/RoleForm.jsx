import React, { useState } from 'react';
import { api } from '../utils/api';
import { Button, message } from 'antd';

function RoleForm({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('roles', data);
      setData({ name: "" });
      message.success("Rôle ajouté avec succès");
      onClose?.();
      onSuccess?.();
    } catch (error) {
      message.error(error?.response?.data?.message || "Erreur lors de l'ajout du rôle.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className='block mb-2 font-medium'>
          Rôle <span className='text-red-500'>*</span>
        </label>
        <input
          type='text'
          name='name'
          value={data.name}
          onChange={handleChange}
          placeholder='Nom du rôle...'
          className="w-full p-3 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>
      <div className='mt-3 flex justify-end w-full'>
        <Button
          type='primary'
          htmlType='submit'
          loading={loading}
          className='bg-red-600 text-white hover:bg-red-700'
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}

export default RoleForm;
