import { Button, Checkbox, message } from 'antd';
import { Filter, PlusCircle, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { api } from '../utils/api';

export const Needs = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [needs, setNeeds] = useState([]);

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === needs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(needs.map((r) => r.id));
    }
  };

  const getNeed = async () => {

    try {
      const { data } = await api.get('needs');
      setNeeds(data.data);
    } catch (error) {
      console.error(error);
      message.success(error.response.data.message);
    }
  }

  useEffect(() =>{
    getNeed();
  }, []);

    const handleShow = async (id) => {
      try {
        const isValidId = typeof id === 'string' || typeof id === 'number';
        const url = `/need/create${isValidId ? `/${id}` : ''}`;
        if (window.electron && typeof window.electron.openShow === 'function') {
          await window.electron.openShow({ path: url, width: 1100, height: 800 });
        } else {
          navigate(`/layout${url}`);
        }
      } catch (error) {
        console.error('Error navigating to need:', error);
      }
    };


  return (
    <div><div className="flex justify-between items-center px-2 mt-2">
      <h1 className="text-xl font-semibold">Liste des CVs</h1>
      <div className="flex gap-3">
        {/* <Button type="primary" onClick={() => handleShow()}>
          <PlusCircle size={16} className="me-1" /> Créer
        </Button> */}

      </div>
    </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm">
          <thead className="sticky top-0 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-300 shadow-xs z-10">
            <tr>
              <th className="p-1 align-middle">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={selectedIds.length === needs.length && needs.length > 0}
                    onChange={toggleAllCheckboxes}
                  />
                </div>
              </th>
              <th className="p-1 text-left">Candidat</th>
              <th className="p-1 text-left">Position</th>
              <th className="p-1 text-left">Statut</th>
              <th className="p-1 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {needs.map((need) => (
              <tr key={need.id} className="border-t border-gray-300 hover:bg-gray-50 transition">
                <td className="p-3 align-middle">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={selectedIds.includes(need.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleCheckbox(need.id);
                      }}
                    />
                  </div>
                </td>
                <td
                  className="p-3 cursor-pointer"
                  onClick={() => handleShow(need.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {need.full_name}
                      </div>
                      <div className="text-gray-500 text-sm">{need.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="font-medium text-gray-800">{need.city.name}</div>
                  <div className="text-sm text-gray-500">{need.email}</div>
                </td>
                <td className="p-3">
                  <div className="inline-flex items-center py-1.5 px-3 rounded-full bg-white shadow-sm border border-gray-200 text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105">
                    <span className={`h-2.5 rounded-full animate-pulse shadow-sm`}></span>
                    <span className="text-gray-700 select-none">
                      {need.status}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <Button
                    type="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShow(need.id);
                    }}
                  >
                    Voir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
  )
}
