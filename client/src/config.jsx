const env = import.meta.env;

export const BASEURL = env.VITE_APP_API_URL || '';
export const WEBSOCKETURL = env.VITE_WS_ENDPOINT || '';
export const REACT_APP_GITHUB_CLIENT_ID = 'de16f5b5212ed121607c';
export const REACT_APP_GOOGLE_CLIENT_ID =
  '993014909858-mnmugnrdc1jt97601r42f4ia79b0c5be.apps.googleusercontent.com';
