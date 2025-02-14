/**
 * File    : ChartsList.js
 * Project : iTrAlytics
 */
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchReportsData } from '../../actions';
import Chart from './chart';
import LoadingSpinner from '../Utils/loadingSpinner';
import $ from 'jquery';
window.jQuery = $;
require('materialize-css/dist/js/materialize.js');

class ChartsList extends Component {
  renderProfileChart(analyticsData, projectionOn) {
    let data = analyticsData;
    let projectionOnText = ``;
    let msg = ``;

    if (!data || data.length < 1) {
      // dummy initial data
      data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      projectionOnText = ``;
    } else if (!data.rows || data.rows.length < 2) {
      // we do not get valuable or enough data
      data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      projectionOnText = ``;
      msg = `Sorry, not enough data.
      Please adjust your params from the form above and submit again.`;
    } else {
      // we got our data, so get the actual metrics
      projectionOnText = `${projectionOn.metric}/${projectionOn.dimension}`;
      data = _.map(data.rows, row => {
        return _.map(row.metrics, metric => {
          return metric['values'];
        });
      });

      // !!! now we have an array of Strings! we need to convert it to numbers
      data = data.map(Number);

      /** DEBUG */
      /*
      console.log('********* DATA: ', data);
      */
    }

    return <Chart data={data} msg={msg} projection={projectionOnText} color="orange" />;
  }

  renderProfilesBoxes() {
    return _.map(this.props.profiles, profile => {
      let reportsData = this.props.reportsData;
      let projectionOn;

      if (!reportsData || reportsData.length < 1) {
      } else {
        // We want the data for the specific account
        // since we keep track of our previous state, the findIndex() got as covered
        // as it returns the first index matched our criteria and our 'old' state is
        // on the last seats of the array
        projectionOn = reportsData[0].projectionOn;
        let index = reportsData.findIndex(x => x.profileName === profile.name);
        if (index !== -1) {
          reportsData = reportsData[index].reportsData;
        }
      }

      return (
        <div className="card blue-grey darken-1 hoverable" key={profile.id}>
          <div className="card-content white-text">
            <span className="card-title">{profile.name}</span>
            <div>{this.renderProfileChart(reportsData, projectionOn)}</div>
            <div className="card-action">
              <a href={profile.site}>View the site</a>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    if (this.props.fetchReportsDataHasErrored.chk) {
      return (
        <div className="deep-purple" style={{ padding: `15px` }}>
          <div className="container">
            <div className="card-panel red lighten-2 center-align">
              <span className="white-text text-darken-2">
                Sorry! There was an error loading the Analytics Data.
              </span>
              <p className="white-text text-darken-3">
                {this.props.fetchReportsDataHasErrored.error.toString()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (this.props.reportsDataIsLoading) {
      return (
        <div className="deep-purple padding-15">
          <div className="container">
            <div className="card-panel blue-grey darken-1 center-align">
              <LoadingSpinner />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="" style={{ padding: `15px` }}>
        <div className="container">
          <h3>Report</h3>
          {this.renderProfilesBoxes()}
        </div>
      </div>
    );
  }
}

/**
 * Get the following params from the state (e.g: profiles: state.profiles)
 * @param profiles
 * @param reportsData
 * @param fetchReportsDataHasErrored
 * @param reportsDataIsLoading
 * @returns {{profiles: profiles, reportsData: reportsData, fetchReportsDataHasErrored: fetchReportsDataHasErrored, reportsDataIsLoading: reportsDataIsLoading}}
 */
function mapStateToProps({
  profiles,
  reportsData,
  fetchReportsDataHasErrored,
  reportsDataIsLoading
}) {
  return {
    profiles,
    reportsData,
    fetchReportsDataHasErrored,
    reportsDataIsLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchFetchReportsData: () => dispatch(fetchReportsData())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartsList);
