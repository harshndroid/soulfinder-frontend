import './App.css';
import AppRoutes from './routes';
import Loader from './components/Loader';

function App() {
  window.Buffer = window.Buffer || require('buffer').Buffer;
  return (
    <>
      <AppRoutes />
      <Loader />
    </>
  );
}

export default App;
