import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';

const initialState = {
  isLoading: false,
  totalUnseen: 0,
  notifications: []
};

export const getAllNotifications = createAsyncThunk(
  'relationship/getAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`notifications/`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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

export const markAllNotificationsAsSeen = createAsyncThunk(
  'relationship/markAllNotificationsAsSeen',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.put(
        `notifications/mark-all-as-seen`
      );
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
    receiveNotification(state) {
      state.totalUnseen += 1;
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
      })
      .addCase(getAllNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.data.result;
        state.isLoading = false;
      })
      .addCase(getAllNotifications.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(markAllNotificationsAsSeen.fulfilled, (state) => {
        state.totalUnseen = 0;
        state.notifications = state.notifications.map((notification) => {
          notification.seen = 1;
          return notification;
        });
      });
  }
});

export default notificationSlice.reducer;
export const { receiveNotification } = notificationSlice.actions;
