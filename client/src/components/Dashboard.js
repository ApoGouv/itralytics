/**
 * File    : Dashboard.js
 * Project : iTrAlytics
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { fetchProfiles, fetchReportsData } from '../actions';
import SideBar from './SideBar';
import ReportsParams from './DashboardElements/ReportsParams';
import ChartsList from './DashboardElements/ChartsList';
import RealTimeDisplay from './DashboardElements/RealTimeDisplay';
import $ from 'jquery';
window.jQuery = $;
require('materialize-css/dist/js/materialize.js');

class Dashboard extends Component {

  componentDidMount(){
    this.props.fetchProfiles();
  }

  renderContent(){
    if (this.props.location.pathname === '/dash'){
      return (
        <div>
          <ReportsParams />
          <ChartsList />
        </div>
      );
    }else if (this.props.location.pathname === '/dash/realtime'){
      return (
        <div>
          <RealTimeDisplay />
        </div>
      );
    }
  }

  render(){

    // auth check:
    // if user not authenticated redirect to root
    if (!this.props.auth){
      return <Redirect to="/" />;
    }

    return (
      <div className="white-text deep-purple" style={{padding: "0px"}}>
        <SideBar />
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps({ profiles, reportsData, auth }){
  return { profiles, reportsData, auth };
}

export default connect(mapStateToProps, { fetchProfiles, fetchReportsData })(Dashboard);