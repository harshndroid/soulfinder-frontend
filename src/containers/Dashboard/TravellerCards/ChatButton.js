import React from 'react';
import { useNavigate } from 'react-router';
import Button from '../../../components/Button';

const ChatButton = ({ ele, hasUnreadMessage }) => {
  const navigate = useNavigate();
  return (
    <Button
      title={hasUnreadMessage ? 'Chat •' : 'Chat'}
      style={{ flex: 1 }}
      onClick={() =>
        navigate(`/chat/${ele._id}`, { state: { name: ele.name } })
      }
    />
  );
};

export default ChatButton;
