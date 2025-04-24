const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

// Paths to clear
const pathsToClear = [
  path.join('apps', 'website', 'node_modules', '.vite'),
  path.join('apps', 'website', '.vite'),
  path.join('apps', 'website', 'dist')
];

console.log('Clearing Vite cache...');

// Clear each path
pathsToClear.forEach(cachePath => {
  if (fs.existsSync(cachePath)) {
    console.log(`Removing ${cachePath}...`);
    rimraf.sync(cachePath);
    console.log(`Removed ${cachePath}`);
  } else {
    console.log(`Path ${cachePath} does not exist, skipping`);
  }
});

console.log('Vite cache cleared successfully!');
console.log('Please restart your development server with: cd apps/website && npm run dev');
