import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';

export const getConversations = createAsyncThunk(
  'chat/getConversations',
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

export const getMessagesOfConversation = createAsyncThunk(
  'chat/getMessagesOfConversation',
  async ({ conversation_id, page }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(
        `/chat/conversations/${conversation_id}/messages/?page=${page}`
      );
      return response;
    } catch (error) {
      throw rejectWithValue(error.response.data);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'chat/deleteMessage',
  async (messageId) => {
    try {
      const response = await AxiosInstance.delete(
        `chat/messages/${messageId}/`
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);


const initialState = {
  conversations: [],
  chat: {
    currentConversation: {
      id: null,
      title: null,
      image: null,
      type: null,
      latest_message: null,
      members: [],
    },
    messages: [],
    lastPage: 0,
    currentPage: 1,
    isLoading: false
  },
  forwardMessage: null,
  isLoading: true
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation(state, action) {
      state.chat.currentConversation = action.payload;
      state.chat.lastPage = 0;
      state.chat.currentPage = 1;
      state.chat.messages = [];
    },
    receiverMessage(state, action) {
      const result = action.payload
      if (result.conversation!=null) {
        state.conversations = [result.conversation, ...state.conversations];
      }
      state.conversations.map((conversation) => {
        if (conversation.id === result.message.conversation_id) {
          conversation.latest_message = result.message;
        }
      });
      state.chat.messages.push(result.message);
    },
    createGroup(state, action) {
      state.conversations.push(action.payload)
    },
    setPage(state, action) {
      state.chat.currentPage = action.payload;
    },
    setForwardMessage(state, action) {
      state.forwardMessage = state.chat.messages.find(
        (message) => message.id === action.payload
      );
    }
  },
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
      })
      .addCase(getMessagesOfConversation.pending, (state) => {
        state.chat.isLoading = true;
      })
      .addCase(getMessagesOfConversation.fulfilled, (state, action) => {
        state.chat.messages = [
          ...action.payload.data.results,
          ...state.chat.messages
        ];
        state.chat.lastPage = action.payload.data.meta.last_page;
        state.chat.isLoading = false;
      })
      .addCase(getMessagesOfConversation.rejected, (state) => {
        state.chat.isLoading = false;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.chat.messages = state.chat.messages.filter(
          (message) => message.id !== action.payload.data.result.message
        );
      });
  }
});

export default chatSlice.reducer;
export const {
  setCurrentConversation,
  receiverMessage,
  setPage,
  setForwardMessage,
  createGroup
} = chatSlice.actions;
