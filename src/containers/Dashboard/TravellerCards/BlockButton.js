import React from 'react';
import Button from '../../../components/Button';
import ApiService from '../../../services/ApiService';
import ApiConstants from '../../../constants/ApiConstants';

const BlockButton = ({ ele, onBlock }) => {
  return (
    <Button
      title="Block"
      style={{ flex: 1, backgroundColor: '#b3b3b3' }}
      onClick={() => {
        ApiService.fetchApi(ApiConstants.BLOCK_USER, 'POST', {
          blockedUserId: ele._id,
        })
          .then((res) => {
            if (res.status === 200 || res.status === 201) onBlock(ele._id);
          })
          .catch((e) => console.log('blockUser api error:', e));
      }}
    />
  );
};

export default BlockButton;
