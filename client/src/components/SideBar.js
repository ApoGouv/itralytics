/**
 * File    : SideBar.js
 * Project : iTrAlytics
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logoITrAlytics from './../images/logos/logo-itralytics.png';
import $ from 'jquery';
window.jQuery = $;
require('materialize-css/dist/js/materialize.js');

class SideBar extends Component {
  render() {
    return (
      <div>
        <ul id="slide-out" className="side-nav fixed z-depth-2 blue-grey darken-3">
          <li className="center no-padding">
            <div className="teal darken-2 white-text header z-depth-2">
              <div className="row">
                <img style={{marginTop: "5%"}} alt="iTrAlytics" width="100" height="100" src={logoITrAlytics} className="responsive-img" />
              </div>
            </div>
          </li>
          <li id="dash_dashboard">
            <Link to={'/dash'} className="waves-effect waves-teal white-text">
              <b><i className="fa fa-bar-chart" aria-hidden="true" /> Dashboard</b>
            </Link>
          </li>
          <li id="dash_realtime">
            <Link to={'/dash/realtime'} className="waves-effect waves-teal white-text">
              <b><i className="fa fa-line-chart" aria-hidden="true" /> Real Time</b>
            </Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default SideBar;