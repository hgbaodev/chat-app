import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';

const initialState = {
  isLoading: false,
  totalUnseen: 0,
  notifications: []
};

export const getNumberOfUnseenNotifications = createAsyncThunk(
  'relationship/getNumberOfUnseenNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`notifications/unseen/count`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const notificationSlice = createSlice({
  name: 'relationship',
  initialState,
  reducers: {
    receiveNotification(state, action) {
      state.totalUnseen += 1;
      console.log({ action });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNumberOfUnseenNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNumberOfUnseenNotifications.fulfilled, (state, action) => {
        state.totalUnseen = action.payload.data.result;
        state.isLoading = false;
      })
      .addCase(getNumberOfUnseenNotifications.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default notificationSlice.reducer;
export const { receiveNotification } = notificationSlice.actions;
