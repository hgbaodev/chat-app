import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';

export const findConversations = createAsyncThunk(
  'chat/find-conversations',
  async (query) => {
    try {
      const response = await AxiosInstance.get(`/chat/find-conversations/?query=${query}`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const initialState = {
  searchConversation: [],
  openSearch: false,
  isLoading: false,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setOpenSearch(state, action) {
      state.openSearch = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(findConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(findConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchConversation = action.payload.data?.result
      })
      .addCase(findConversations.rejected, (state) => {
        state.isLoading = false;
      })
  }
});

export default contactSlice.reducer;
export const {
  setOpenSearch,
} = contactSlice.actions;
