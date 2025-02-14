/**
 * File    : Landing.js
 * Project : iTrAlytics
 */
import React from 'react';
import Particles from 'react-particles-js';
import {particlesJsConfig} from './../config/particlesjs-config';
import $ from 'jquery';
window.jQuery = $;
require('materialize-css/dist/js/materialize.js');

function Landing() {

  return (
    <div>
      <section id="splash-blue"
               style={{
                 backgroundColor: '#272D4E',
                 backgroundImage: 'radial-gradient(circle farthest-side at right bottom,rgba(39, 45, 78, 1) 34%,rgb(38, 166, 154) 100%)',
                 position: 'relative',
                 paddingTop: '90px',
                 paddingBottom: '240px'
               }}
               className="z-depth-1">
        <div id="particles-js"
             style={{
               top: '0',
               position: 'absolute',
               width: '100%',
               height: '100%'
             }}>
          <Particles
            height="500px"
            params={particlesJsConfig}
            style={{
              width: '100%',
              height: '500px'
            }}
          />
        </div>
        <div className="container">
          <div className="row hide-on-small-only hero-home">
            <div className="col m10 offset-m1 s12 l10 offset-l1">
              <h1 className="white-text main-title center-align">iTrAlytics</h1>
              <h5 className="white-text sub-title center-align">Get to know your users!</h5>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;