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
    setOpenContact(state, action) {
      state.contactInfo.open = action.payload;
    },
    updateContactInfoType(state, action) {
      state.contactInfo.type = action.payload.type;
    }
  }
});

export default slice.reducer;
export const { toggleContactInfo, updateContactInfoType, setOpenContact } =
  slice.actions;
