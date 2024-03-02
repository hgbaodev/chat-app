import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';

const initialState = {
  isLoading: false,
  sent_friend_requests: [],
  received_friend_requests: []
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

export const sendFriendRequest = createAsyncThunk(
  'relationship/sendFriendRequest',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(
        `relationship/send-friend-request`,
        data
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllSentFriendRequests = createAsyncThunk(
  'relationship/getAllSentFriendRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(
        `relationship/get-all-sent-friend-requests`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllReceivedFriendRequests = createAsyncThunk(
  'relationship/getAllReceivedFriendRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(
        `relationship/get-all-received-friend-requests`
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
      })
      .addCase(sendFriendRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        console.log('====================================');
        console.log({ action });
        console.log('====================================');
        state.isLoading = false;
      })
      .addCase(sendFriendRequest.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllSentFriendRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSentFriendRequests.fulfilled, (state, action) => {
        state.sent_friend_requests = action.payload.data.friend_requests;
        state.isLoading = false;
      })
      .addCase(getAllSentFriendRequests.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllReceivedFriendRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReceivedFriendRequests.fulfilled, (state, action) => {
        state.received_friend_requests = action.payload.data.friend_requests;
        state.isLoading = false;
      })
      .addCase(getAllReceivedFriendRequests.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default relationshipSlice.reducer;
