import { createRoot } from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import reportWebVitals from '~/reportWebVitals';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <GoogleOAuthProvider clientId="387483545489-muknqkprotf0b41nlgai6msu2dqf8ftt.apps.googleusercontent.com">
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </GoogleOAuthProvider>,
);

reportWebVitals();
