/**
 * File    : chart.js
 * Project : iTrAlytics
 */
import _ from 'lodash';
import React from 'react';
import {
  Sparklines,
  SparklinesLine,
  SparklinesReferenceLine,
  SparklinesSpots
} from 'react-sparklines';

function average(data) {
  return _.round(_.sum(data) / data.length);
}

function displayMsg(msg) {
  if (msg === '') {
    return;
  }
  return <div className="red yellow-text padding-15 font-16">{msg}</div>;
}

export default props => {
  return (
    <div>
      <Sparklines height={120} width={600} data={props.data} margin={6}>
        <SparklinesLine color={props.color} />
        <SparklinesReferenceLine type="avg" />
        <SparklinesSpots
          size={4}
          style={{ stroke: props.color, strokeWidth: 3, fill: '#673bb6' }}
        />
      </Sparklines>
      {displayMsg(props.msg)}
      <div className="white-text padding-15 font-16">
        <blockquote style={{ borderColor: `#4caf50` }}>
          Average {props.projection}: {average(props.data)}
        </blockquote>
      </div>
    </div>
  );
};
