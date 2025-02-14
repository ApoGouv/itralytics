/**
 * File    : rootFooterContent.js
 * Project : iTrAlytics
 */
import React from 'react';
import $ from 'jquery';
window.jQuery = $;
require('materialize-css/dist/js/materialize.js');

function RootFooterContent() {
  return (
    <div className="container">
      <div className="row">
        <div className="col l6 s12">
          <h5 className="white-text">iTrAlytics</h5>
          <p className="grey-text text-lighten-4">
            Google Analytics in a new Modern way!
          </p>
        </div>
        <div className="col l5 offset-l1 s12">
          <div className="about-content">
            <div className="row">
              <h4>About the app</h4>
              <p>
                iTrAlytics is a web analytics dashboard application made
                with modern technologies.
              </p>
            </div>
            <div className="row">
              <p>Technologies used:</p>
              <div className="col m6">
                <p>In back-end:</p>
                <ul>
                  <li key="tech-01">node.js</li>
                  <li key="tech-02">express.js</li>
                  <li key="tech-03">request</li>
                  <li key="tech-04">mongoose.js</li>
                  <li key="tech-05">passport.js</li>
                </ul>
              </div>
              <div className="col m6">
                <p>In front-end:</p>
                <ul>
                  <li key="ftech-01">React</li>
                  <li key="ftech-02">axios</li>
                  <li key="ftech-03">materialize</li>
                  <li key="ftech-04">moment</li>
                  <li key="ftech-05">Redux</li>
                </ul>
              </div>
            </div>
            <div className="row referrals">
              <p>
                iTrAlytics was made in collaboration with the
                <a
                  href="https://itrust-digital.com/"
                  title="iTrust - Digital Strategy"
                >
                  iTrust
                </a>
                company and the
                <a
                  href="https://www.tech.ihu.edu.gr/index.php/en/"
                  title="IHU - School of Science and Technology"
                >
                  IHU - School of Science and Technology
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RootFooterContent;
