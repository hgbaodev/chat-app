import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from '~/reportWebVitals';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
import { SocketProvider } from './contexts/socketContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { REACT_APP_GITHUB_CLIENT_ID } from '~/config';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ReduxProvider store={store}>
    <SocketProvider>
      <GoogleOAuthProvider clientId={REACT_APP_GITHUB_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </SocketProvider>
  </ReduxProvider>
);

reportWebVitals();
