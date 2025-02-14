/**
 * File    : Footer.js
 * Project : iTrAlytics
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import RootFooterContent from './rootFooterContent'
import logoITrust from './../images/logos/logo-itrust.png';
import logoCubeDesigns from './../images/logos/logo-cubedesigns.png';
import $ from 'jquery';
window.jQuery = $;
require('materialize-css/dist/js/materialize.js');

class Footer extends Component {
  copyrightTillNow(year, copyrightText) {
    let yearNow = new Date().getFullYear();
    if (year >= yearNow) {
      return `© ${year}, ${copyrightText}`;
    } else {
      return `© ${year} - ${yearNow}, ${copyrightText}`;
    }
  }

  renderLeftCompanies() {
    return [
      <li
        key="company-item-1"
        className="cubedesigns"
        style={{ margin: '0 10px' }}
      >
        <a
          className="grey-text text-lighten-4 right"
          href="https://cubedesigns.gr"
        >
          <img
            className="logo"
            src={logoCubeDesigns}
            alt="Cube Designs"
            title="Cube Designs - Web Development"
          />
        </a>
      </li>,
      <li key="company-item-2" className="itrust">
        <a
          className="grey-text text-lighten-4 right"
          href="https://itrust-digital.com/"
        >
          <img
            className="logo"
            src={logoITrust}
            alt="iTrust"
            title="iTrust - Digital Strategy"
          />
        </a>
      </li>
    ];
  }

  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <RootFooterContent />
        );
      default:
        if (
          this.props.location.pathname === '/dash' ||
          this.props.location.pathname === '/dash/realtime'
        ) {
          return;
        } else {
          return (
            <RootFooterContent />
          );
        }
    }
  }

  render() {
    return (
      <footer className="page-footer grey darken-4">
        {this.renderContent()}
        <div className="footer-copyright">
          <div className="container">
            <div className="row z-depth-2">
              <div className="">
                <nav className="grey darken-4 nav-footer">
                  <div className="nav-wrapper">
                    <ul className="left">
                      <li>
                        {this.copyrightTillNow(2016, 'Apostolos Gouvalas')}
                      </li>
                    </ul>
                    <ul className="right">{this.renderLeftCompanies()}</ul>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Footer);
