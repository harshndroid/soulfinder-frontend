import React from 'react';
import CallButton from './CallButton';
import BlockButton from './BlockButton';
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
          <div style={{ flex: 1 }} />
          <CallButton ele={ele} />
          <BlockButton ele={ele} onBlock={handleBlock} />
        </div>
      ))}
    </div>
  );
};

export default TravellerCards;
