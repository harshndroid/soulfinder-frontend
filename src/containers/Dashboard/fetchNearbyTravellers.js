import ApiService from '../../services/ApiService';
import ApiConstants from '../../constants/ApiConstants';
import AppConstants from '../../constants/AppConstants';
import distanceHelper from '../../utils/distanceHelper';

const fetchNearbyTravellers = (coords, userId, setNearbyTravellers) => {
  ApiService.fetchApi(ApiConstants.NEAR_BY_TRAVELLERS, 'GET')
    .then((res) => {
      if (res.status === 200 || res.status === 201) return res.json();
      else if (res.status === 404) {
        throw new Error('Api err');
      }
    })
    .then((data) => {
      const otherUsers = data.filter((ele) => ele._id !== userId);
      console.log('nearbyTravellers api response', otherUsers, userId);

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
};

export default fetchNearbyTravellers;
