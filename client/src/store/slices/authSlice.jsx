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

const initialState = {
  formRegister: {
    isLoading: false,
    errors: null
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.formRegister.isLoading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.formRegister.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.formRegister.isLoading = false;
        state.formRegister.errors = action.payload;
      });
  }
});

export default authSlice.reducer;
