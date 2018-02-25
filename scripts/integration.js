const path = require('path');
const spawn = require('cross-spawn');
 
// Build demo/test app
const serverProcess = spawn(
  'npm',
  ['run', 'demo:serve-dist'],
  { stdio: 'inherit' }
);

// Syncronously run cypress run command
const testProcess = spawn.sync(
  'npm',
  ['run', 'cypress:run'],
  { stdio: 'inherit' }
);

// When Cypress test process terminates - kill the http-server process
serverProcess.kill();
