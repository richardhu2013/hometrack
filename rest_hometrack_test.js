'use strict';

var fs = require('fs');

var hometrackServer;
var hometrackClient = require('nodeunit-httpclient').create({
  host: '127.0.0.1',
  port: 8888,
  path: '/',
  status: 200
});

exports.rest_hometrack = {

  'hometrack server': (test) => {
    hometrackServer = require('./server.js')();
    hometrackServer.start(test.done);
  },

  'post a list of home addresses and return 2 with workflow completed and type htv': (test) => {
    hometrackClient.post(
      test,
      'hometrack', {
        data: fs.readFileSync('./testfiles/request.json', 'utf8')
      }, (res) => {
        var reply = JSON.parse(res.body);
        test.equal(reply.response.length, 2);
        test.done();
      });
  },

  'Verify missing attribute is checked and return error message': (test) => {
    hometrackClient.post(
      test,
      'hometrack', {
        data: fs.readFileSync('./testfiles/wrongrequest.json', 'utf8')
      }, {
        status: 400
      }, (res) => {
        var reply = JSON.parse(res.body);
        test.equal(reply.error, 'Could not decode request: JSON parsing failed');
        test.done();
      });
  },

  'Verify normal wrong format json data is not accepted and return error message ': (test) => {
    hometrackClient.post(
      test,
      'hometrack', {
        data: {
          addr: 'somethingwrong'
        }
      }, {
        status: 400
      }, (res) => {
        var reply = JSON.parse(res.body);
        test.equal(reply.error, 'Could not decode request: JSON parsing failed');
        test.done();
      });
  },

  'quit homerack server': (test) => {
    hometrackServer.stop(test.done);
  }
};
