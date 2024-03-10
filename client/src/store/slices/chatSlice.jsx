import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';

export const getConversations = createAsyncThunk(
  'auth/getConversations',
  async () => {
    try {
      const response = await AxiosInstance.get(`/chat/conversations/`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const initialState = {
  conversations: [],
  isLoading: true
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.conversations = action.payload.data;
        state.isLoading = false;
      })
      .addCase(getConversations.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default chatSlice.reducer;
