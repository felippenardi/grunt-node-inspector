/*jshint node: true, expr: true*/
/*global describe, before, it*/
var spawn = process.platform === 'win32' ? require('win-spawn') : require('child_process').spawn;
var logOutput = '';
require('should');

function runInspector(target, done) {
  'use strict';
  var inspectorProcess = spawn('grunt', ['node-inspector:' + target], {detached: true});

  inspectorProcess.stdout.setEncoding('utf8');
  inspectorProcess.stdout.on('data', function (data) {
    logOutput += data;
    if (data.match(/debugging/)) {
      // Kill all processes spawned by `grunt xxx`
      process.kill(-inspectorProcess.pid);
      done();
    }
  });
}

describe('grunt-node-inspector', function () {
  'use strict';

  describe('when run', function () {

    before(function (done) {
      runInspector('custom', done);
    });

    it('should log that the server started', function () {
      logOutput.should.containEql('Visit http://localhost:1337/');
      logOutput.should.containEql('?ws=localhost:1337&port=5857');
    });

  });

});
