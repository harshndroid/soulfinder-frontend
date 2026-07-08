import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import ApiService from '../../services/ApiService';
import ApiConstants from '../../constants/ApiConstants';
import SocketService from '../../services/SocketService';
import LocalStorageService from '../../services/LocalStorageService';
import StorageConstants from '../../constants/StorageConstants';
import Button from '../../components/Button';

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { otherUserId } = useParams();
  const otherUserName = location.state?.name || 'Chat';

  const user = LocalStorageService.getItem(StorageConstants.USER);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    ApiService.fetchApi(`${ApiConstants.MESSAGES}/${otherUserId}`, 'GET')
      .then((res) => {
        if (res.status === 200 || res.status === 201) return res.json();
        throw new Error('Api err');
      })
      .then((data) => setMessages(data))
      .catch((e) => console.log('fetch messages error:', e));

    const socket = SocketService.connect();
    socket.on('receiveMessage', (message) => {
      const isRelevant =
        (message.senderId === otherUserId &&
          message.receiverId === user?.userId) ||
        (message.senderId === user?.userId &&
          message.receiverId === otherUserId);
      if (isRelevant) setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    const socket = SocketService.connect();
    socket.emit('sendMessage', { receiverId: otherUserId, text });
    setText('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          height: 50,
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          boxShadow: 'rgb(0, 0, 0) 0px -5px 8px 1px',
          paddingLeft: 10,
          fontWeight: 600,
        }}
      >
        <span onClick={() => navigate(-1)} style={{ marginRight: 10 }}>
          {'<'}
        </span>
        {otherUserName}
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((message) => (
          <div
            key={message._id}
            style={{
              alignSelf:
                message.senderId === user?.userId ? 'flex-end' : 'flex-start',
              backgroundColor:
                message.senderId === user?.userId ? '#e4a36b' : '#f0f0f0',
              borderRadius: 12,
              padding: '8px 12px',
              margin: '4px 0',
              maxWidth: '70%',
            }}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div
        style={{
          display: 'flex',
          padding: 10,
          borderTop: '1px solid #eee',
        }}
      >
        <input
          type="text"
          value={text}
          placeholder="Type a message"
          style={{
            flex: 1,
            borderRadius: 20,
            border: '1px solid #ccc',
            padding: '8px 14px',
            marginRight: 8,
          }}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button title="Send" onClick={handleSend} />
      </div>
    </div>
  );
};

export default Chat;
