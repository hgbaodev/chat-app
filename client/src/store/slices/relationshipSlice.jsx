import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';

const initialState = {
  isLoading: false
};

export const getRecommendedUsers = createAsyncThunk(
  'relationship/getRecommendedUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(
        `relationship/get-recommended-users`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchUsers = createAsyncThunk(
  'relationship/searchUsers',
  async (search, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(
        `relationship/search-users/${search}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const relationshipSlice = createSlice({
  name: 'relationship',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRecommendedUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecommendedUsers.fulfilled, (state, action) => {
        console.log('====================================');
        console.log({ action });
        console.log('====================================');
        state.isLoading = false;
      })
      .addCase(getRecommendedUsers.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        console.log('====================================');
        console.log({ action });
        console.log('====================================');
        state.isLoading = false;
      })
      .addCase(searchUsers.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default relationshipSlice.reducer;
