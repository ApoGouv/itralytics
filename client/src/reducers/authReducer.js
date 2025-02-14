/**
 * File    : authReducer.js
 * Project : iTrAlytics
 */
import { FETCH_USER } from '../actions/types';


export default function(state = null, action) {
  switch (action.type){
    case FETCH_USER:
      // '' is a fallsy value
      return action.payload || false;
    default:
      return state;
  }
}