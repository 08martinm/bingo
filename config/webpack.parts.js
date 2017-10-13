// This file aggregates exports from files in folder 'webpack'
// Special handling needed for arrays.

const path = require('path');
const fs = require('fs');
const normalizedPath = path.join(__dirname, 'webpack');

fs.readdirSync(normalizedPath).forEach(file => {
  let part = require('./webpack/' + file);
  
  for (var prop in part) {
    if (part[prop].array) {
      exports[prop] = part[prop].data;
    } else {
      exports[prop] = part[prop];
    }
  }

});
