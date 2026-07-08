import React from 'react';
import { useNavigate } from 'react-router';
import Button from '../../../components/Button';

const ChatButton = ({ ele }) => {
  const navigate = useNavigate();
  return (
    <Button
      title="Chat"
      style={{ flex: 1 }}
      onClick={() =>
        navigate(`/chat/${ele._id}`, { state: { name: ele.name } })
      }
    />
  );
};

export default ChatButton;
