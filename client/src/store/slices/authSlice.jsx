import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';

export const register = createAsyncThunk(
  'auth/register',
  async (credentials) => {
    try {
      const response = await AxiosInstance.post(`auth/register`, credentials);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const initialState = {
  isLoaded: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoaded = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoaded = true;
      })
      .addCase(register.rejected, (state) => {
        state.isLoaded = true;
      });
  }
});

export default authSlice.reducer;
