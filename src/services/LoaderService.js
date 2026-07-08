let activeRequestCount = 0;
let listeners = [];

const notify = () => listeners.forEach((listener) => listener(activeRequestCount > 0));

export default {
  subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  start() {
    activeRequestCount += 1;
    notify();
  },
  stop() {
    activeRequestCount = Math.max(0, activeRequestCount - 1);
    notify();
  },
};
