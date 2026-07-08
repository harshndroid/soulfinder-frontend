import React from 'react';
import Background from './Background';
import Heading from './Heading';
import GoogleLoginButton from './GoogleLoginButton';
import Styles from '../../styles/AuthPageStyles';

const Login = () => {
  return (
    <div style={Styles.main}>
      <Background />
      <Heading />
      <div style={Styles.bottomWrapper}>
        <div style={{ margin: '20px 0' }}>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default Login;
