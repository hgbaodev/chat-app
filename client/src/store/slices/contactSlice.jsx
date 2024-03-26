import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';

export const findConversations = createAsyncThunk(
  'contact/find-conversations',
  async (query) => {
    try {
      const response = await AxiosInstance.get(
        `/chat/find-conversations/?query=${query}`
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const createConversation = createAsyncThunk(
  'contact/create-conversation',
  async (value, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(`chat/conversations/`, value);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  searchConversation: [],
  openSearch: false,
  isLoading: false,
  isLoadingCreateConversation: false
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
        state.searchConversation = action.payload.data?.result;
      })
      .addCase(findConversations.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createConversation.pending, (state) => {
        state.isLoadingCreateConversation = true;
      })
      .addCase(createConversation.fulfilled, (state) => {
        state.isLoadingCreateConversation = false;
      })
      .addCase(createConversation.rejected, (state) => {
        state.isLoadingCreateConversation = false;
      });
  }
});

export default contactSlice.reducer;
export const { setOpenSearch } = contactSlice.actions;
