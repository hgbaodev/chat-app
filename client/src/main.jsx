import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from '~/reportWebVitals';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ReduxProvider store={store}>
    <App />
    <ToastContainer autoClose={1500} pauseOnHover={false} />
  </ReduxProvider>
);

reportWebVitals();
