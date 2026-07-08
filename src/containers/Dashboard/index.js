import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import TopBar from '../../components/TopBar';
import Modal from '../../components/Modal';
import SearchTravellersButton from './SearchTravellersButton';
import TravellerCards from './TravellerCards';
import Styles from '../../styles/DashboardStyles';
import ApiService from '../../services/ApiService';
import LocalStorageService from '../../services/LocalStorageService';
import StorageConstants from '../../constants/StorageConstants';
import ApiConstants from '../../constants/ApiConstants';
import fetchNearbyTravellers from './fetchNearbyTravellers';

const Dashboard = () => {
  const navigate = useNavigate();

  const [photo, setPhoto] = useState('');
  const [coords, setCoords] = useState({});
  const [nearbyTravellers, setNearbyTravellers] = useState([]);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);

  const user = LocalStorageService.getItem(StorageConstants.USER);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        const requestPayload = {
          id: user?.userId,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          lastSeenAt: Date.now(),
        };

        ApiService.fetchApi(ApiConstants.INIT, 'POST', requestPayload)
          .then((res) => {
            if (res.status === 200 || res.status === 201) return res.json();
            else if (res.status === 401 || res.status === 404) {
              LocalStorageService.removeItem(StorageConstants.USER);
              navigate('/login');
              throw new Error('Api err');
            }
          })
          .then((data) => {
            console.log('Init api response', data);
            let updatedUserData = data.data;
            delete updatedUserData['_id'];
            delete updatedUserData['__v'];
            LocalStorageService.setItem(StorageConstants.USER, {
              ...user,
              ...updatedUserData,
            });
            setPhoto(data.data.photoUrl);
            fetchNearbyTravellers(
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              user?.userId,
              setNearbyTravellers
            );
          })
          .catch((e) => console.log('Init api error:', e));
      });
    }
  }, []);

  return (
    <div style={Styles.main}>
      <Modal
        photo={photo}
        open={showUpdateUserModal}
        onClose={() => setShowUpdateUserModal(false)}
      />
      <TopBar
        title="Travelling souls near you"
        content={photo}
        onClickContent={() => setShowUpdateUserModal(true)}
      />
      <TravellerCards
        nearbyTravellers={nearbyTravellers}
        setNearbyTravellers={setNearbyTravellers}
      />
      <SearchTravellersButton
        coords={coords}
        nearbyTravellers={nearbyTravellers}
        setNearbyTravellers={setNearbyTravellers}
      />
      <br />
      <br />
    </div>
  );
};

export default Dashboard;
