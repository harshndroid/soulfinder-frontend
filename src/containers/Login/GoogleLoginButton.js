import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router';
import ApiConstants from '../../constants/ApiConstants';
import ApiService from '../../services/ApiService';
import StorageConstants from '../../constants/StorageConstants';
import LocalStorageService from '../../services/LocalStorageService';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        ApiService.fetchApi(ApiConstants.GOOGLE_LOGIN, 'POST', {
          credential: credentialResponse.credential,
        })
          .then((res) => {
            if (res.status === 200 || res.status === 201) return res.json();
            throw new Error('Api err');
          })
          .then((data) => {
            console.log('googleLogin api response', data);
            LocalStorageService.setItem(StorageConstants.USER, data);
            navigate('/dashboard');
          })
          .catch((e) => console.log('googleLogin api error:', e));
      }}
      onError={() => console.log('googleLogin error: Google sign-in failed')}
    />
  );
};

export default GoogleLoginButton;
