/**
 * File    : reportsDataReducer.js
 * Project : iTrAlytics
 */
import {
  // eslint-disable-next-line
  REPORTS_DATA_IS_LOADING,
  // eslint-disable-next-line
  FETCH_REPORTS_DATA_SUCCESS,
  // eslint-disable-next-line
  FETCH_REPORTS_DATA_HAS_ERRORED
} from '../actions/types';

export function fetchReportsDataHasErrored(state = false, action) {
  switch (action.type) {
    case 'FETCH_REPORTS_DATA_HAS_ERRORED':
      return action.reportsDataHasErrored;

    default:
      return state;
  }
}

export function reportsDataIsLoading(state = false, action) {
  switch (action.type) {
    case 'REPORTS_DATA_IS_LOADING':
      return action.reportsDataIsLoading;

    default:
      return state;
  }
}

export function reportsData(state = [], action) {
  switch (action.type){
    case 'FETCH_REPORTS_DATA_SUCCESS':
      // concat prev state with new
      return [action.reportsData, ...state];
    default:
      return state;
  }
}
