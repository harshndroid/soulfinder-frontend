import React from 'react';
import { useNavigate } from 'react-router';
import Button from '../../../components/Button';
import Styles from '../../../styles/DashboardStyles';

const ChatButton = ({ ele, hasUnreadMessage }) => {
  const navigate = useNavigate();
  return (
    <div style={Styles.chatButtonWrapper}>
      <Button
        title="Chat"
        style={{ width: '100%' }}
        onClick={() =>
          navigate(`/chat/${ele._id}`, { state: { name: ele.name } })
        }
      />
      {hasUnreadMessage && <div style={Styles.chatUnreadBadge} />}
    </div>
  );
};

export default ChatButton;
