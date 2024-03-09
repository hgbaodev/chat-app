const env = import.meta.env

export const BASEURL = env.VITE_APP_API_URL || '';
export const WEBSOCKETURL = env.VITE_WS_ENDPOINT || '';