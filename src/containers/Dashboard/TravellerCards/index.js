import React from 'react';
import CallButton from './CallButton';
import Photo from './Photo';
import Styles from '../../../styles/DashboardStyles';

const TravellerCards = ({ nearbyTravellers }) => {
  return (
    <div style={Styles.travellerCardsWrapper}>
      {nearbyTravellers.map((ele) => (
        <div key={ele._id} style={Styles.cardWrapper}>
          <Photo ele={ele} />
          <div style={{ flex: 1 }} />
          <CallButton ele={ele} />
        </div>
      ))}
    </div>
  );
};

export default TravellerCards;
