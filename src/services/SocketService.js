import { io } from 'socket.io-client';
import { getBaseApiUrl } from './ApiService';
import LocalStorageService from './LocalStorageService';
import StorageConstants from '../constants/StorageConstants';

let socket = null;

export default {
  connect() {
    if (socket?.connected) return socket;

    const user = LocalStorageService.getItem(StorageConstants.USER);
    socket = io(getBaseApiUrl(), {
      auth: { token: user?.token },
    });
    return socket;
  },
  getSocket() {
    return socket;
  },
  disconnect() {
    socket?.disconnect();
    socket = null;
  },
};
