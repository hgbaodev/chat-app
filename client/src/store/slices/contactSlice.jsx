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

export const getInfoUser = createAsyncThunk(
  'contact/getInforUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`auth/get-info-user`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadProfile = createAsyncThunk(
  'contact/upload-profile',
  async (values, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(
        `profile/upload-profile`,
        values
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const changeNameConversation = createAsyncThunk(
  'contact/change-name-conversation/',
  async (values, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(
        `chat/change-name-conversation/`,
        values
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addMembersInConversation = createAsyncThunk(
  'contact/add-members-conversation/',
  async (values, { rejectWithValue }) => {
    console.log('Values', values);
    try {
      const response = await AxiosInstance.post(
        `chat/conversations/${values.id}/participants/`,
        values
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyCaptcha = createAsyncThunk(
  'contact/verify-captcha',
  async (value, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        value
      );
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
  isLoadingCreateConversation: false,
  openProfile: false,
  info: null,
  isLoadingUploadProfile: false,
  type: 0,
  isLoadingChangeNameConversation: false,
  openChangeNameConversation: false
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setOpenSearch(state, action) {
      state.openSearch = action.payload;
    },
    setOpenMyProfile(state, action) {
      state.openProfile = action.payload;
    },
    setType(state, action) {
      state.type = action.payload;
    },
    setOpenChangeNameConversation(state, action) {
      state.openChangeNameConversation = action.payload;
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
      })
      .addCase(getInfoUser.fulfilled, (state, action) => {
        state.info = action.payload.data?.result;
      })
      .addCase(uploadProfile.pending, (state) => {
        state.isLoadingUploadProfile = true;
      })
      .addCase(uploadProfile.fulfilled, (state, action) => {
        state.isLoadingUploadProfile = false;
        state.info = action.payload.data?.result;
      })
      .addCase(uploadProfile.rejected, (state) => {
        state.isLoadingUploadProfile = false;
      })
      .addCase(changeNameConversation.pending, (state) => {
        state.isLoadingChangeNameConversation = true;
      })
      .addCase(changeNameConversation.fulfilled, (state) => {
        state.isLoadingChangeNameConversation = false;
        state.openChangeNameConversation = false;
      })
      .addCase(changeNameConversation.rejected, (state) => {
        state.isLoadingChangeNameConversation = false;
      });
  }
});

export default contactSlice.reducer;
export const {
  setOpenSearch,
  setOpenMyProfile,
  setType,
  setOpenChangeNameConversation
} = contactSlice.actions;
