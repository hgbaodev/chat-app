import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import relationshipReducer from './slices/relationshipSlice';
import chatReducer from './slices/chatSlice';

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
  chat: chatReducer
});

export { rootPersistConfig, rootReducer };
