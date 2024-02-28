import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';


let accessToken = Cookies.get('token') || '';
let refresh_token = Cookies.get('refresh_token') || '';

const BASEURL = import.meta.env.VITE_APP_API_URL


const AxiosInstance = axios.create({
  baseURL: BASEURL,
  'Content-type': 'application/json',
  headers: {
    Authorization: Cookies.get('token') ? `Bearer ${accessToken}` : ''
  }
});

AxiosInstance.interceptors.request.use(async (req) => {
  if (accessToken) {
    req.headers.Authorization = Cookies.get('token')
      ? `Bearer ${accessToken}`
      : '';
    const user = jwtDecode(accessToken);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    if (!isExpired) return req;
    const resp = await axios.post(`${BASEURL}auth/token/refresh/`, {
      refresh: refresh_token
    });
    Cookies.set('token', resp.data.access)
    req.headers.Authorization = `Bearer ${resp.data.access}`;
    return req;
  } else {
    req.headers.Authorization = Cookies.get('token')
      ? `Bearer ${Cookies.get('token')}`
      : ' ';
    return req;
  }
});

export default AxiosInstance;
