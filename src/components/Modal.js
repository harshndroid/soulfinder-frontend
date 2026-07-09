import React, { useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from './Button';
import { useNavigate } from 'react-router';
import LocalStorageService from '../services/LocalStorageService';
import StorageConstants from '../constants/StorageConstants';
import TextField from '@mui/material/TextField';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import S3FileUpload from 'react-s3';
import awsConfig from '../config/aws';
import ApiConstants from '../constants/ApiConstants';
import ApiService from '../services/ApiService';

const Modal = ({ photo, open, onClose }) => {
  const navigate = useNavigate();

  const user = LocalStorageService.getItem(StorageConstants.USER);

  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [bio, setBio] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [updatedPhoto, setUpdatedPhoto] = useState('');

  const ref = useRef(null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ style: { borderRadius: 16, width: '85vw', maxWidth: 360 } }}
    >
      <div
        style={{
          padding: '28px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 19,
            marginBottom: 20,
          }}
        >
          Update your profile
        </div>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(event) => {
            const selectedFile = event.target.files[0];
            S3FileUpload.uploadFile(selectedFile, awsConfig)
              .then((data) => {
                setUpdatedPhoto(data.location);
              })
              .catch((err) => console.log('====err', err));
          }}
        />
        {photo || updatedPhoto ? (
          <img
            alt="img"
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: 24,
              cursor: 'pointer',
              border: '2px solid #e4a36b',
            }}
            src={photo || updatedPhoto}
            onClick={() => {
              ref.current.click();
            }}
          />
        ) : (
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              marginBottom: 24,
              backgroundColor: '#faf1e8',
              border: '2px dashed #e4a36b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() => {
              ref.current.click();
            }}
          >
            <CameraAltIcon style={{ color: '#e4a36b', fontSize: 28 }} />
          </div>
        )}
        <TextField
          fullWidth
          style={{ marginBottom: 14 }}
          label="Name"
          variant="outlined"
          size="small"
          defaultValue={user.name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          type="number"
          style={{ marginBottom: 14 }}
          label="Age"
          variant="outlined"
          size="small"
          defaultValue={user.age}
          onChange={(e) => setAge(e.target.value)}
        />
        <TextField
          fullWidth
          style={{ marginBottom: 14 }}
          label="Current City"
          variant="outlined"
          size="small"
          defaultValue={user.currentCity}
          onChange={(e) => setCurrentCity(e.target.value)}
        />
        <TextField
          fullWidth
          style={{ marginBottom: 22 }}
          label="Bio"
          variant="outlined"
          size="small"
          multiline
          rows={2}
          defaultValue={user.bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <Button
          title="Save"
          style={{ width: '100%', marginBottom: 10 }}
          onClick={() => {
            const requestPayload = {
              ...(updatedPhoto && { photoUrl: updatedPhoto }),
              ...(name && { name }),
              ...(age && { age }),
              ...(currentCity && { currentCity }),
              ...(bio && { bio }),
            };
            ApiService.fetchApi(
              ApiConstants.UPDATE_USER_PROFILE,
              'POST',
              requestPayload
            )
              .then((res) => {
                if (res.status === 200 || res.status === 201) return res.json();
                else if (res.status === 401 || res.status === 404) {
                  LocalStorageService.removeItem(StorageConstants.USER);
                  onClose();
                  navigate('/login');
                  throw new Error('Api err');
                }
              })
              .then((data) => {
                console.log('updateUserProfile api response', data);
                let updatedUserData = data.data;
                delete updatedUserData['_id'];
                delete updatedUserData['__v'];
                LocalStorageService.setItem(StorageConstants.USER, {
                  ...user,
                  ...updatedUserData,
                });
                onClose();
              })
              .catch((e) => console.log('updateUserProfile api error:', e));
          }}
        />
        <Button
          title="Logout"
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: '#999',
            boxShadow: 'none',
          }}
          onClick={() => {
            LocalStorageService.removeItem(StorageConstants.USER);
            navigate('/login');
          }}
        />
      </div>
    </Dialog>
  );
};

export default Modal;
