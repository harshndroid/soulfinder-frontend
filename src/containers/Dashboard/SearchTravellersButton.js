import React from 'react';
import Button from '../../components/Button';
import LocalStorageService from '../../services/LocalStorageService';
import StorageConstants from '../../constants/StorageConstants';
import fetchNearbyTravellers from './fetchNearbyTravellers';

const SearchTravellersButton = ({
  coords,
  nearbyTravellers,
  setNearbyTravellers,
}) => {
  const user = LocalStorageService.getItem(StorageConstants.USER);

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 0',
        backgroundColor: '#fffffff2',
        boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.06)',
      }}
    >
      <Button
        title={
          nearbyTravellers.length === 0
            ? 'Search nearby travellers'
            : 'Refresh nearby travellers'
        }
        onClick={() => {
          fetchNearbyTravellers(coords, user?.userId, setNearbyTravellers);
        }}
      />
    </div>
  );
};

export default SearchTravellersButton;
