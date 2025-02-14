/**
 * File    : index.js
 * Project : iTrAlytics
 */
import axios from 'axios';

import {
  FETCH_USER,
  FETCH_PROFILES,
  // eslint-disable-next-line
  REPORTS_DATA_IS_LOADING,
  // eslint-disable-next-line
  FETCH_REPORTS_DATA_SUCCESS,
  // eslint-disable-next-line
  FETCH_REPORTS_DATA_HAS_ERRORED
} from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/currentUser');

  dispatch({ type: FETCH_USER, payload: res.data });
};

/**
 * fetchProfiles: make a GET request to
 * get the logged in users Analytics account info
 * ~ most importantly, we want the WebProperties from which we will
 *    retrieve the ga:id to later make queries to get analytics data
 */
export const fetchProfiles = () => async dispatch => {
  const res = await axios.get('/api/analytics/accountSummary');

  dispatch({ type: FETCH_PROFILES, payload: res.data });
};

/**
 * Boolean check to display in the ChartList component loading...
 * @param bool
 * @returns {{type: string, isLoading: *}}
 */
export function reportsDataIsLoading(bool) {
  return {
    type: 'REPORTS_DATA_IS_LOADING',
    reportsDataIsLoading: bool
  };
}

/**
 * Error while trying to get analytics data
 * @param chk: boolean
 * @param error: the actual error
 * @returns {{type: string, reportsDataHasErrored: {chk: *, error: *}}}
 */
export function fetchReportsDataHasErrored(chk, error) {
  return {
    type: 'FETCH_REPORTS_DATA_HAS_ERRORED',
    reportsDataHasErrored: { chk, error}
  };
}

/**
 * Successfully retrieved our analytics data
 * @param reportsData
 * @returns {{type: string, reportsData: *}}
 */
export function fetchReportsDataSuccess(reportsData) {

  /* DEBUG */
  /*
  console.log('INSIDE fetchReportsDataSuccess: ', reportsData);
   */

  return {
    type: 'FETCH_REPORTS_DATA_SUCCESS',
    reportsData
  };
}

/**
 * @param profile | we use it for profile name and id e.g: profile.id = ga:154623183
 * @param dateRange | obj with startDate e.g:2017-07-01 & endDate e.g: 2017-10-29
 * @param metricsExpression Array of Objects,
 * e.g: [{ expression: 'ga:pageviews' }]
 * @param dimensionsName Array of Objects,
 * e.g: [{ name: 'ga:month' }]
 */
export const fetchReportsData = (
  profile,
  dateRange,
  metricsExpression,
  dimensionsName
) => async dispatch => {
  // set is loading to true
  dispatch(reportsDataIsLoading(true));

  try {
    let params = `viewId=${profile.id}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&metricsExpression=${metricsExpression.value}&dimensionsName=${dimensionsName.value}`;
    const res = await axios.get(`/api/analytics/reportsBatchGet?${params}`);

    // set is loading to false
    dispatch(reportsDataIsLoading(false));

    let dataProfileBundle = {
      profileName: profile.name,
      projectionOn: {
        metric: metricsExpression.text,
        dimension: dimensionsName.text
      },
      reportsData: res.data
    };

    /* DEBUG */
    /*
    console.log('INSIDE fetchReportsData: ', dataProfileBundle);
    */

    dispatch(fetchReportsDataSuccess(dataProfileBundle));

    /*
    dispatch({
      type: FETCH_REPORTS_DATA,
      payload: res.data
    });
    */
  } catch (err) {
    dispatch(fetchReportsDataHasErrored(true, err));
  }
};
