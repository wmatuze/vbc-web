const { exec } = require('child_process');
const path = require('path');

console.log('Stopping any running server...');

// Function to execute a command and return a promise
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    
    const childProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
      }
      
      console.log(`Command stdout: ${stdout}`);
      resolve(stdout);
    });
    
    // Forward output to console in real-time
    childProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    childProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
  });
}

async function main() {
  try {
    // Run the seed script
    console.log('Seeding the database...');
    await executeCommand('node seed/index.js');
    
    // Start the server
    console.log('Starting the server...');
    await executeCommand('node server.js');
  } catch (error) {
    console.error('Failed to execute commands:', error);
    process.exit(1);
  }
}

main();
