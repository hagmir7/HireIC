import React, { useState } from 'react';
import { message, Avatar, Button, Typography, Upload as AntUpload } from 'antd';
import { Camera, User, Loader2 } from 'lucide-react';
import axios from 'axios';

const { Text } = Typography;

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

let url;
if (import.meta.env.MODE === 'development') {
  url = "http://localhost:8000";

} else {
  url = "http://recruit365.intercocina.space";
}


export default function AvatarUpdate({ defaultAvatar, id }) {
  const [avatarLoading, setAvatarLoading] = useState(false);

  
  const [avatar, setAvatar] = useState(
    defaultAvatar ? `${url}/storage/${defaultAvatar}` : null
  );

  const getAuthToken = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  };

  const beforeUpload = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      message.error('Vous pouvez uniquement télécharger des fichiers JPG, PNG ou GIF.');
      return false;
    }
    if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      message.error(`L'image doit être inférieure à ${MAX_FILE_SIZE_MB} Mo.`);
      return false;
    }
    return true;
  };

  const handleAvatarUpload = (info) => {
    const { file } = info;

    if (file.status === 'uploading') {
      setAvatarLoading(true);
    }

    if (file.status === 'done') {
      const avatarPath = file.response?.avatar_url || file.response?.avatar || file.response?.path;

      if (avatarPath) {
        // Prepend full URL if needed and force reload using timestamp
        const fullUrl = avatarPath.startsWith('http')
          ? avatarPath
          : `${url}/storage/${avatarPath}`;
        setAvatar(`${fullUrl}?t=${Date.now()}`);
        message.success('Avatar mis à jour avec succès.');
      } else {
        message.warning("Avatar téléchargé, mais aucune URL n'a été renvoyée.");
      }

      setAvatarLoading(false);
    }

    if (file.status === 'error') {
      setAvatarLoading(false);
      message.error("Erreur lors du téléchargement de l'avatar.");
    }
  };

  const customUpload = async ({ file, onSuccess, onError }) => {
    if (!id) {
      return onError(new Error('ID utilisateur manquant'));
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      let url;
      if (import.meta.env.MODE === 'development') {
        url = "http://localhost:8000/api/";
      } else {
        url = "http://recruit365.intercocina.space/api/";
      }
      const response = await axios.post(
        `${url}user/avatar/${id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      onSuccess(response.data, file);
    } catch (error) {
      console.error('Échec du téléchargement :', error);
      onError(error);
    }
  };

  return (
    <div className="px-3 mb-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar
            size={120}
            src={avatar}
            icon={!avatar && <User size={60} />}
            className="border-4 border-gray-200 shadow-lg"
          />
          {avatarLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <Loader2 size={24} className="animate-spin text-white" />
            </div>
          )}
        </div>

        <AntUpload
          name="avatar"
          listType="picture"
          className="avatar-uploader"
          showUploadList={false}
          customRequest={customUpload}
          beforeUpload={beforeUpload}
          onChange={handleAvatarUpload}
        >
          <Button
            icon={<Camera size={16} />}
            loading={avatarLoading}
            type="default"
            className="h-10"
          >
            {avatarLoading ? 'Téléchargement...' : 'Changer l’avatar'}
          </Button>
        </AntUpload>

        <Text type="secondary" className="text-sm text-center">
          Formats acceptés : JPG, PNG, GIF. Taille maximale : {MAX_FILE_SIZE_MB} Mo
        </Text>
      </div>
    </div>
  );
}
