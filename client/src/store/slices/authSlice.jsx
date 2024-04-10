import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';
import Cookies from 'js-cookie';
import { message } from 'antd';

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

export const loginWithGoogle = createAsyncThunk(
  'auth/google/',
  async (token, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(`auth/google/`, {
        access_token: token
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginWithGithub = createAsyncThunk(
  'auth/github/',
  async (code, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(`auth/github/`, {
        code
      });
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

const handleLoginFulfilled = (state, action) => {
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
  message.open({
    type: 'success',
    content: 'Login Successfully!',
    duration: 2
  });
};

const handleLoginPending = (state) => {
  state.isLoadingLogin = true;
};

const handleLoginRejected = (state, action) => {
  state.isLoadingLogin = false;
  message.open({
    type: 'error',
    content: 'Login Failed: ' + action.error.message,
    duration: 2
  });
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, handleLoginPending)
      .addCase(login.fulfilled, handleLoginFulfilled)
      .addCase(login.rejected, handleLoginRejected)
      .addCase(loginWithGoogle.pending, handleLoginPending)
      .addCase(loginWithGoogle.fulfilled, handleLoginFulfilled)
      .addCase(loginWithGoogle.rejected, handleLoginRejected)
      .addCase(loginWithGithub.pending, handleLoginPending)
      .addCase(loginWithGithub.fulfilled, handleLoginFulfilled)
      .addCase(loginWithGithub.rejected, handleLoginRejected)
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
