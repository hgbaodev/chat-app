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
  email: null,
  fullName: null,

  login: {
    isLoading: false
  },
  register: {
    isLoading: false
  },
  verifyEmail: {
    isLoading: false
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.login.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        const result = action.payload.data;
        state.isLoaded = true;
        state.isAuthenticated = true;
        state.email = result.email;
        state.fullName = result.full_name;
        Cookies.set('token', result.access_token);
        Cookies.set('refresh_token', result.refresh_token);
        state.login.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.login.isLoading = false;
      })
      .addCase(logout.fulfilled, (state, action) => {
        if (action.payload.status == 204) {
          state.isAuthenticated = false;
          state.email = null;
          state.fullName = null;
          Cookies.remove('token');
          Cookies.remove('refresh_token');
        }
      })
      .addCase(register.pending, (state) => {
        state.login.isLoading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.register.isLoading = false;
      })
      .addCase(register.rejected, (state) => {
        state.register.isLoading = false;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.verifyEmail.isLoading = true;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.verifyEmail.isLoading = false;
      })
      .addCase(verifyEmail.rejected, (state) => {
        state.verifyEmail.isLoading = false;
      })
      .addCase(getUserFromToken.pending, (state) => {
        state.isLoaded = false;
        state.isAuthenticated = false;
      })
      .addCase(getUserFromToken.fulfilled, (state, action) => {
        const result = action.payload.data?.user;
        state.isAuthenticated = true;
        state.isLoaded = true;
        state.email = result.email;
        state.fullName = result.full_name;
      })
      .addCase(getUserFromToken.rejected, (state) => {
        state.isLoaded = true;
        state.isAuthenticated = false;
      });
  }
});

export default authSlice.reducer;
