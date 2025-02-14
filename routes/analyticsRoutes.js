/**
 * File    : analyticsRoutes.js
 * Project : iTrAlytics
 */
const requireLogin = require('../middlewares/requireLogin');
const validateAccessToken = require('../middlewares/validateAccessToken');

const rp = require('request-promise-native');

/**
 * make request with the accessToken either:
 * https://www.googleapis.com/analytics/v3/management/accountSummaries?access_token=${req.user.googleAccessToken}
 * either in the header, like below
 * we make 2 requests, both of them GET.
 * 1: @https://www.googleapis.com/analytics/v3/management/accounts
 *  to get the account Id
 * 2: @https://www.googleapis.com/analytics/v3/management/accounts/accountId/webproperties
 *  to get the ids of the websites we want to get analytics data for.
 *
 * @param app
 */
module.exports = app => {
  /**
   * GET /api/analytics/accountSummary
   */
  app.get(
    '/api/analytics/accountSummary',
    requireLogin,
    validateAccessToken,
    async (req, res) => {
      //do we have a cached version?
      if (req.session['gaProfiles']) {
        console.log('Google Profile from cache');
        console.log(JSON.stringify(req.session['gaProfiles'], null, 2));
        res.status(200).send(JSON.parse(req.session['gaProfiles']));
        return;
      }
      try {
        /** DEBUG */
        /*
        console.log('*****************');
        console.log('REQ.USER', req.user);
        console.log('*****************');
        */
        const analyticsAccounts = await rp({
          url: 'https://www.googleapis.com/analytics/v3/management/accounts',
          auth: {
            bearer: req.user.googleAccessToken
          },
          json: true
        });

       /** DEBUG */

       console.log(`*** analyticsAccounts: ***
        ${JSON.stringify(analyticsAccounts, null, '\t')}
        *** *** *** *** *** *** *** *** ***
       `);


        // get the account id
        let accountId = analyticsAccounts.items[0].id;
        let profiles = [];
        const analyticsWebProperties = await rp({
          url: `https://www.googleapis.com/analytics/v3/management/accounts/${accountId}/webproperties`,
          auth: {
            bearer: req.user.googleAccessToken
          },
          json: true
        });

        /** DEBUG */
        /*
         console.log(`*** analyticsWebProperties: ***
         ${JSON.stringify(analyticsWebProperties, null, '\t')}
         *** *** *** *** *** *** *** *** ***
         `);
         */

        if (analyticsWebProperties.items.length < 1){
            throw new Error('Your Account does not have any Web Properties. Try add some or try with another account.');
        }

        analyticsWebProperties.items.forEach(function(webProp) {
          if (webProp.defaultProfileId) {
            profiles.push({
              id: 'ga:' + webProp.defaultProfileId,
              name: webProp.name,
              site: webProp.websiteUrl
            });
          }
        });

        req.session['gaProfiles'] = JSON.stringify(profiles);

        res.status(200).send(profiles);
      } catch (error) {
        console.error('/!\\ Error while trying to get Analytics Profiles:');
        console.log('Status Code: ', error.statusCode);
        console.log('Message: ', error.message);
        res.status(400).send();
      }
    }
  );

  /**
   * POST /api/analytics/reportsBatchGet
   */
  app.get(
    '/api/analytics/reportsBatchGet',
    requireLogin,
    validateAccessToken,
    async (req, res) => {
      try {
        if (!req.query.viewId) {
          console.error('/!\\ Error while trying to get Analytics Reports Data: NO profile ID provided');
          return res.status(400).send();
        }

        // set the params from the query OR to the defaults
        let viewId = req.query.viewId;

        let startDate =
          (req.query.startDate === 'undefined' || !req.query.startDate)
            ? '2017-07-01'
            : req.query.startDate;
        let endDate =
          (req.query.endDate === 'undefined' || !req.query.endDate) ? '2017-10-29' : req.query.endDate;

        let metricsExpression =
          (req.query.metricsExpression === 'undefined' || !req.query.metricsExpression)
            ? 'ga:pageviews'
            : req.query.metricsExpression;

        let dimensionsName =
          (req.query.dimensionsName === 'undefined' || !req.query.dimensionsName)
            ? 'ga:month'
            : req.query.dimensionsName;

        /** DEBUG */
        /*
        console.log('viewId =', viewId);
        console.log('startDate =', startDate);
        console.log('endDate =', endDate);
        console.log('metricsExpression =', metricsExpression);
        console.log('dimensionsName =', dimensionsName);
        */

        const analyticsReportsBatchGet = await rp({
          method: 'POST',
          url: 'https://analyticsreporting.googleapis.com/v4/reports:batchGet',
          auth: {
            bearer: req.user.googleAccessToken
          },
          body: {
            reportRequests: [
              {
                viewId: viewId,
                dateRanges: [
                  {
                    startDate: startDate,
                    endDate: endDate
                  }
                ],
                metrics: [
                  {
                    expression: metricsExpression
                  }
                ],
                dimensions: [
                  {
                    name: dimensionsName
                  }
                ]
              }
            ]
          },
          json: true
        });

        let analyticsData = analyticsReportsBatchGet.reports[0].data;

        /** DEBUG */
        /*
        console.log(`analyticsData:
        ${ JSON.stringify(analyticsData, null, '\t')}
        `);
        */

        res.status(200).send(analyticsData);
      } catch (error) {
        console.error('/!\\ Error while trying to get Analytics Reports Data:');
        console.log('Status Code: ', error.statusCode);
        console.log('Message: ', error.message);
        res.status(400).send();
      }
    }
  );
};
