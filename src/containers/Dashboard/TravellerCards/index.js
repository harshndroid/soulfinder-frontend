import React from 'react';
import BlockButton from './BlockButton';
import ChatButton from './ChatButton';
import Photo from './Photo';
import Styles from '../../../styles/DashboardStyles';

const TravellerCards = ({ nearbyTravellers, setNearbyTravellers }) => {
  const handleBlock = (blockedUserId) => {
    setNearbyTravellers((prev) =>
      prev.filter((ele) => ele._id !== blockedUserId)
    );
  };

  return (
    <div style={Styles.travellerCardsWrapper}>
      {nearbyTravellers.map((ele) => (
        <div key={ele._id} style={Styles.cardWrapper}>
          <Photo ele={ele} />
          {ele.bio && <div style={Styles.bio}>{ele.bio}</div>}
          <div style={Styles.actionsRow}>
            <ChatButton ele={ele} />
            <BlockButton ele={ele} onBlock={handleBlock} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TravellerCards;
