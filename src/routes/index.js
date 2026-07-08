import { Route, Routes } from 'react-router-dom';
import Bootstrap from '../containers/Bootstrap/index.js';
import Dashboard from '../containers/Dashboard/index.js';
import Login from '../containers/Login/index.js';
import Chat from '../containers/Chat/index.js';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Bootstrap />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat/:otherUserId" element={<Chat />} />
    </Routes>
  );
};

export default AppRoutes;
