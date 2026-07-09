import React from 'react';
import AppConstants from '../../../constants/AppConstants';
import Styles from '../../../styles/DashboardStyles';

const Photo = ({ ele }) => {
  const isTravellerActive =
    Date.now() - ele.lastSeenAt <=
    AppConstants.LAST_SEEN_DURATION_LIMIT * 60 * 1000
      ? true
      : false;

  const statusColor = isTravellerActive ? '#1da05f' : '#acacac';

  return (
    <div style={Styles.cardTopRow}>
      <div style={Styles.imgWrapper}>
        <img alt="img" style={Styles.img} src={ele.photoUrl} />
        <div style={{ ...Styles.statusDot, backgroundColor: statusColor }} />
      </div>
      <div style={Styles.infoWrapper}>
        <div style={Styles.nameRow}>
          <span style={Styles.name}>
            {ele.name}, {ele.age}
          </span>
          <span
            style={{
              ...Styles.statusLabel,
              color: statusColor,
              backgroundColor: isTravellerActive ? '#e7f7ee' : '#f0f0f0',
            }}
          >
            {isTravellerActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        {ele.currentCity && (
          <div style={Styles.currentCity}>{ele.currentCity}</div>
        )}
      </div>
    </div>
  );
};

export default Photo;
