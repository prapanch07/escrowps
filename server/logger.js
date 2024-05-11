const fs = require('fs');
const path = require('path');

// Define the path to the log file
const logFilePath = path.join(__dirname, 'output.log');

// Create a write stream to the log file
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Redirect console output to the log file
console.log = (message) => {
  logStream.write(`${new Date().toISOString()} [INFO] ${message}\n`);
  process.stdout.write(`${new Date().toISOString()} [INFO] ${message}\n`);
};

console.error = (error) => {
  logStream.write(`${new Date().toISOString()} [ERROR] ${error.stack}\n`);
  process.stderr.write(`${new Date().toISOString()} [ERROR] ${error.stack}\n`);
};

// Close the log stream when the application exits
process.on('exit', () => {
  logStream.end();
});

module.exports = logStream;
