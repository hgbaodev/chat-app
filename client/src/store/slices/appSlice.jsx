import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AxiosInstance from '~/api/AxiosInstance';

export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`profile/${user_id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  contactInfo: {
    open: false,
    type: 'CONTACT' // CONTACT, SHARED, ...
  },
  profile: {
    id: null,
    info: null
  }
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleContactInfo(state) {
      state.contactInfo.open = !state.contactInfo.open;
    },
    setOpenContactInfo(state, action) {
      state.contactInfo.open = action.payload;
    },
    showSharedMessage(state) {
      state.contactInfo.type = 'SHARED';
    },
    showContactInfo(state) {
      state.contactInfo.type = 'CONTACT';
    },
    showMembersGroup(state) {
      state.contactInfo.type = 'MEMBERS';
    },
    setOpenProfile(state, action) {
      state.profile.id = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.profile.info = action.payload.data;
    });
  }
});

export default slice.reducer;
export const {
  toggleContactInfo,
  setOpenContactInfo,
  showSharedMessage,
  showContactInfo,
  showMembersGroup,
  setOpenProfile
} = slice.actions;
