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
    <Button
      title={
        nearbyTravellers.length === 0
          ? 'Search nearby travellers'
          : 'Refresh nearby travellers'
      }
      style={{ position: 'absolute', bottom: 40 }}
      onClick={() => {
        fetchNearbyTravellers(coords, user?.userId, setNearbyTravellers);
      }}
    />
  );
};

export default SearchTravellersButton;
