'use strict';

var Hapi = require('hapi');
var Path = require('path');
var async = require('async');
var validator = require('tv4');
var schema = require('./payload_schema.js');
var _ = require('lodash');

module.exports = () => {
  var server = new Hapi.Server();
  server.connection({
    host: '0.0.0.0',
    port: 8888
  });

  server.register(require('inert'), (err) => {
    if (err) {
      console.log('Failed to load inert.');
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: {
      file: Path.join(__dirname, './public/index.html')
    }
  });

  server.route({
    method: 'POST',
    path: '/hometrack',
    handler: (request, reply) => {
      // Check payload and it is an array
      if (!request.payload.hasOwnProperty('payload') || !Array.isArray(request.payload.payload)) {
        return reply({
          error: 'Could not decode request: JSON parsing failed'
        }).code(400);
      }
      // Each item is validated with schema
      var invalid = false;
      var validateResult;
      request.payload.payload.forEach((x) => {
        validateResult = validator.validateResult(x, schema);
        if (!validateResult.valid) {
          invalid = true;
        }
      });
      if (invalid) {
        return reply({
          error: 'Could not decode request: JSON parsing failed'
        }).code(400);
      }

      var completedWorkflows = _.filter(request.payload.payload, {
        workflow: 'completed',
        type: 'htv'
      });

      var completedProperties = [];
      if (completedWorkflows !== undefined) {
        completedProperties = _.map(completedWorkflows, (x) => {
          var objs = {};
          objs.concataddress = x.address.buildingNumber;
          objs.concataddress += ' ';
          objs.concataddress += x.address.street;
          objs.concataddress += ' ';
          objs.concataddress += x.address.suburb;
          objs.concataddress += ' ';
          objs.concataddress += x.address.state;
          objs.concataddress += ' ';
          objs.concataddress += x.address.postcode;
          objs.type = x.type;
          objs.workflow = x.workflow;
          return objs;
        });
      }
      reply({
        response: completedProperties
      });
    }
  });

  var start = (done) => {
    server.start(done);
  };

  var stop = (done) => {
    async.series([
      (next) => {
        server.stop({
          timeout: 1000
        }, next);
      }
    ], done);
  };

  return {
    start: start,
    stop: stop
  };
};
