/**
 * File    : loadingSpinner.js
 * Project : iTrAlytics
 */

import React from 'react';

function LoadingSpinner() {
  return (
    <div className="preloader-wrapper big active">
      <div className="spinner-layer spinner-blue">
        <div className="circle-clipper left">
          <div className="circle" />
        </div>
        <div className="gap-patch">
          <div className="circle" />
        </div>
        <div className="circle-clipper right">
          <div className="circle" />
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;