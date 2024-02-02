import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contactInfo: {
    open: false,
    type: 'CONTACT' // CONTACT, SHARED, ...
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
    }
  }
});

export default slice.reducer;
export const {
  toggleContactInfo,
  setOpenContactInfo,
  showSharedMessage,
  showContactInfo
} = slice.actions;
