import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from '~/reportWebVitals';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { SocketProvider } from './contexts/socketContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ReduxProvider store={store}>
    <SocketProvider>
      <App />
    </SocketProvider>
  </ReduxProvider>
);

reportWebVitals();
