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
    <Dialog open={open} onClose={onClose}>
      <div
        style={{
          height: '60vh',
          width: '80vw',
          maxWidth: 320,
          paddingTop: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          Update your profile
        </div>
        <input
          ref={ref}
          type="file"
          style={{ visibility: 'hidden' }}
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
              width: 80,
              height: 80,
              borderRadius: '50%',
              objectFit: 'cover',
              margin: 16,
            }}
            src={photo || updatedPhoto}
            onClick={() => {
              ref.current.click();
            }}
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              margin: 16,
              border: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => {
              ref.current.click();
            }}
          >
            <CameraAltIcon style={{ color: '#ccc' }} />
          </div>
        )}
        <TextField
          style={{ margin: 8 }}
          id="outlined-basic"
          label="Name"
          variant="outlined"
          size="small"
          defaultValue={user.name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          type="number"
          style={{ margin: 8 }}
          id="outlined-basic"
          label="Age"
          variant="outlined"
          size="small"
          defaultValue={user.age}
          onChange={(e) => setAge(e.target.value)}
        />
        <TextField
          style={{ margin: 8 }}
          id="outlined-basic"
          label="Current City"
          variant="outlined"
          size="small"
          defaultValue={user.currentCity}
          onChange={(e) => setCurrentCity(e.target.value)}
        />
        <TextField
          style={{ margin: 8 }}
          id="outlined-basic"
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
          style={{ margin: 10 }}
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
          style={{ margin: 10 }}
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
