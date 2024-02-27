import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';

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
      .addCase(register.pending, (state) => {
        state.register.isLoading = true;
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
      });
  }
});

export default authSlice.reducer;
