import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';
import { MessageTypes } from '~/utils/enum';

export const getConversations = createAsyncThunk(
  'chat/getConversations',
  async ({ page }) => {
    try {
      const response = await AxiosInstance.get(
        `/chat/conversations/?page=${page}`
      );
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

export const recallMessageRequest = createAsyncThunk(
  'chat/recallMessage',
  async (messageId) => {
    try {
      const response = await AxiosInstance.put(`chat/messages/${messageId}/`);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const pinConversation = createAsyncThunk(
  'chat/pin-conversation',
  async (conversation_id, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(`chat/pin-conversation/`, {
        conversation_id
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const unPinConversation = createAsyncThunk(
  'chat/unpin-conversation',
  async (conversation_id, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(`chat/unpin-conversation/`, {
        conversation_id
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const leaveConversation = createAsyncThunk(
  'chat/leave-conversation',
  async (conversation_id, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(`chat/leave-conversation/`, {
        conversation_id
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAttachments = createAsyncThunk(
  'chat/getAttachments',
  async ({ conversation_id, type }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(
        `/chat/conversations/${conversation_id}/attachments?type=${type}`
      );
      return { type, data: response.data };
    } catch (error) {
      throw rejectWithValue(error.response.data);
    }
  }
);

export const pinMessage = createAsyncThunk(
  'chat/pinMessage',
  async ({ conversation_id, message_id }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(
        `/chat/conversations/${conversation_id}/pinned/`,
        { message_id }
      );
      return response;
    } catch (error) {
      throw rejectWithValue(error.response.data);
    }
  }
);

export const unpinMessage = createAsyncThunk(
  'chat/unpinMessage',
  async ({ conversation_id, message_id }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.delete(
        `/chat/conversations/${conversation_id}/pinned/${message_id}`
      );
      return response;
    } catch (error) {
      throw rejectWithValue(error.response.data);
    }
  }
);

export const getPinnedMessages = createAsyncThunk(
  'chat/getPinnedMessages',
  async (conversation_id, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(
        `/chat/conversations/${conversation_id}/pinned`
      );
      return response;
    } catch (error) {
      throw rejectWithValue(error.response.data);
    }
  }
);

export const getInfoConversation = createAsyncThunk(
  'chat/getInfoConversation',
  async (conversation_id, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(
        `/chat/conversations/${conversation_id}/`
      );
      return response;
    } catch (error) {
      throw rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  conversations: [],
  currentPage: 1,
  lastPage: 0,
  chat: {
    currentConversation: {
      id: null,
      title: null,
      image: null,
      type: null,
      latest_message: null,
      members: [],
      is_pinned: null,
      admin: null
    },
    typingIndicator: null,
    messages: {
      data: [],
      lastPage: 0,
      currentPage: 1
    },
    attachments: {
      images: [],
      documents: []
    },
    pinned_messages: {
      isOpen: false,
      data: []
    }
  },
  call: {
    open: false,
    calling: false,
    refused: false,
    ended: false,
    peer_ids: [],
    conversation: {}
  },
  forwardMessage: null,
  isLoading: false,
  isLoadingSecond: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation(state, action) {
      state.chat.currentConversation = action.payload;
      state.chat.messages.lastPage = 0;
      state.chat.messages.currentPage = 1;
      state.chat.messages.data = [];
      state.chat.pinned_messages.isOpen = false;
      state.chat.pinned_messages.data = [];
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    receiverMessage(state, action) {
      const result = action.payload;
      if (result.conversation != null)
        if (state.conversations.find((c) => c.id === c.id) == null) {
          if (result.conversation != null) {
            state.conversations = [result.conversation, ...state.conversations];
          }
        }
      state.conversations.map((conversation) => {
        if (conversation.id === result.message.conversation_id) {
          conversation.latest_message = result.message;
        }
      });
      if (state.chat.currentConversation.id === result.message.conversation_id)
        state.chat.messages.data.push(result.message);
    },
    changeStatePinMessage(state, action) {
      const { currentConversation, messages } = state.chat;
      const { conversation_id, message_id, is_pinned } = action.payload;
      if (currentConversation.id === conversation_id) {
        let message = messages.data.find(
          (message) => message.id === message_id
        );
        if (message) message.is_pinned = is_pinned;
        if (!is_pinned) {
          state.chat.pinned_messages.data =
            state.chat.pinned_messages.data.filter(
              (message) => message.id !== message_id
            );
        }
      }
    },
    createGroup(state, action) {
      const result = action.payload;
      const conversationExists = state.conversations.some(
        (conversation) => conversation.id === result.id
      );
      const currentConversation = state.chat.currentConversation;
      const addNewMembers = (conversation, newMembers) => {
        const existingMembersIds = conversation.members.map(
          (member) => member.id
        );
        newMembers.forEach((member) => {
          if (!existingMembersIds.includes(member.id)) {
            conversation.members.push(member);
          }
        });
      };
      if (!conversationExists) {
        state.conversations.push(result);
      } else {
        const index = state.conversations.findIndex(
          (conversation) => conversation.id === result.id
        );
        if (index !== -1) {
          addNewMembers(state.conversations[index], result.members);
        }
      }
      if (currentConversation.id === result.id) {
        addNewMembers(currentConversation, result.members);
      }
    },
    setPage(state, action) {
      state.chat.messages.currentPage = action.payload;
    },
    setForwardMessage(state, action) {
      state.forwardMessage = state.chat.messages.data.find(
        (message) => message.id === action.payload
      );
      state.chat.pinned_messages.isOpen = false;
    },
    recallMessage(state, action) {
      const { currentConversation, messages } = state.chat;
      const { conversation_id, id } = action.payload;
      if (currentConversation.id === conversation_id) {
        let message = messages.data.find((message) => message.id === id);
        if (message) {
          message.message_type = MessageTypes.RECALL;
        }
      }
    },
    openCall(state) {
      state.call.calling = false;
      state.call.peer_ids = [];
    },
    setCall(state, action) {
      state.call.calling = action.payload.calling;
      state.call.refused = action.payload.refused;
      state.call.ended = action.payload.ended;
      if (action.payload.open !== undefined) {
        state.call.open = action.payload.open;
      }
    },
    setPeerIds(state, action) {
      state.call.peer_ids = action.payload.peer_ids;
    },
    removePeerId(state, action) {
      state.call.peer_ids = state.call.peer_ids.filter(
        (peer_id) => peer_id !== action.payload.peer_id
      );
    },
    setConversationCall(state, action) {
      state.call.conversation = action.payload.conversation;
      state.conversations = state.conversations.map((conversation) => {
        if (conversation.id === action.payload.conversation.conversation_id) {
          conversation.calling = true;
        }
        return conversation;
      });
    },
    resetVideoCall(state, action) {
      state.call.open = false;
      state.call.calling = false;
      state.call.refused = false;
      state.call.ended = true;
      state.call.peer_ids = [];

      // update conversation calling
      state.conversations = state.conversations.map((conversation) => {
        if (conversation.id === action.payload.conversation_id) {
          conversation.calling = false;
        }
        return conversation;
      });
      // update video-call message
      if (
        state.chat.currentConversation.id === action.payload.conversation_id
      ) {
        state.chat.messages.data = state.chat.messages.data.map((message) => {
          if (message.message_type === MessageTypes.VIDEOCALL) {
            if (message.videocall.id === action.payload.message_id) {
              message.videocall.ended = true;
              message.videocall.duration = action.payload.duration;
            }
          }
          return message;
        });
      }
    },
    updateVideoCallMessage(state, action) {
      // update conversation calling
      state.conversations = state.conversations.map((conversation) => {
        if (conversation.id === action.payload.conversation_id) {
          conversation.calling = false;
        }
        return conversation;
      });
      // update video-call message
      if (
        state.chat.currentConversation.id === action.payload.conversation_id
      ) {
        state.chat.messages.data = state.chat.messages.data.map((message) => {
          if (message.message_type === MessageTypes.VIDEOCALL) {
            if (message.videocall.id === action.payload.message_id) {
              message.videocall.ended = true;
              message.videocall.duration = action.payload.duration;
            }
          }
          return message;
        });
      }
    },
    setConversationCallingState(state, action) {
      state.conversations = state.conversations.map((conversation) => {
        if (conversation.id === action.payload.conversation_id) {
          conversation.calling = action.payload.calling;
        }
        return conversation;
      });
    },
    setTypingIndicator(state, action) {
      state.chat.typingIndicator = action.payload;
    },
    receiveChangeNameConversation(state, action) {
      const result = action.payload;
      const checkIndex = state.conversations.findIndex(
        (con) => con.id === result.id
      );
      if (checkIndex !== -1) {
        state.conversations[checkIndex].title = result.title;
        state.conversations[checkIndex].latest_message = result.message;
        if (state.chat.currentConversation.id === result.id) {
          state.chat.currentConversation.title = result.title;
          state.chat.messages.data.push(result.message);
        }
      }
    },
    changeStatusUser(state, action) {
      const { user_id, status } = action.payload;
      state.conversations.forEach((conversation) => {
        const memberIndex = conversation.members.findIndex(
          (member) => member.id === user_id
        );
        if (memberIndex !== -1) {
          conversation.members[memberIndex].status = status;
        }
      });
      const currentConversation = state.chat.currentConversation;
      const memberIndexInCurrentConversation =
        currentConversation.members.findIndex(
          (member) => member.id === user_id
        );
      if (memberIndexInCurrentConversation !== -1) {
        currentConversation.members[memberIndexInCurrentConversation].status =
          status;
      }
    },
    setOpenPinnedMessage(state, action) {
      state.chat.pinned_messages.isOpen = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => {
        if (state.conversations.length == 0) state.isLoading = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.conversations = [
          ...state.conversations,
          ...action.payload.data.results
        ];
        state.currentPage = action.payload.data.meta.current_page;
        state.lastPage = action.payload.data.meta.last_page;
        state.isLoading = false;
      })
      .addCase(getConversations.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getMessagesOfConversation.fulfilled, (state, action) => {
        if (
          !state.chat.messages.data.find(
            (message) => message.id === action.payload.data.results[0].id
          )
        ) {
          state.chat.messages.data = [
            ...action.payload.data.results,
            ...state.chat.messages.data
          ];
          state.chat.messages.lastPage = action.payload.data.meta.last_page;
        }
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.chat.messages.data = state.chat.messages.data.filter(
          (message) => message.id !== action.payload.data.result.message
        );
      })
      .addCase(pinConversation.fulfilled, (state, action) => {
        const id = action.payload.data.result.conversation_id;
        const conversationIndex = state.conversations.findIndex(
          (conversation) => conversation.id === id
        );
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].is_pinned = true;
        }
        if (state.chat.currentConversation.id == id) {
          state.chat.currentConversation.is_pinned = true;
        }
      })
      .addCase(unPinConversation.fulfilled, (state, action) => {
        const id = action.payload.data.result.conversation_id;
        const conversationIndex = state.conversations.findIndex(
          (conversation) => conversation.id === id
        );
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].is_pinned = false;
        }
        if (state.chat.currentConversation.id == id) {
          state.chat.currentConversation.is_pinned = false;
        }
      })
      .addCase(leaveConversation.fulfilled, (state, action) => {
        const id = action.payload.data.result.conversation_id;
        state.conversations = state.conversations.filter(
          (conversation) => conversation.id != id
        );
        state.chat.currentConversation = {
          id: null,
          title: null,
          image: null,
          type: null,
          latest_message: null,
          members: [],
          is_pinned: null
        };
      })
      .addCase(getAttachments.fulfilled, (state, action) => {
        if (action.payload.type === MessageTypes.IMAGE) {
          state.chat.attachments.images = action.payload.data;
        } else if (action.payload.type === MessageTypes.DOCUMENT) {
          state.chat.attachments.documents = action.payload.data;
        }
      })
      .addCase(getPinnedMessages.fulfilled, (state, action) => {
        state.chat.pinned_messages.data = action.payload.data;
      })
      .addCase(getInfoConversation.fulfilled, (state, action) => {
        state.chat.currentConversation = action.payload.data;
        state.chat.messages.lastPage = 0;
        state.chat.messages.currentPage = 1;
        state.chat.messages.data = [];
        state.chat.pinned_messages.isOpen = false;
        state.chat.pinned_messages.data = [];
      });
  }
});

export default chatSlice.reducer;
export const {
  setCurrentConversation,
  receiverMessage,
  setPage,
  setForwardMessage,
  createGroup,
  recallMessage,
  setCurrentPage,
  openCall,
  setCall,
  setConversationCall,
  setPeerIds,
  removePeerId,
  resetVideoCall,
  updateVideoCallMessage,
  setTypingIndicator,
  changeStatePinMessage,
  receiveChangeNameConversation,
  changeStatusUser,
  setOpenPinnedMessage,
  setConversationCallingState
} = chatSlice.actions;
