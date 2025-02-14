/**
 * File    : ReportsParams.js
 * Project : iTrAlytics
 */
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchReportsData } from '../../actions';

import { Field, reduxForm } from 'redux-form';

import moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DropdownList from 'react-widgets/lib/DropdownList';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';
import $ from 'jquery';
window.jQuery = $;
require('materialize-css/dist/js/materialize.js');

moment.locale('gr');
momentLocalizer(moment);

const renderMetricsDropdownList = ({ input }) => {
  const metrics = [
    { metric: 'Pageviews', value: 'ga:pageviews' },
    { metric: 'Unique Pageviews', value: 'ga:uniquePageviews' }
  ];

  const initVal = () => {
    input.onChange(metrics[0]);
  };

  return (
    <DropdownList
      {...input}
      data={metrics}
      valueField='value'
      textField='metric'
      value={input.value || initVal()}
      onChange={value => input.onChange(value)}
    />
  );
};

const renderDimensionsDropdownList = ({ input }) => {
  const dimensions = [
    { dimension: 'Month', value: 'ga:month' },
    { dimension: 'Year', value: 'ga:year' },
    { dimension: 'Week', value: 'ga:week' },
    { dimension: 'Day', value: 'ga:day' }
  ];

  const initVal = () => {
    input.onChange(dimensions[0]);
  };

  return (
    <DropdownList
      {...input}
      data={dimensions}
      valueField='value'
      textField='dimension'
      value={input.value || initVal()}
      onChange={ (value) => input.onChange(value)}
    />
  );
};

const renderStartDateTimePicker = ({ input: { onChange, value }, showTime }) => {
  // eslint-disable-next-line
  let beforeYesterday = new Date(new Date().getTime() - 48 * 60 * 60 * 1000);
  let twoYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 2));
  let twoMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() -2));

  const initDate = () =>{
    let oneYearAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    onChange(oneYearAgo);
  };

  return (
    <DateTimePicker
      onChange={onChange}
      format="YYYY-MM-DD"
      time={false}
      min={twoYearsAgo}
      max={twoMonthsAgo}
      value={!value ? initDate() : new Date(value)}
    />
  );
};

const renderEndDateTimePicker = ({ input: { onChange, value }, showTime }) => {
  let yesterday = new Date(new Date().getTime() - 48 * 60 * 60 * 1000);
  let twoYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 2));

  const initDate = () =>{
    onChange(yesterday);
  };

  return (
    <DateTimePicker
      onChange={onChange}
      format="YYYY-MM-DD"
      time={false}
      min={twoYearsAgo}
      max={yesterday}
      value={!value ? initDate() : new Date(value)}
    />
  );
};

class ReportsParams extends Component {
  onFormParamsSubmit(values) {
    // do not submit, in order to prevent page reload
    //event.preventDefault();
    let startDate, endDate;

    /** DEBUG */
    /*
    console.log('VALUES:', values);
    console.log(
      `~~ON formSubmit: PROPS: ${JSON.stringify(this.props, null, '\t')}`
    );
    */

    if (typeof values.startDate !== 'string') {
      startDate = moment(values.startDate).format('YYYY-MM-DD');
    }

    if (typeof values.endDate !== 'string') {
      endDate = moment(values.endDate).format('YYYY-MM-DD');
    }

    /** DEBUG */
    /*
    console.log(
      `~~ON formSubmit:
      Before selects
      startDate: ${startDate}, endDate: ${endDate}`
    );
    */

    let dateRange = {
      startDate: startDate,
      endDate: endDate
    };

    let metricsExpression = {
      text: values.metrics.metric,
      value: values.metrics.value
    };

    let dimensionsName = {
      text: values.dimensions.dimension,
      value: values.dimensions.value
    };

    /** DEBUG */
    /*
    console.log(
      `~~ON formSubmit:
      Before dispatchFetchReportsData  toString()
      startDate: ${dateRange.startDate}, endDate: ${dateRange.endDate}
      metricsExpression: ${metricsExpression}, dimensionsName: ${dimensionsName}
      `
    );
    */

    // make a call to the analytics report api
    _.map(this.props.profiles, profile => {
      this.props.dispatchFetchReportsData(
        profile,
        dateRange,
        metricsExpression,
        dimensionsName
      );
    });

    // clear the input
    //this.setState({});
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className=" blue-grey darken-2 z-depth-4" style={{ padding: `15px` }}>
        <div className="row">
          <div className="container">
            <h3>Configure Reports Params</h3>
            <blockquote>
              <small>Make your selections and hit the "GET REPORT" button</small>
            </blockquote>
            <form
              onSubmit={handleSubmit(this.onFormParamsSubmit.bind(this))}
              className="input-group col s12"
            >
              <div className="row">
                <div className="col l3 s12">
                  <label>Start Date</label>
                  <Field
                    name="startDate"
                    component={renderStartDateTimePicker}
                  />
                </div>
                <div className="col l3 s12">
                  <label>End Date</label>
                  <Field
                    name="endDate"
                    component={renderEndDateTimePicker}
                  />
                </div>
                <div className="col l3 s12">
                  <label>Metrics Expression</label>
                  <Field
                    name="metrics"
                    component={renderMetricsDropdownList}
                  />
                </div>
                <div className="col l3 s12">
                  <label>Dimensions Name</label>
                  <Field
                    name="dimensions"
                    component={renderDimensionsDropdownList}
                  />
                </div>
              </div>
              <div className="input-group-btn">
                <button
                  type="submit"
                  className="btn btn-secondary right white-text"
                >
                  Get Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ profiles }) {
  return {
    profiles
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatchFetchReportsData: (...args) => dispatch(fetchReportsData(...args))
  };
}

export default reduxForm({
  form: 'paramsForm'
})(connect(mapStateToProps, mapDispatchToProps)(ReportsParams));
