import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';

const initialState = {
  isLoading: false,
  friends: [],
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

export const cancelFriendRequest = createAsyncThunk(
  'relationship/cancelFriendRequest',
  async (receiver_id, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.delete(
        `relationship/cancel-friend-request/${receiver_id}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const refuseFriendRequest = createAsyncThunk(
  'relationship/refuseFriendRequest',
  async (sender_id, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.delete(
        `relationship/refuse-friend-request/${sender_id}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'relationship/acceptFriendRequest',
  async (sender_id, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(
        `relationship/accept-friend-request/${sender_id}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllFriends = createAsyncThunk(
  'relationship/getAllFriends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`relationship/get-all-friends`);
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
      .addCase(getRecommendedUsers.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getRecommendedUsers.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchUsers.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(searchUsers.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(sendFriendRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendFriendRequest.fulfilled, (state) => {
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
      })
      .addCase(cancelFriendRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelFriendRequest.fulfilled, (state, action) => {
        state.sent_friend_requests = state.sent_friend_requests.filter(
          (item) => item.receiver.id !== action.payload.data.data.receiver
        );
        state.isLoading = false;
      })
      .addCase(cancelFriendRequest.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(refuseFriendRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refuseFriendRequest.fulfilled, (state, action) => {
        state.received_friend_requests = state.received_friend_requests.filter(
          (item) => item.sender.id !== action.payload.data.data.sender
        );
        state.isLoading = false;
      })
      .addCase(refuseFriendRequest.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(acceptFriendRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.received_friend_requests = state.received_friend_requests.filter(
          (item) => item.sender.id !== action.payload.data.data.sender
        );
        state.isLoading = false;
      })
      .addCase(acceptFriendRequest.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllFriends.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllFriends.fulfilled, (state, action) => {
        state.friends = action.payload.data.friends;
        state.isLoading = false;
      })
      .addCase(getAllFriends.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default relationshipSlice.reducer;
