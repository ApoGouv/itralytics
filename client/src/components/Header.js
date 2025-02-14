/**
 * File    : Header.js
 * Project : iTrAlytics
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import logoITrAlytics from './../images/logos/logo-itralytics.png';
import $ from 'jquery';
window.jQuery = $;
require('materialize-css/dist/js/materialize.js');

class Header extends Component {
  renderLeftMenu() {
    switch (this.props.auth) {
      case null:
        return [
          <li key="menu-item-0">
            <Link to={'/'} className="left brand-logo">
              <img alt="iTrAlytics" width="150" src={logoITrAlytics} className="responsive-img" />
            </Link>
          </li>
        ];
      case false:
        return [
          <li key="menu-item-0">
            <Link to={'/'} className="left brand-logo">
              <img alt="iTrAlytics" width="150" src={logoITrAlytics} className="responsive-img" />
            </Link>
          </li>
        ];
      default:
        if (
          this.props.location.pathname === '/dash' ||
          this.props.location.pathname === '/dash/realtime'
        ) {
          return [
            <li key="menu-item-0">
              <a href="#!" data-activates="slide-out" className="button-collapse">
                <i className="material-icons">menu</i>
              </a>
            </li>,
            <li key="menu-item-1">
              <Link to={'/'} className="">
                Home <i className="fa fa-home" aria-hidden="true" />
              </Link>
            </li>,
            <li key="menu-item-2" style={{ margin: '0 10px' }}>
              <Link to={'/dash'} className="">
                Dashboard <i className="fa fa-bar-chart" aria-hidden="true" />
              </Link>
            </li>
          ];
        } else {
          return [
            <li key="menu-item-0">
              <Link to={'/dash'} className="left brand-logo">
                <img alt="iTrAlytics" width="150" src={logoITrAlytics} className="responsive-img" />
              </Link>
            </li>,
            <li key="menu-item-1">
              <Link to={'/'} className="">
                Home <i className="fa fa-home" aria-hidden="true" />
              </Link>
            </li>,
            <li key="menu-item-2" style={{ margin: '0 10px' }}>
              <Link to={'/dash'} className="">
                Dashboard <i className="fa fa-bar-chart" aria-hidden="true" />
              </Link>
            </li>
          ];
        }
    }
  }

  renderRightMenu() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return [
          <li key="menu-item-1">
            <i className="fa fa-sign-in" aria-hidden="true" /> Login With
          </li>,
          <li key="menu-item-2">
            <a href="/auth/google">
              <i className="fa fa-google" />oogle
            </a>
          </li>
        ];
      default:
        return [
          <li key="menu-item-4">Welcome,</li>,
          <li key="menu-item-5" style={{ margin: '0 10px' }}>
            {this.props.auth.name}
          </li>,
          <li key="menu-item-6">
            <a href="#!" className="dropdown-button btn-floating btn-large orange"
               data-activates="profile-options"
               data-outuration="350"
               data-beloworigin="true">
              <i className="material-icons">menu</i>
            </a>
            <ul key="menu-item-7" id='profile-options' className='dropdown-content'>
              <li key="menu-item-12" className="red">
                <a className="" title="Logout" href="/api/logout">
                  Logout <i className="fa fa-sign-out" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </li>
        ];
    }
  }

  render() {

    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 350,
        constrainWidth: false, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        belowOrigin: true, // Displays dropdown below the button
      }
    );
    $('.button-collapse').sideNav();

    let gradientBG = {
      backgroundColor: `rgb(39, 45, 78)`,
      backgroundImage: `radial-gradient(circle farthest-side at right bottom, rgb(39, 45, 78) 27%, rgb(38, 166, 154) 100%)`
    };

    return (
      <div className="navbar-fixed z-depth-2">
        <nav className="" style={gradientBG}>
          <div className="container nav-wrapper">
            <ul className="left">{this.renderLeftMenu()}</ul>
            <ul className="right">{this.renderRightMenu()}</ul>
          </div>
        </nav>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
