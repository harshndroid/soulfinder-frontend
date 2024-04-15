import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import StorageConstants from '../../constants/StorageConstants';
import LocalStorageService from '../../services/LocalStorageService';
import Styles from '../../styles/AuthPageStyles';
import Button from '../../components/Button';
import Background from '../../assets/background.webp';

const Otp = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={Styles.main}>
      <div
        style={{
          ...Styles.backgroundImage,
          backgroundImage: `url(${Background})`,
        }}
      />
      <p style={Styles.title}>
        Join with others and
        <br />
        make travel economical
      </p>
      <div style={Styles.inputWrapper}>
        <input
          type="number"
          autoFocus
          style={Styles.input}
          placeholder="Enter any dummy OTP"
          onChange={(e) => setOtp(e.target.value)}
        />

        <Button
          title="Verify OTP"
          style={Styles.button}
          onClick={() => {
            // call login backend API and get jwt token
            // fetch('http://localhost:3001/login', {
            fetch('https://node-mongodb-6r4w.onrender.com/login', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ phone: location.state.num }),
            })
              .then((res) => {
                if (res.status === 200 || res.status === 201) return res.json();
                else {
                  LocalStorageService.removeItem(StorageConstants.USER);
                  navigate('/login');
                  throw new Error('Api err');
                }
              })
              .then((data) => {
                console.log('login api response', data);
                LocalStorageService.setItem(StorageConstants.USER, data);
                navigate('/dashboard', { state: { num: location.state.num } });
              })
              .catch((e) => console.log('Login api error:', e));
          }}
        />
      </div>
    </div>
  );
};

export default Otp;