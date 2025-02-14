/**
 * File    : RealTimeDisplay.js
 * Project : iTrAlytics
 */
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchProfiles } from '../../actions';
import $ from 'jquery';
window.jQuery = $;
require('materialize-css/dist/js/materialize.js');
const io = require('socket.io-client');
// eslint-disable-next-line
let socket;

class RealTimeDisplay extends Component {
  constructor(props) {
    super(props);
    // set the initial component state
    this.state = {
      realData: []
    };

    this.updateRealData = this.updateRealData.bind(this);
  }

  /**
   * update the component's state
   * @param payload: holds the realData obj
   */
  updateRealData(payload) {
    let realTimeData = payload.realTimeData;

    // immutable update of state. We keep old state and 'push' new one
    this.setState(prevState => ({
      realData: [realTimeData, ...prevState.realData]
    }));
  }

  componentDidMount() {
    // connect to server socket
    if (process.env.NODE_ENV === 'production') {
      console.log(`https://itralytics.herokuapp.com/`);
      socket = io.connect(`https://itralytics.herokuapp.com/`);
    } else {
      console.log('http://localhost:5000/');
      socket = io.connect('http://localhost:5000/');
    }

    // eslint-disable-next-line
    if (this.props.profiles == undefined) {
      console.log(`--> Client: /!\\ NO Profiles`);
      this.props.fetchProfiles();
    } else {
      // emit a 'getReal' event to the server
      console.log(`--> Client: Emitting 'getReal' event.`);
      socket.emit('getReal', {
        profilesData: this.props.profiles,
        room: 'Get Real'
      });
    }

    // listen for the 'TheRealDeal' event and call the updateRealData() to update the state
    socket.on('TheRealDeal', payload => {
      console.log(`
      --> Client: received 'TheRealDeal' event.
      `);

      /** DEBUG */
      /*
      console.log(` PAYLOAD realTimeData
        ${JSON.stringify(payload.realTimeData, null, '\t')}
      `);
      */

      this.updateRealData(payload);
    });
  }

  componentWillReceiveProps(nextProps) {
    // in case for some reason, that we didn't have the profiles in the Mount
    socket.emit('getReal', {
      profilesData: nextProps.profiles,
      room: 'Get Real'
    });
  }

  componentWillUnmount() {
    // emit an 'UnReal' event to designate that we are leaving the page and thus the room
    console.log(`--> Client: We are leaving, so Emitting 'UnReal' event.`);
    socket.emit('UnReal', {
      room: 'Get Real'
    });
  }

  renderCardContent(profile) {
    let realData = this.state.realData;
    /** DEBUG */
    /*
    console.log(`~~~~~~~~~~~~~~~~
    ${JSON.stringify(realData, null, '\t')}
    ~~~~~~~~~~~~~~~~~~~~~~~~`);
    */
    if (!realData || realData.length < 1) {
      // No data yet, so we init everything to 0
      return (
        <div className="card-content white-text">
          <span className="card-title">{profile.name}</span>
          <div className="card-action">
            <div className="progress">
              <div className="indeterminate" />
            </div>
          </div>
        </div>
      );
    } else {
      let index = realData.findIndex(x => x.query.ids === profile.id);
      if (index !== -1) {
        realData = realData[index];
      }

      // get total active user
      let rtd_total = 0;
      if (realData.totalsForAllResults) {
        rtd_total = realData.totalsForAllResults['rt:activeUsers'];
      }

      // get devices rt data
      let rtd_devices = {
        desktop: 0,
        tablet: 0,
        mobile: 0
      };
      if (realData.rows) {
        realData.rows.forEach(row => {
          if (row[0] === 'DESKTOP') {
            rtd_devices.desktop = row[1];
          } else if (row[0] === 'TABLET') {
            rtd_devices.tablet = row[1];
          } else if (row[0] === 'MOBILE') {
            rtd_devices.mobile = row[1];
          }
        });
      }

      //realData.totalsForAllResults["rt:activeUsers"] = TOTALS????
      // realData.totalResults
      return (
        <div className="card-content white-text">
          <span className="card-title">{profile.name}</span>
          <div className="card-action center-align">
            <div className="rtd-total">
              <span>{rtd_total}</span>
            </div>
            <h3>Total</h3>
          </div>
          <div className="row devices">
            <div className="col l4 m4 s12 center-align">
              <span className="fa-stack desktop">
                <span className="fa fa-laptop fa-stack-2x">{''}</span>
                  <span className="rtd-device fa-stack-1x">
                  {rtd_devices.desktop}
                </span>
              </span>

              <h6>Desktop</h6>
            </div>
            <div className="col l4 m4 s12 center-align">
              <span className="fa-stack tablet">
                <span className="fa fa-tablet fa-stack-2x">{''}</span>
                  <span className="rtd-device fa-stack-1x">
                  {rtd_devices.tablet}
                </span>
              </span>
              <h6>Tablet</h6>
            </div>
            <div className="col l4 m4 s12 center-align">
              <span className="fa-stack mobile">
                <span className="fa fa-mobile fa-rotate-90 fa-stack-2x">{''}</span>
                  <span className="rtd-device fa-stack-1x">
                  {rtd_devices.mobile}
                </span>
              </span>
              <h6>Mobile</h6>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="" style={{ padding: `15px` }}>
        <div className="container">
          <h3>Get Real! Active Users Report</h3>
          <div className="row">
            {_.map(this.props.profiles, profile => {
              return (
                <div className="col l6 m6 s12" key={profile.id}>
                  <div className="card blue-grey darken-1 hoverable scale-transition">
                    {this.renderCardContent(profile)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ profiles }) {
  return { profiles };
}

export default connect(mapStateToProps, { fetchProfiles })(RealTimeDisplay);
