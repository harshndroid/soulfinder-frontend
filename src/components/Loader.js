import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import LoaderService from '../services/LoaderService';

const Loader = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return LoaderService.subscribe(setIsLoading);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 1300,
      }}
    >
      <CircularProgress style={{ color: '#e4a36b' }} />
    </div>
  );
};

export default Loader;
