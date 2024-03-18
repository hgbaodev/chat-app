import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import relationshipReducer from './slices/relationshipSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import contactReducer from '~/store/slices/contactSlice';

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['app']
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  relationship: relationshipReducer,
  chat: chatReducer,
  notifications: notificationReducer,
  contact: contactReducer
});

export { rootPersistConfig, rootReducer };
