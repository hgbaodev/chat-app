import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { BASEURL } from '~/config';

let accessToken = Cookies.get('token') || '';

const AxiosInstance = axios.create({
  baseURL: BASEURL,
  'Content-type': 'application/json',
  headers: {
    Authorization: Cookies.get('token') ? `Bearer ${accessToken}` : ''
  }
});

AxiosInstance.interceptors.request.use(
  async (req) => {
    const accessToken = Cookies.get('token') || '';
    const refreshToken = Cookies.get('refresh_token') || '';
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
      const tokenExp = jwtDecode(accessToken);
      const isExpired = dayjs.unix(tokenExp.exp).diff(dayjs()) < 1;
      if (!isExpired) return req;
      const refreshExp = jwtDecode(refreshToken).exp;
      if (dayjs.unix(refreshExp).diff(dayjs()) < 1) {
        // For example, redirect user to login page
        window.location.href = '/login';
        return;
      }
      const resp = await axios.post(`${BASEURL}auth/token/refresh`, {
        refresh: refreshToken
      });
      Cookies.set('token', resp.data.access);
      req.headers.Authorization = `Bearer ${resp.data.access}`;
      return req;
    } else {
      return req;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosInstance;
