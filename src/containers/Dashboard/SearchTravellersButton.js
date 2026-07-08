import React from 'react';
import Button from '../../components/Button';
import ApiService from '../../services/ApiService';
import ApiConstants from '../../constants/ApiConstants';
import AppConstants from '../../constants/AppConstants';
import LocalStorageService from '../../services/LocalStorageService';
import StorageConstants from '../../constants/StorageConstants';
import distanceHelper from '../../utils/distanceHelper';

const SearchTravellersButton = ({
  coords,
  nearbyTravellers,
  setNearbyTravellers,
}) => {
  const user = LocalStorageService.getItem(StorageConstants.USER);

  if (nearbyTravellers.length === 0)
    return (
      <Button
        title="Search nearby travellers"
        style={{ position: 'absolute', bottom: 40 }}
        onClick={() => {
          ApiService.fetchApi(ApiConstants.NEAR_BY_TRAVELLERS, 'GET')
            .then((res) => {
              if (res.status === 200 || res.status === 201) return res.json();
              else if (res.status === 404) {
                throw new Error('Api err');
              }
            })
            .then((data) => {
              const otherUsers = data.filter((ele) => ele._id !== user?.userId);
              console.log(
                'nearbyTravellers api response',
                otherUsers,
                user?.userId
              );

              let usersInRange = [];
              for (let key in otherUsers) {
                const otherUserLocation = otherUsers[key].location;
                if (!otherUserLocation) continue;
                const distance = distanceHelper.getDistanceFromLatLonInKm(
                  coords.latitude,
                  coords.longitude,
                  otherUserLocation.latitude,
                  otherUserLocation.longitude
                );
                if (distance <= AppConstants.NEARBY_RADIUS_METERS)
                  usersInRange.push(otherUsers[key]);
              }
              setNearbyTravellers(usersInRange);
            })
            .catch((e) => console.log('nearbyTravellers api error:', e));
        }}
      />
    );
};

export default SearchTravellersButton;
