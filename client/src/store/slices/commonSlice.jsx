import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profileModal: {
    open: false,
    type: 'CONTACT'
  }
};

const slice = createSlice({
  name: 'common',
  initialState,
  reducers: {
  }
})