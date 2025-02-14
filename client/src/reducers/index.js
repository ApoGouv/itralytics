/**
 * File    : index.js
 * Project : iTrAlytics
 */
import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import authReducer from './authReducer';
import profilesReducer from './profilesReducer';
import {reportsData, reportsDataIsLoading, fetchReportsDataHasErrored} from './reportsDataReducers';

export default combineReducers({
  auth: authReducer,
  profiles: profilesReducer,
  reportsData,
  fetchReportsDataHasErrored,
  reportsDataIsLoading,
  form: formReducer
});