import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';
import Cookies from 'js-cookie';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(`auth/login`, credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const refresh = Cookies.get('refresh_token');
  try {
    const response = await AxiosInstance.post(`auth/logout`, {
      refresh_token: refresh
    });
    return response;
  } catch (error) {
    console.log(error);
  }
});

export const getUserFromToken = createAsyncThunk(
  'auth/getUserFromToken',
  async () => {
    try {
      const response = await AxiosInstance.get(`auth/get-something`);
      return response;
    } catch (error) {
      Cookies.remove('token');
      Cookies.remove('refresh_token');
      throw error;
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(`auth/register`, credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(
        `auth/verify-email`,
        credentials
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



const initialState = {
  isAuthenticated: false,
  loaded: false,
  user: {
    id: null,
    email: null,
    fullName: null,
    avatar: null
  },
  isLoadingLogin: false,
  isLoadingRegister: false,
  isLoadingVerifyEmail: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoadingLogin = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        const result = action.payload.data.result;
        state.isLoaded = true;
        state.isAuthenticated = true;
        state.user.id = result.id;
        state.user.email = result.email;
        state.user.fullName = result.full_name;
        state.user.avatar = result.avatar;
        Cookies.set('token', result.access_token);
        Cookies.set('refresh_token', result.refresh_token);
        state.isLoadingLogin = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoadingLogin = false;
      })
      .addCase(logout.fulfilled, (state, action) => {
        if (action.payload.status == 204) {
          state.isAuthenticated = false;
          state.user.email = null;
          state.user.fullName = null;
          state.user.avatar = null;
          Cookies.remove('token');
          Cookies.remove('refresh_token');
        }
      })
      .addCase(register.pending, (state) => {
        state.isLoadingRegister = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoadingRegister = false;
      })
      .addCase(register.rejected, (state) => {
        state.isLoadingRegister = false;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoadingVerifyEmail = true;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoadingVerifyEmail = false;
      })
      .addCase(verifyEmail.rejected, (state) => {
        state.isLoadingVerifyEmail = false;
      })
      .addCase(getUserFromToken.pending, (state) => {
        state.isLoaded = false;
        state.isAuthenticated = false;
      })
      .addCase(getUserFromToken.fulfilled, (state, action) => {
        const result = action.payload.data?.result;
        state.isAuthenticated = true;
        state.isLoaded = true;
        state.user.id = result.id;
        state.user.email = result.email;
        state.user.avatar = result.avatar;
        state.user.fullName = result.full_name;
      })
      .addCase(getUserFromToken.rejected, (state) => {
        state.isLoaded = true;
        state.isAuthenticated = false;
      });
  }
});

export default authSlice.reducer;
